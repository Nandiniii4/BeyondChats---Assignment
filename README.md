# BeyondChats Assessment - Article Scraper & AI Rewriter

A full-stack application that scrapes articles from the BeyondChats blog, stores them in a database, and uses AI to rewrite them for a modern audience.

> **Current Status:** Phase 1 Complete (Backend Scraper & CRUD APIs)

## Overview
This project is an assignment to demonstrate backend development, web scraping, and AI integration skills.
**Phase 1** focuses on building a robust backend that:
1. Scrapes the oldest articles from [BeyondChats](https://beyondchats.com/blogs/).
2. "Deep Scrapes" each article to fetch the full content.
3. Stores the data in a MySQL database.
4. Provides RESTful APIs to access this data.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MySQL
* **ORM:** Sequelize
* **Scraping:** Cheerio & Axios
* **Architecture:** MVC (Model-View-Controller)

## Architecture
The project follows a modular MVC structure for scalability:

```text
backend/
├── src/
│   ├── config/         # Database connection info
│   ├── controllers/    # Logic for Scraping & APIs
│   ├── models/         # Database Schema (Article Table)
│   ├── routes/         # API Routes definitions
│   └── server.js       # Entry point
```

## Setup Instructions
### 1. Prerequisites
* Node.js installed
* MySQL Server running

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
3. Database Configuration
* Create a MySQL database named beyondchats_db (or your actual DB name).

* Create a .env file in the backend/ root folder with these credentials:
    ```bash
    DB_NAME=beyondchats_db
    DB_USER=root
    DB_PASSWORD=your_password
    DB_HOST=localhost
    PORT=5001
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

## Frontend
