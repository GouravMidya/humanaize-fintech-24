import json
import os
from datetime import datetime
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOllama
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables
load_dotenv()
folder_path = os.getenv("folder_path")

# Initialize ChatOllama
local_llm = 'llama3'  # or 'llama3', depending on your setup
llm = ChatOllama(model=local_llm, format="json", temperature=0)

# Set up a parser
parser = JsonOutputParser()

# Define the prompt template
prompt = PromptTemplate(
    template="""You are a financial advisor specializing in budget optimization. Given a person's income and current expense allocation, your task is to:
    1. Analyze the current budget.
    2. Suggest optimized expense percentages that align with common financial wisdom.
    3. Provide actionable suggestions for improving the budget.

    Current budget:
    Income: {income}
    Expenses: {expenses}

    Please provide your response in JSON format with the following structure:
    {{
        "optimized_expenses": {{expense_category: optimized_percentage, ...}},
        "suggestions": ["suggestion1", "suggestion2", ...]
    }}

    Ensure that the optimized expense percentages add up to 100%.
    {format_instructions}
    """,
    input_variables=["income", "expenses"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

# Create the chain
optimization_chain = prompt | llm | parser

def optimize_budget(income, expenses):
    # Prepare the input data
    input_data = {
        "income": income,
        "expenses": expenses
    }

    # Run the optimization chain
    start_time = datetime.now()
    result = optimization_chain.invoke(input_data)
    end_time = datetime.now()
    time_taken = end_time - start_time

    # Log the query, answer, and time taken (you can modify this to use CSV if preferred)
    with open('budget_optimization_log.txt', 'a') as logfile:
        logfile.write(f"Input: {json.dumps(input_data)}\n")
        logfile.write(f"Output: {json.dumps(result)}\n")
        logfile.write(f"Time taken: {time_taken}\n\n")

    return result

# Example usage
if __name__ == "__main__":
    income = 5000
    expenses = {
        "Housing": 25,
        "Food": 15,
        "Transportation": 10,
        "Utilities": 10,
        "Entertainment": 10,
        "Savings": 20,
        "Other": 10
    }
    
    result = optimize_budget(income, expenses)
    print(json.dumps(result, indent=2))