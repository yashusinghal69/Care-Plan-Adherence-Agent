# 💙 CareSync AI — Smart Healthcare Agent Suite

A multi-agent healthcare automation platform built with Langflow and React. It streamlines patient registration, automates care plan adherence tracking, intelligently schedules daily tasks, and integrates structured patient data into EHR systems.

### **🌐 Deployed Agent UI:** [Care Plan Adherence Agent](https://your-deployed-app-url.com)
---


## 🧠 Project Overview

CareSync AI brings together three core Langflow agents powered by GPT-4o-mini and custom logic:

1. **📥 Data Ingestion Agent** – Extracts structured patient care data from free-form inputs into clean JSON for EHR ingestion.
2. **📅 Task Scheduler Agent** – Generates personalized daily care tasks using patient care plans and intelligently syncs with calendars.
3. **📊 Adherence Checker Agent** – Calculates patient adherence from task responses, flags non-compliance, and suggests follow-up.

All agents are backed by a beautiful and intuitive React + Tailwind CSS frontend for seamless healthcare workflow management.

---

## 🚀 Demo Screenshots

### 🔹 UI Dashboard (React + Tailwind)
![HealthTracker UI](./public/images/Ui.png)

### 🔹 Langflow – Data Ingestion Agent
![Data Ingestion](./public/images/Data_Ingestion.png)

### 🔹 Langflow – Task Scheduler Agent
![Scheduler Agent](./public/images/Task_schedular.png)


### 🔹 Langflow – Adherence Checker Agent
![Adherence Agent](./public/images/Adherence.png)
---

## 🧱 Tech Stack

| Layer            | Tools Used                         |
|------------------|------------------------------------|
| 🧠 AI Workflows   | [Langflow](https://langflow.org), OpenAI GPT-4o-mini, Prompt Engineering |
| 🌐 Frontend      | React, TypeScript, Tailwind CSS, Shadcn UI |
| 📊 Data Handling | MongoDB Atlas, OpenAI Embeddings, Structured Output |
| 🔌 APIs          | Telegram Bot API, Langflow REST API |
| 🛠 Dev Tools     | Vite, ESLint, PostCSS, GitHub       |

---
 
## 🧩 System Architecture

```
[User Input] ➝ Langflow Agents ➝ JSON Structuring ➝ MongoDB + EHR ➝ Task Scheduler ➝ Adherence Evaluator ➝ UI
```

- Each agent is modular and independently callable  
- MongoDB stores all care plans and task execution logs  
- Telegram integration allows patient-side task confirmations  
- React UI allows real-time registration, tracking, and analytics

---

## 🧪 Modules & Workflows

### 1. 📥 **Data Ingestion Agent**
- Takes raw patient text (e.g. care plans, notes)  
- Converts to structured JSON  
- Stores in MongoDB `Care_Plan` → `EHR` collection

### 2. 📅 **Task Scheduler Agent**
- Searches for care plan  
- Uses Langflow + Prompt templates to convert into actionable tasks  
- Adds tasks to DB & sends updates via Telegram

### 3. 📊 **Adherence Checker Agent**
- Collects daily responses  
- Flags non-adherence and low adherence rates  
- Returns clean JSON (`adherence_rate`, `non_adherence_flag`, `follow_up_needed`)

---

## 🖥️ UI Functionality

- **Patient Registration Hub** – Capture ID, name, age, medications , exercise
- **Schedule Management** – Assign routines & medication timing  
- **Adherence Analytics** – Track patient progress visually

---

## 📁 Folder Structure (Frontend)

```
/public
/src
├─ components
│ └─ ui/
├─ hooks/
├─ lib/
├─ App.tsx
├─ main.tsx
├─ index.css
tailwind.config.ts
package.json
vite.config.ts
```
---

## 📦 Setup Instructions

### 🛠 Prerequisites
- Node.js v18+  
- npm  
- MongoDB Atlas cluster  
- OpenAI API Key  

### 🧪 Run Frontend Locally

```bash
git clone https://github.com/yashusinghal69/Care-Plan-Adherence-Agent.git
cd  Care-Plan-Adherence-Agent
npm install
npm run dev
```

### 🌐 Deploy Langflow Agents

Use Docker or Langflow Cloud
Each flow can be triggered via:

```bash
POST /api/v1/run/:secret_flow_id
```

---
 



 


 
 
 
