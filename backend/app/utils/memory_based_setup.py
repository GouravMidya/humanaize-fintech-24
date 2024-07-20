from pymongo import MongoClient
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.vectorstores import Chroma
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_models import ChatOllama
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import HumanMessage, AIMessage
import os

from app.config import FOLDER_PATH,MONGO_DB_URL

# Connect to MongoDB 
mongo_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongo_client["chat_db"] 
collection = db["chat_history"]
financial_info_collection = db["financialinfos"]
from bson.objectid import ObjectId
# Statefully manage chat history
store = {}
    
def get_financial_info(user_id):
    obj_id = ObjectId(user_id)
    financial_info = financial_info_collection.find_one({"userId": obj_id})
    if financial_info:
        # Remove MongoDB-specific fields
        financial_info.pop('_id', None)
        return financial_info
    return None

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        # Load history from MongoDB
        chat_history_data = collection.find_one({"session_id": session_id})
        if chat_history_data:
            # Load the history from MongoDB into ChatMessageHistory
            chat_history = ChatMessageHistory()
            for msg in chat_history_data["history"]:
                if msg["type"] == "human":
                    chat_history.messages.append(HumanMessage(content=msg["content"]))
                elif msg["type"] == "ai":
                    chat_history.messages.append(AIMessage(content=msg["content"]))
            store[session_id] = chat_history
        else:
            store[session_id] = ChatMessageHistory()
    return store[session_id]

def save_session_history(session_id: str):
    chat_history = store.get(session_id)
    if chat_history:
        # Prepare the history data for MongoDB
        history_data = [
            {"type": "human", "content": msg.content} if isinstance(msg, HumanMessage) else {"type": "ai", "content": msg.content}
            for msg in chat_history.messages
        ]
        
        collection.update_one(
            {"session_id": session_id},
            {"$set": {"history": history_data}},
            upsert=True
        )



def setup_mem_components():
    local_llm = 'phi3'  # llama3
    embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_directory = os.path.join(FOLDER_PATH, "chroma/")
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    retriever = vectordb.as_retriever(search_type="mmr")
    llm = ChatOllama(model=local_llm, temperature=0)

    # Contextualize question
    contextualize_q_system_prompt = """Given a chat history and the latest user question \
    which might reference context in the chat history, formulate a standalone question \
    which can be understood without the chat history. Do NOT answer the question, \
    just reformulate it if needed and otherwise return it as is."""
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    history_aware_retriever = create_history_aware_retriever(
        llm, retriever, contextualize_q_prompt
    )

    # Answer question
    qa_system_prompt = """You are a personal financial planning assistant in India for question-answering tasks.
        Use the following pieces of retrieved context to answer the question
        meaningfully. If you don't know the answer, just say you don't have enough information.
        Use six sentences maximum and keep the answer concise.
        
        Consider when necessary the user's financial information when answering:
        Monthly Income: {monthly_income}
        Monthly Expenses: {monthly_expenses}
        Short Term Goals: {short_term_goals}
        Long Term Goals: {long_term_goals}
        Risk Tolerance: {risk_tolerance}
        Age: {age}
        
        Retrieved context:
        {context}
        
        When necessary personalize your response based on the user's specific financial situation.
        If you're asked about something unrelated to finance, politely redirect the conversation to financial topics."""
    print(qa_system_prompt)
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

    conversational_rag_chain = RunnableWithMessageHistory(
        rag_chain,
        get_session_history,
        input_messages_key="input",
        history_messages_key="chat_history",
        output_messages_key="answer",
    )
    
    return conversational_rag_chain
    
    