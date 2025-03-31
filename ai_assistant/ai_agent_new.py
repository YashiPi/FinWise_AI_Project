import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
import requests
import re


load_dotenv()

groq_api_key = os.environ['GROQ_API_KEY']

memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)

llm = ChatGroq(groq_api_key=groq_api_key, model_name = "gemma2-9b-it", temperature=0)

BASE_URL = "http://127.0.0.1:5000"

# API Endpoints
CHECK_BALANCE_URL = f"{BASE_URL}/check_balance"
TRANSFER_MONEY_URL = f"{BASE_URL}/transfer_money"
SET_GOALS_URL = f"{BASE_URL}/api/goals"
TRANSFER_MONEY_URL = f"{BASE_URL}/transfer_money"
TRANSACTIONS_URL = f"{BASE_URL}/api/transactions"

def check_balance(user_id):
    response = requests.get(CHECK_BALANCE_URL, params={"userId": user_id})
    if response.status_code == 200:
        return f"Your balance is ₹{response.json().get('balance')}"
    return "Could not retrieve balance."



NODE_API_BASE_URL = "http://localhost:5000/api"

# GOAL TRACKER ROUTES
def set_goals(user_id):
    """Prompt user for expenditure and savings goals, then send to Node.js backend."""
    expenditure_goal = float(input("Enter your monthly expenditure goal: "))
    savings_goal = float(input("Enter your monthly savings goal: "))

    data = {
        "userId": user_id,
        "expenditureGoal": expenditure_goal,
        "savingsGoal": savings_goal,
    }

    url = f"{NODE_API_BASE_URL}/goals"
    response = requests.post(url, json=data)

    if response.status_code == 200:
        return "Your goals have been set successfully!"
    return "Failed to set goals."


def get_goals(user_id):
    """Fetch goal records for a user from the Node.js backend."""
    url = f"{NODE_API_BASE_URL}/goals/{user_id}"
    response = requests.get(url)
    if response.status_code == 200:
        goal_data = response.json()
        return f"Your goal data: {goal_data}"
    return "Could not retrieve goal data."

def add_savings(user_id):
    """Prompt user for savings details and add to Node.js backend."""
    category = input("Enter savings category: ")
    amount = float(input("Enter savings amount: "))
    description = input("Enter a description for savings: ")

    data = {
        "userId": user_id,
        "category": category,
        "amount": amount,
        "description": description,
    }

    url = f"{NODE_API_BASE_URL}/savings"
    response = requests.post(url, json=data)

    if response.status_code == 200:
        return "Savings added successfully!"
    return "Failed to add savings."

def add_expenditure(user_id, user_input =None):
    """Prompt user for expenditure details and add to Node.js backend."""

    # if user_input is None:  # Initial call from the agent
    #     return "Please provide the category, amount, and an optional description for the expenditure in a single sentence."
    # else:
    #     try:
    #         category_match = re.search(r"category:\s*([\w\s]+)", user_input, re.IGNORECASE)
    #         amount_match = re.search(r"amount:\s*([\d.]+)", user_input, re.IGNORECASE)
    #         description_match = re.search(r"description:\s*([\w\s]+)", user_input, re.IGNORECASE)

    #         if category_match and amount_match:
    #             category = category_match.group(1).strip()
    #             amount = float(amount_match.group(1).strip())
    #             description = description_match.group(1).strip() if description_match else None

    #             expenditure_data = {
    #                 "userId": user_id,
    #                 "category": category,
    #                 "amount": amount,
    #                 "description": description,
    #             }

    #             url = f"{NODE_API_BASE_URL}/expenditure"
    #             response = requests.post(url, json=expenditure_data)

    #             if response.status_code == 200:
    #                 return "Expenditure added successfully."
    #             else:
    #                 return "Failed to add expenditure."
    #         else:
    #             return "Invalid input format. Please provide category and amount."
            
    #     except Exception as e:
    #         return f"Error adding expenditure: {e}"

    category = input("Enter expenditure category: ")
    amount = float(input("Enter expenditure amount: "))
    description = input("Enter a description for expenditure: ")

    data = {
        "userId": user_id,
        "category": category,
        "amount": amount,
        "description": description,
    }

    url = f"{NODE_API_BASE_URL}/expenditure"
    response = requests.post(url, json=data)

    if response.status_code == 200:
        return "Expenditure added successfully!"
    return "Failed to add expenditure."


# BUDGET LOGIC
def get_total_savings(user_id):
    """Fetches the total savings from rounded transactions."""
    url = f"{NODE_API_BASE_URL}/budget/total-savings/{user_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return f"Your total savings from rounding transactions is {data['totalSavings']}."
    return "Failed to fetch total savings."

# TRANSACTION ROUTES
def get_user_transactions(user_id):
    """Fetches all transactions for a specific user."""
    url = f"{NODE_API_BASE_URL}/transactions/{user_id}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    return {"error": "Failed to fetch transactions"}

