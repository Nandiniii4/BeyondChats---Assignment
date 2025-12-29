import express from 'express';
import { scrapeArticles } from '../controllers/scraperController.js';
import Article from '../models/Article.js';
import { getArticles , getArticleById } from './controllers/articleController.js';

const router = express.Router();

router.get('/scrape', scrapeArticles);

router.get('/articles', getArticles);

router.get('/articles/:id', getArticleById);

export default router;