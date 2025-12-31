# BeyondChats Assessment - Article Scraper & AI Rewriter

A full-stack application that scrapes articles from the BeyondChats blog, stores them in a database, and uses AI to rewrite them for a modern audience.

### Live Demo
* **Frontend UI:** [(https://beyond-chats-assignment-eight-smoky.vercel.app/)]
* **Backend API:** [(https://beyondchats-assignment-backend-z5vt.onrender.com)]

## Overview
This project is an assignment to demonstrate backend development, web scraping, and AI integration skills.
**Phase 1** focuses on building a robust backend that:
* Scrapes the oldest articles from [BeyondChats](https://beyondchats.com/blogs/).
* Stores the data in a MySQL database.
* Provides RESTful APIs to access this data.

**Phase 2 (AI Transformation):**
* **Automated Research:** Searches Google for the article's topic to find high-quality competitor blogs.
* **Competitor Analysis:** Scrapes the top 2 relevant articles (filtering out social media, Amazon, and PDFs).
* **AI Rewriting:** Uses **Google Gemini 1.5 Flash** to rewrite the original content, incorporating insights from the new research.
* **Smart Citation:** Programmatically appends accurate references to the rewritten article.
* **Optimization:** Implements caching to prevent unnecessary API calls for already updated articles.

**Phase 3 (Frontend):** A modern React UI with "Instant Toggle" to display both Original vs. AI versions.

## Tech Stack
* **Frontend:** React (Vite), TailwindCSS, DaisyUI, React Markdown.
* **Backend:** Node.js, Express.js.
* **Database:** TiDB Serverless (MySQL Compatible Cloud DB).
* **AI & Search:** Google Gemini API, SerpApi.
* **Deployment:** Vercel (Frontend), Render (Backend).

## Architecture
The project follows a modular MVC structure for scalability:

```text
root/
├── backend/            # Express API & Scraping Logic
│   ├── src/
│   │   ├── controllers/ # AI & Database Logic
│   │   ├── config/      # TiDB Cloud Connection
│   │   └── utils/       # Scraper & Search Services
├── frontend/           # React UI
│   ├── src/
│   │   ├── components/  # Article Cards & Layouts
│   │   ├── pages/       # Dashboard & Article Viewer
│   │   └── services/    # API Integration (Axios)
```

## Setup Instructions
### 1. Prerequisites
* Node.js installed
* A TiDB (or MySQL) Database URL.
* API Keys for Google Gemini and SerpApi

### 2. Backend Setup
1. Navigate to the backend:
   ```bash
    cd backend
    npm install
   ```

2. Create a .env file in backend/:
    ```bash
    DB_HOST=your_tidb_host
    DB_USER=your_tidb_user
    DB_PASSWORD=your_tidb_password
    DB_PORT=4000
    DB_NAME=test
    GEMINIAPI_KEY=your_gemini_key
    SERPAPI_KEY=your_serp_key
    ```
3. Run the Server
    ```bash
    npm run dev
    ```

### 2. Frontend Setup
1. Open a new terminal and navigate to frontend:
    ```bash
        cd frontend
        npm install
    ```
2. Create a .env file in frontend/:
    ```bash
        VITE_API_URL=http://localhost:5001/api
    ```
3. Run the UI:
    ```bash
    npm run dev
    ```

## APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/scrape` | Triggers the web scraper to fetch the 5 oldest articles. |
| **GET** | `/api/articles` | Fetches all stored articles. |
| **GET** | `/api/articles/:id` | Fetches details of a single article by ID. |
| **POST** | `/api/articles/:id/rewrite` | Triggers the AI Research Agent to search, scrape, and rewrite the article.

## AI Agent Workflow (Phase 2)

When the `POST /api/articles/:id/rewrite` endpoint is triggered, the backend follows this autonomous "Research Agent" pipeline:

1.  **Cache Check:** Checks the database. If the article is already marked as `is_updated: true`, it returns the cached version immediately to save API costs.
2.  **Search:** Queries SerpApi (Google) for the article's title to find current context.
3.  **Filter:** Selects the top 2 organic results while strictly blocking noise (Pinterest, Amazon, YouTube, and self-referencing links).
4.  **Read:** Scrapes the text content of those 2 external links.
5.  **Synthesize:** Sends the original content + external research to Gemini AI.
6.  **Citation:** Manually appends the valid reference links to the bottom of the new text to ensure 100% accuracy.
7.  **Save:** Updates the database record with the new `updated_content` and marks the flag `is_updated = true`.


