import { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ArticleViewer from './pages/ArticleViewer';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/article/:id" element={<ArticleViewer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App