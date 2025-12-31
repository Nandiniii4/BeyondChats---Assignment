import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import ArticleCard from './components/ArticleCard';

function App() {
  const dummyArticle = {
    id: 1,
    title: "Embrace the Evolution of Chatbots",
    content: "Embrace the evolution by understanding your website's unique needs.\n\n\n\n\nIn the fast-paced world of technology, the buzz around Chatbots is louder than ever!",
    publication_date: "December 5, 2023",
    author: "Jane Smith",
    is_updated: false 
  };

  return (
    <BrowserRouter>
      <div className="app-container min-h-screen flex items-center justify-center p-10">
        <div className="w-[350px] h-[400px]"> 
          <ArticleCard article={dummyArticle} />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App