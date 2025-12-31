import React from 'react'
import { ScanText } from 'lucide-react';

function Navbar() {
  return (
    <div className='navbar bg-[#0f172a]/80 backdrop-blur-md mb-8 p-6 sticky top-0 z-50'>
        <div className='flex-1 gap-3 items-center'>
            <div className='w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30'>
                <ScanText />
            </div>

            <div>
                <h1 className='text-2xl font-bold text-white tracking-light'>
                    BeyondChats Article Scraper
                </h1>
            </div>
        </div>
    </div>
  )
};

export default Navbar