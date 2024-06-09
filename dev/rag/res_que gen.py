from transformers import pipeline, set_seed, Conversation

# Load the pre-trained language model
model_name = "microsoft/DialoGPT-large"
nlp = pipeline('conversational', model=model_name)

# Load the text file
with open('data/preprocessed_text.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Set a random seed for reproducibility
set_seed(42)

# Split the text into smaller chunks
chunk_size = 512  # Adjust this value based on your needs
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

# Generate queries and responses for each chunk
for chunk in chunks:
    # Create a Conversation object
    conversation = Conversation()

    # Pass the chunk to the model to generate a query
    query = nlp(conversations=conversation, inputs=chunk)
    query_text = query.conversation.past_user_inputs[-1]

    # Pass the query and chunk to the model to generate a response
    response = nlp(conversations=query.conversation, inputs=query_text)

    # Print the generated query and response
    print("Query:", query_text)
    print("Response:", response.conversation.past_convai_inputs[-1])
    print()