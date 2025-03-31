# FinWise - AI Voice Assistant Enabled Banking Application

## Summary

This project is a banking application that integrates an AI voice assistant, built using the MERN stack (MongoDB, Express.js, React, Node.js) and Python/Flask for voice interaction. It enables users to manage their finances through features like account management, goal tracking, budgeting, and micro-investments. The application utilizes an AI agent for command interpretation and tool invocation.

## Features

- **User Authentication:** Secure login and registration using JWT.
- **Account Management:** View account details, track expenses, and visualize financial data through charts and graphs.
- **Goal Tracking:** Future goal-setting with expenditure and savings analysis, monitor progress with visual progress bars, and categorize goals.
- **Budget Management:** Add transactions, round amounts to manage savings, and view transaction history by day, week, or month.
- **Micro-investments:** Track savings and allocate funds for various investment categories.
- **AI Voice Assistant:**
  - Voice-activated interaction using the Web Speech API.
  - AI Agent for command interpretation and tool invocation (LangChain and Groq API).
  - Voice command interpretation for navigation and data management.
  - Text-to-Speech feedback.
- **Data Persistence:** MongoDB for secure and efficient data storage.

## Technologies Used

- **Frontend:**
  - React.js
  - Web Speech API
- **Backend:**
  - Node.js
  - Express.js
  - JWT Authentication
- **Database:**
  - MongoDB
- **Voice Assistant:**
  - Python
  - Flask
  - LangChain
  - Groq API

## Links

- Project Doc:
- Presentation:

## Setup Instructions

1.  **Clone the Repository:**

    ```bash
    git clone [repository URL]
    ```

2.  **Install Dependencies:**

    - **Backend (Node.js/Express):**
      ```bash
      cd server
      npm install
      npm install jsonwebtoken
      npm install cookie-parser
      ```
    - **Voice Assistant (Python/Flask):**
      ```bash
      cd voice-assistant
      pip install -r requirements.txt
      ```
    - **Frontend (React):**
      ```bash
      cd client
      npm install
      ```

3.  **Configure Environment Variables:**

    - Create `.env` files in `server/` and `voice-assistant/` directories.
    - Add necessary variables (e.g., MongoDB connection string, Groq API key).

4.  **Start the Application:**
    - Start MongoDB.
    - Start Backend:
      ```bash
      cd server
      node server.js
      ```
    - Start Frontend:
      ```bash
      cd client
      npm run dev
      ```
    - Start Voice Assistant:
      ```bash
      cd voice-assistant
      python app.py
      ```

## Future Enhancements

- **External API Integration:**
  - Integrate banking and investment APIs for real-time data.
- **Enhanced Voice Assistant:**
  - Improve speech recognition accuracy.
  - Support a wider range of voice commands.
- **Advanced Visualizations:**
  - Implement more sophisticated financial charts and graphs.
- **User Feedback and Reporting:**
  - Add features for user feedback and detailed financial reports.
- **Security Improvements:**
  - Enhance security measures to protect user data.