def add_transaction(user_id="67e96c0be6c7599def34e657", amount=500, date=None, rounding_type="nearest-tens"):
    """Adds a new transaction for a user."""
    url = f"{NODE_API_BASE_URL}/transactions"
    payload = {
        "userId": user_id,
        "amount": amount,
        "date": date,
        "roundingType": rounding_type
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to add transaction"}

# MICROINVESTMENT ROUTES
def get_microinvestments(user_id):
    """Fetches all microinvestment allocations for a specific user."""
    url = f"{NODE_API_BASE_URL}/microinvestment/{user_id}"
    response = requests.get(url)

    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to fetch microinvestment allocations"}

def add_microinvestment(user_id, category, amount, description=""):
    """Adds a new microinvestment allocation."""
    url = f"{NODE_API_BASE_URL}/microinvestment"
    payload = {
        "userId": user_id,
        "category": category,
        "amount": amount,
        "description": description
    }
    response = requests.post(url, json=payload)

    if response.status_code == 200:
        return response.json()
    return {"error": "Failed to add microinvestment"}

def go_to_add_transaction(action_input=None):
    """Navigates to the add transaction page."""
    return "http://localhost:5174/budget"

def go_to_budget(action_input=None):
    """Navigates to the budget page."""
    return "http://localhost:5174/budget"

def go_to_goals(action_input=None):
    """Navigates to the goals page."""
    return "http://localhost:5174/goal"

def go_to_microinvest(action_input=None):
    """Navigates to the micro-investing page."""
    return "http://localhost:5174/micro"


# def handle_general_query(user_query):
#     prompt = PromptTemplate.from_template("Answer this banking query: {query}")
#     chain = prompt | llm
#     response = chain.invoke({"query": user_query})
#     return response.content.strip()



user_id = "67e96c0be6c7599def34e657"
check_balance_tool = Tool(
    name="Check Balance",
    func = lambda _: check_balance(user_id),
    description="Retrieve the user's bank balance instantly. Always return the balance directly."
)


# transfer_money_tool = Tool(
#     name = "Transfer Money",
#     func = lambda _: transfer_money(user_id),
#     description="Transfers money from your account. You will be prompted to enter details. If the transaction is cancelled, do not pursue it further"
# )


set_goals_tool = Tool(
    name="Set Goals",
    func=lambda _: set_goals(user_id),
    description="Sets or updates a user's expenditure and savings goals."
)

goals_tool = Tool(
    name="Get Goals",
    func=lambda _: get_goals(user_id),
    description="Retrieve the user's goal records, including savings and expenditure details. Structure the data in a readabel format and provide a concise report of the goals data"
)

savings_tool = Tool(
    name="Add Savings",
    func=lambda _: add_savings(user_id),
    description="Adds a savings entry for the user. You will be prompted to enter the category, amount, and description."
)

expenditure_tool = Tool(
    name="Add Expenditure",
    func=lambda _: add_expenditure(user_id),
    description="Adds an expenditure entry for the user. The user will provide the amount, category details and decription optionally"
)


total_savings_tool = Tool(
    name="Total Savings Calculator",
    func=lambda _: get_total_savings(user_id),
    description="Fetches total savings based on transaction rounding."
)

fetch_transactions_tool = Tool(
    name="Fetch User Transactions",
    func=lambda user_id: get_user_transactions(user_id),
    description="Fetches all transactions for a user."
)

add_transaction_tool = Tool(
    name="Add Transaction",
    func=lambda _: add_transaction(),
    description="Adds a new transaction for the user."
)

go_to_add_transaction_tool = Tool(
    name="Go to Add Transaction",
    func=go_to_add_transaction,
    description="Return the URL directly, without any additional text. DO not send your final answer but return the response as it is"
)

go_to_budget_tool = Tool(
    name="Go to Budget",
    func=go_to_budget,
    description="Do not send your final answer, send the response of the function as it is"
)

go_to_goals_tool = Tool(
    name="Go to Goals",
    func=go_to_goals,
    description="DO NOT SEND your final answer or action_input, send the response of the function as it is"
)

go_to_microinvest_tool = Tool(
    name="Go to Microinvest",
    func=go_to_microinvest,
    description="Return the URL directly, without any additional text. DO not send your final answer but return the response as it is"
)


agent_executor = initialize_agent(
    tools = [
        check_balance_tool, 
        # set_goals_tool, 
        goals_tool, 
        savings_tool, 
        expenditure_tool, 
        # fetch_transactions_tool, 
        # add_transaction_tool, 
        total_savings_tool,
        go_to_add_transaction_tool,
        go_to_budget_tool,
        go_to_goals_tool,
        go_to_microinvest_tool,
        ],
    llm = llm,
    # agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,

    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    memory = memory,
    verbose=True
)

# if __name__ == "__main__":
#     ai_agent("user123")

query3 = "I want to set my monthly goals."
# query4 = "I want to add a transaction"
# query5 = "I want to add some savings"
# query6 = "Show me my goal progress"
# query7 = "I spent some money, record my expenditure"
# query8 = "I want to set my financial goals"
query9 = "Show me all my transactions"
# query10 = "Add a new transaction of ₹500 rounded to the nearest tens."
# query11 = "I want to add a new transaction"

query12 = "How much have I saved from rounding?"


# response8 = agent_executor.run(query9)
# response9 = agent_executor.run(query10)
# response10 = agent_executor.run(query11)

# response11 = agent_executor.run(query12)


# print(response8)  
# print(response9) 
# print(response10) 
# print(response11) 

# while True:
#     user_query = input("Enter your query(or type 'exit' to quit): ")
#     if user_query.lower() == "exit":
#         break
#     try:
#         response = agent_executor.run(user_query)
#         print(response)
#     except Exception as e:
#         print(f"An error occurered: {e}")

# print("Goodbye!")

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/process_query", methods=["POST"])
def process_query():
    data = request.json
    query = data.get("query")
    if not query:
        return jsonify({"error": "No query provided"}), 400

    try:
        response = agent_executor.run(query)
        if response.startswith("http://localhost:5174"):
            return jsonify({"navigation": response})
        
        return jsonify({"response": response})
    except Exception as e:
        print(f"Error processing query: {e}")
        return jsonify({"error": "An error occurred"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=3000)