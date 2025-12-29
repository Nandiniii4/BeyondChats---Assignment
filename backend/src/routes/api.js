import express from 'express';
import { scrapeArticles } from '../controllers/scraperController.js';
import Article from '../models/Article.js';

const router = express.Router();

router.get('/scrape', scrapeArticles);

router.get('/articles', async(req, res) => {
    try {
       const articles = await Article.findAll();
       res.status(200).json(articles); 
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router