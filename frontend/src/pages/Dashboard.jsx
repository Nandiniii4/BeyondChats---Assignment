import React , {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import {getArticles} from '../services/api.js';
import { CircleAlert  } from 'lucide-react';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getArticles();

      if(data){
        setArticles(data);
      }else{
        console.warn("Unexpected API format:", data);
        setArticles([]);
      }

    } catch (error) {
      console.error("Dashboard Error:", err);
      setError("Failed to connect to the server.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen pb-20'>
        <Navbar />

        <div className='container mx-auto px-4'>

          <div className='mb-10 mt-8'>
            <h2 className='text-3xl font-bold text-white mb-2'>Dashboard Overview</h2>
            <p className='text-gray-400'>A collection of articles scraped directly from the BeyondChats platform.</p>
          </div>

          {
            loading && (
              <div className='flex justify-center items-center h-64'>
                <span className='loading loading-spinner loading-lg text-brand-cyan'></span>
              </div>
            )
          }

          {
            error && (
              <div className="alert alert-error bg-red-900/20 border border-red-900/50 text-red-200 my-8 max-w-2xl mx-auto">
                <CircleAlert size={24} /> 
                <span>{error}</span>
              </div>
            )
          }

          {
            !loading && !error && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {articles.map((article) => (
                  <div key={article.id} className='h-[400px]'>
                    <ArticleCard article={article}/>
                  </div>
                ))}
              </div>
            )
          }

          {
            !loading && !error && articles.length === 0 && (
              <div className='mt-20 text-gray-500'>
                <p>No articles found in the database.</p>
              </div>
            )
          }

        </div>
    </div>
  )
}

export default Dashboard