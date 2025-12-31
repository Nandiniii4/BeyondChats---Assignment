import React , {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import { ArrowLeft, Sparkles, User, Calendar, CircleAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getArticleById, rewriteArticle } from '../services/api';

function ArticleViewer() {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rewriting, setRewriting] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('original');

    useEffect(() => {
        loadArticle();
    }, [id]);

    const loadArticle = async() => {
        try {
            const data = await getArticleById(id);
            setArticle(data);
            if (data.is_updated) {
                setActiveTab('enhanced');
            }
            setLoading(false);
        } catch (error) {
            setError('Could not load article.');
            setLoading(false);
        }
    }

    const handleTabSwitch = async(tab) => {
        if(tab === "original"){
            setActiveTab('original');
            return;
        }

        if(tab === "enhanced"){
            if (article.updated_content) {
                setActiveTab('enhanced');
                return;
            }
        }

        setRewriting(true);
        try {
            const result = await rewriteArticle(id);
            
            setArticle(prev => ({
                ...prev,
                updated_content: result.updated_content,
                is_updated: true
            }));
            
            setActiveTab('enhanced');
        } catch (err) {
            alert("Could not generate AI content. Please try again.");
            console.error(err);
        } finally {
            setRewriting(false);
        }
    }

    const cleanOriginalText = (text) => {
        if (!text) return "";
        return text.replace(/\n{3,}/g, '\n\n');
    };

    if (loading) return (
        <div className='min-h-screen flex items-center justify-center'>
            <span className='loading loading-spinner loading-lg text-brand-cyan'></span>
        </div>
    )

    if (error || !article) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-red-400">
            <CircleAlert size={48} />
            <p className="text-xl">{error || "Article not found"}</p>
            <Link to="/" className="btn btn-ghost text-white">Go Back Home</Link>
        </div>
    );

    return (
        <div className='min-h-screen pb-20 pt-10 px-4 md:px-0'>

            <div className="container mx-auto max-w-4xl">

                {/* Navigation bar */}
                <div className="flex justify-between items-center mb-8">
                    <Link to="/" className="btn btn-ghost gap-2 text-gray-400 hover:text-white pl-0">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </Link>
                </div>

                {/* toggle switch */}
                <div className="bg-gray-800/50 p-1 rounded-full flex border border-white/10 relative mb-10">
                    <button 
                        onClick={() => handleTabSwitch('original')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 z-10 ${
                        activeTab === 'original' 
                            ? 'bg-gray-700 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Original Source
                    </button>

                    <button 
                        onClick={() => handleTabSwitch('enhanced')}
                        disabled={rewriting}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 ${
                        activeTab === 'enhanced' 
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {rewriting ? (
                        <><span className="loading loading-spinner loading-xs"></span> Generating...</>
                        ) : (
                        <><Sparkles size={14} /> AI Enhanced Version</>
                        )}
                    </button>
                </div>
                
                {/* article display */}
                <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden animate-fade-in-up">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-10 border-b border-white/10 pb-6">
                            <div className="flex items-center gap-2">
                                <User size={16} className="text-brand-cyan" />
                                {article.author || "Unknown"}
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-brand-cyan" />
                                {article.publication_date || "Unknown"}
                            </div>
                        </div>

                        <div className="article-body text-gray-300 min-h-[300px] transition-opacity duration-300">

                            {rewriting ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                                </div>
                                ) : (
                                <div className="whitespace-pre-line leading-relaxed text-lg">
                                    {
                                        activeTab === 'original' 
                                        ? (cleanOriginalText(article.original_content || article.content)) 
                                        : (
                                            <div className="text-gray-300 leading-relaxed text-lg">
                                            <ReactMarkdown 
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    h1: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
                                                    h2: ({node, ...props}) => <h3 className="text-xl font-bold text-brand-cyan mt-6 mb-3" {...props} />,
                                                    h3: ({node, ...props}) => <h4 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                                                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                                                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                                                    li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                                                    a: ({node, ...props}) => <a className="text-brand-cyan hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                    strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,

                                                    table: ({node, ...props}) => <div className="overflow-x-auto my-6 rounded-lg border border-gray-700"><table className="table w-full" {...props} /></div>,
                                                    thead: ({node, ...props}) => <thead className="bg-gray-800 text-brand-cyan" {...props} />,
                                                    th: ({node, ...props}) => <th className="px-4 py-3 text-left font-bold uppercase text-xs tracking-wider border-b border-gray-700" {...props} />,
                                                    td: ({node, ...props}) => <td className="px-4 py-3 border-b border-gray-800" {...props} />,
                                                }}
                                            >
                                                {article.updated_content || article.content}
                                            </ReactMarkdown>
                                        </div>
                                        )
                                    }
                                </div>
                            )}

                        </div>
                </div>
            </div>
        </div>
    )
};

export default ArticleViewer;
