import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export const scrapeURL = async(url) => {
    try {
       const { data } = await axios.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
       }); 

       const dom = new JSDOM(data, { url });

       const reader = new Readability(dom.window.document);
       const article = reader.parse();

       if(!article){
        console.log(`Readability failed to parse ${url}`);
        return null;
       }

       return{
        title: article.title,
        content: article.textContent.trim().substring(0, 15000),
        url: url
       }
    } catch (error) {
        console.log(`Error in scraping URL ${url}`, error);
        return null;
    }
}