import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, User } from 'lucide-react';

const ArticleCard = ({article}) => {
    return (
        <div className='glass-panel rounded-3xl p-6 transition-all hover:-translate-y-1 hover:border-brand-primary/50 group flex flex-col h-full relative overflow-hidden'>

            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none"></div>

            {/* header of card */}
            <div className='flex justify-between items-start mb-4'>

                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
                    <FileText size={14} className="text-brand-cyan" /> 
                    <span className="text-xs font-bold bg-gradient-to-r from-brand-cyan to-blue-500 bg-clip-text text-transparent uppercase tracking-wider">
                        Article
                    </span>
                </div>

                <span className='text-sm text-gray-500'>
                    {article.publication_date || "Unknown Date"}
                </span>

            </div>

            {/* body of card */}
            <h3 className='text-xl font-bold text-white mb-3 mt-3 line-clamp-2 group-hover:text-brand-cyan transition-colors z-10'>
                {article.title}
            </h3>

            <p className='text-sm text-gray-400 mb-6 line-clamp-3 flex-grow'>
                {
                article.content ? article.content.replace(/\n+/g, ' ').substring(0, 200) + "..." : "No preview available..."
                }
            </p>

            {/* footer of card */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>

            <div className='flex justify-between items-center z-10'>

                <div className='flex items-center gap-2 text-xs text-gray-400'>
                    <div className='size-6 rounded-full bg-white/10 flex items-center justify-center'>
                        <User size={14} className="text-gray-300" />
                    </div>

                    <span className='text-sm font-medium text-gray-300'>
                        {article.author || "Unknown author"}
                    </span>
                </div>
                
                <Link
                    to={`/article/${article.id}`}
                    className='btn btn-sm btn-ghost gap-1 text-brand-cyan hover:bg-brand-cyan/10 px-2'
                >
                    View Article <ArrowRight size={16} />
                </Link>
            </div>

        </div>
    )
};

export default ArticleCard;