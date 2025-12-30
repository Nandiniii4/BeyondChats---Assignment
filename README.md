# BeyondChats Assessment - Article Scraper & AI Rewriter

A full-stack application that scrapes articles from the BeyondChats blog, stores them in a database, and uses AI to rewrite them for a modern audience.

> **Current Status:** Phase 2 Complete (AI Research Agent & Backend Logic)

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

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **AI Engine:** Google Gemini API (`gemini-flash-latest`)
* **Search Engine:** SerpApi (Google Search Results)
* **Scraping:** * *Phase 1:* Cheerio & Axios
    * *Phase 2:* JSDOM & Mozilla Readability (for external blogs)

## Architecture
The project follows a modular MVC structure for scalability:

```text
backend/
├── src/
│   ├── config/             # Database connection info
│   ├── controllers/
│   │   ├── aiController.js      # Logic for Search -> Scrape -> Rewrite
│   │   ├── articleController.js # CRUD operations for Articles
│   │   └── scraperController.js # Initial scraping of BeyondChats
│   ├── models/             # Database Schema (Article Table)
│   ├── routes/             # API Routes definitions
│   ├── utils/              # External Service Helpers
│   │   ├── scraperService.js    # JSDOM logic for reading external links
│   │   └── searchService.js     # SerpApi configuration and filtering
│   └── server.js           # Entry point
```

## Setup Instructions
### 1. Prerequisites
* Node.js installed
* MySQL Server running
* API Keys for Google Gemini and SerpApi

### 2. Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Nandiniii4/BeyondChats---Assignment.git
   cd backend
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configuration
* Create a MySQL database named beyondchats_db (or your actual DB name).

* Create a .env file in the backend/ root folder with these credentials:
    ```bash
    # Database Config
    DB_NAME=beyondchats_db
    DB_USER=root
    DB_PASSWORD=your_password
    DB_HOST=localhost
    PORT=5001

    # AI & Search Keys
    GEMINI_API_KEY=your_google_gemini_key_here
    SERPAPI_KEY=your_serpapi_key_here
    ```
4. Run the Server
    ```bash
    npm run dev
    ```
    The server will start on http://localhost:5001.


## APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/scrape` | Triggers the web scraper to fetch the 5 oldest articles. |
| **GET** | `/api/articles` | Fetches all stored articles. |
| **GET** | `/api/articles/:id` | Fetches details of a single article by ID. |
| **POST** | `/api/articles/:id/rewrite` | Triggers the AI Research Agent to search, scrape, and rewrite the article.

## AI Agent Workflow (Phase 2)

When the `POST /api/articles/:id/rewrite` endpoint is triggered, the backend follows this autonomous "Research Agent" pipeline:

1.  **⚡ Cache Check:** Checks the database. If the article is already marked as `is_updated: true`, it returns the cached version immediately to save API costs.
2.  **🔎 Search:** Queries SerpApi (Google) for the article's title to find current context.
3.  **🛡️ Filter:** Selects the top 2 organic results while strictly blocking noise (Pinterest, Amazon, YouTube, and self-referencing links).
4.  **📖 Read:** Scrapes the text content of those 2 external links.
5.  **🧠 Synthesize:** Sends the original content + external research to Gemini AI.
6.  **🔗 Citation:** Manually appends the valid reference links to the bottom of the new text to ensure 100% accuracy.
7.  **💾 Save:** Updates the database record with the new `updated_content` and marks the flag `is_updated = true`.

## Frontend
