#%%
import csv
from datetime import datetime
from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.output_parsers import JsonOutputParser
import os
from dotenv import load_dotenv

load_dotenv()
folder_path = os.getenv("folder_path")
# Initialize necessary components
local_llm = 'phi3'  # llama3
embedding = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
persist_directory = folder_path+"/chroma/"
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
retriever = vectordb.as_retriever(search_type="mmr")
llm = ChatOllama(model=local_llm, format="json", temperature=0)

# Set up a parser + inject instructions into the prompt template.
parser = JsonOutputParser()

prompt = PromptTemplate(
    template="""You are a personal financial planning assistant for question-answering tasks.
    Use the following pieces of retrieved context to answer the question
    meaningfully. If you don't know the answer, just respond in json with 'no answer'.
    Use six sentences maximum and keep the answer concise
    {context}
    Question: {question}
    Respond in json with 'answer'""",
    input_variables=["question", "context"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

rag_chain = prompt | llm | parser

#%%
question = "How do I balance saving and investing?"

#%% Stream based output
start_time = datetime.now()
docs = retriever.invoke(question)
for response in rag_chain.stream({"context":docs,"question":question}):
    print(response)

print("Final response")    
print(response)
end_time = datetime.now()
time_taken = end_time - start_time
# Log the query, answer, and time taken in a CSV file
with open('log.csv', 'a', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow([question, response, time_taken])
