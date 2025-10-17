# **Technical Specification: Finance with AI**

## **1\. Project Overview**

Project Name: Finance with AI  
Goal: To create a secure, highly interactive, and intuitive personal finance tracking application. The key innovation is the ability to record transactions using both a traditional form and a natural language chat interface powered by a Large Language Model (LLM).  
**Target Users:** Individuals seeking a modern, fast, and effortless way to monitor and manage their daily income and expenses.

## **2\. Technology Stack**

| Layer | Technology | Rationale |
| :---- | :---- | :---- |
| **Frontend** | Next.js (App Router, latest) | Modern React framework for performance, routing, and server-side capabilities. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid, responsive, and mobile-first design development. |
| **Animation** | Framer Motion | Declarative library for production-ready UI animations and seamless transitions. |
| **Database & Auth** | Supabase (Postgres DB \+ Auth) | Open-source Firebase alternative providing a robust relational database (Postgres) and built-in, scalable authentication. |
| **AI/LLM** | Gemini 2.5 Flash | Fast, efficient LLM used for parsing natural language into structured transaction data (JSON). |
| **Language** | TypeScript | Strong typing for better code quality and reduced runtime errors. |

## **3\. Core Functional Requirements**

### **3.1. User & Security**

* **Authentication:** Secure user registration, login, and session management using Supabase Auth (supporting email/password and potential future social sign-ins).  
* **Data Isolation:** All user transaction data must be isolated and protected via Row-Level Security (RLS) policies in Supabase, ensuring users can only access their own records.

### **3.2. Transaction Recording (Manual)**

* A dedicated page/modal for standard transaction entry.  
* Fields required: Amount, Date, Description, Type (Income/Expense), and Category (pre-defined list: Food, Bills, Salary, Transport, etc.).

### **3.3. Transaction Recording (AI Chat \- Primary Feature)**

* A chat interface (similar to a standard messaging app) where the user can input a transaction in natural language (e.g., "Gave my brother $50," or "Paid rent $1,200 yesterday").  
* **Parsing Logic:** The user's input is sent to the Gemini API.  
* **Structured Output:** Gemini 2.5 Flash is prompted to return a standardized JSON object that includes the parsed Amount, Category, Description, and Type (Income/Expense).  
* **Confirmation:** The app displays the parsed result to the user (e.g., "AI detected: Expense, $50.00, Category: Transfer/Gift. Confirm?"). The transaction is only saved upon user confirmation.  
* **Error Handling:** If the LLM output is malformed or missing key data, the user is prompted to refine their input or use the manual form.

### **3.4. Dashboard & Reporting**

* **Dashboard:** Displays overall current balance and a summary of recent transactions.  
* **Visualizations:** Basic charts (e.g., using a lightweight charting library like Recharts/Nivo) showing expense distribution by category over the last 30 days.

## **4\. AI Integration (Gemini 2.5 Flash)**

**Model:** gemini-2.5-flash-preview-09-2025

**API Usage:** generateContent with **structured JSON output**.

**System Instruction (Example):**

"You are a professional financial parser. Your sole task is to convert the user's natural language input into a strict JSON format describing a financial transaction. You must infer the type (income or expense) and assign one of the predefined categories. Respond ONLY with the JSON object."

**Required Output Schema (JSON Schema):**

{  
  "type": "OBJECT",  
  "properties": {  
    "amount": { "type": "NUMBER", "description": "The numeric value of the transaction." },  
    "type": { "type": "STRING", "enum": \["income", "expense"\] },  
    "category": { "type": "STRING", "enum": \["Food", "Transport", "Bills", "Salary", "Shopping", "Entertainment", "Transfer", "Other"\] },  
    "description": { "type": "STRING", "description": "A concise summary of the transaction." }  
  }  
}

## **5\. Data Model (Supabase/Postgres)**

**Table:** transactions

| Column Name | Data Type | Constraint/Reference | Description |
| :---- | :---- | :---- | :---- |
| id | uuid | Primary Key | Unique transaction identifier. |
| user\_id | uuid | Foreign Key to auth.users.id | Links transaction to the authenticated user. |
| created\_at | timestamp with time zone | Default: now() | Timestamp of record creation. |
| transaction\_date | date | Not Null | The actual date the transaction occurred. |
| amount | numeric(10, 2\) | Not Null | Transaction value, precise to 2 decimal places. |
| type | text | Check constraint: 'income' or 'expense' | Defines the flow of money. |
| category | text | Not Null | LLM-assigned or manually selected category. |
| description | text | Nullable | User-provided or AI-parsed description. |

## **6\. UI/UX and Aesthetics (Tailwind CSS & Framer Motion)**

* **Responsive Design:** Mobile-first approach using Tailwind CSS breakpoints to ensure optimal display and usability on small screens (critical for a finance app).  
* **Aesthetics:** Clean, modern, and dark-mode friendly design. Use a professional, financial color palette (e.g., green for income, red for expense, and a neutral background).  
* **Framer Motion Implementation:**  
  * **Page Transitions:** Smooth fading or sliding transitions between the Dashboard and the Transaction/Chat screens.  
  * **Modal/Drawer:** Animated entrance and exit for the new transaction modal/sheet.  
  * **Chat Bubbles:** Subtle animations (e.g., slight bounce or fade-in) when new AI chat responses are received.  
* **Layout:** The main content should be centered and contained (max-w-xl or similar) for focus, especially on desktop.