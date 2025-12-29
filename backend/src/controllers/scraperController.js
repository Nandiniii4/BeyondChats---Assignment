import axios from 'axios';
import * as cheerio from 'cheerio';
import Article from '../models/Article.js';

const fetchArticle = async(url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const pageArticles = [];

        $('.entry-card').each((index, element) => {
            const title = $(element).find('.entry-title').text().trim();
            const link = $(element).find('.ct-media-container').attr('href');
            const content = $(element).find('.entry-excerpt').text().trim() ||"Full article...";
            const date = $(element).find('.entry-meta .meta-date').text().trim();
            const author = $(element).find('.entry-meta .meta-author').text().trim() || 'Unknown Author';

            if(title && link){
                pageArticles.push({
                    title,
                    content,
                    author,
                    src_url: link,
                    publication_date: date,
                    is_updated: false
                });
            }

        });

        return pageArticles;
    } catch (error) {
        console.log(`Error Fetching Article for ${url}`, error);
        return [];
    }
}

const scrapeFullContent = async (url) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        const fullText = $('.elementor-widget-theme-post-content').text().trim();
        
        if (!fullText || fullText.length < 50) {
            return $('.entry-content').text().trim();
        }

        return fullText;
    } catch (error) {
        console.error(`Failed to load content for ${url}`);
        return null; 
    }
};

export const scrapeArticles = async(req, res) => {
    try {
        console.log('Starting scraper...');
        const urls = [
            'https://beyondchats.com/blogs/page/15/',
            'https://beyondchats.com/blogs/page/14/'
        ];

        let allArticles = [];

        for(const url of urls){
            const articles = await fetchArticle(url);
            allArticles = [...allArticles, ...articles];
        }

        const finalArticles = allArticles.slice(0, 5);

        if(finalArticles.length === 0){
            return res.status(404).json({
                message: "No articles found."
            })
        }

        for (const article of finalArticles) {
            const fullContent = await scrapeFullContent(article.src_url);
            
            if (fullContent && fullContent.length > article.content.length) {
                article.content = fullContent;
            }
        }

        await Article.bulkCreate(finalArticles, {
            updateOnDuplicate: ['title', 'content'],
            ignoreDuplicates: true
        });

        console.log(`Sucessfully saved ${finalArticles.length} articles`);

        res.status(200).json({
            message: 'Scraping successful',
            count: finalArticles.length,
            data: finalArticles
        });

    } catch (error) {
        console.log("Error in Scraping Articles", error);
        res.status(500).json({error: 'Scraping Failed', details: error.message});
    }
}