import express from 'express';
import { scrapeArticles } from '../controllers/scraperController.js';
import Article from '../models/Article.js';
import { getArticles , getArticleById } from '../controllers/articleController.js';
import { rewriteArticle } from '../controllers/aiController.js';

const router = express.Router();

router.get('/scrape', scrapeArticles);

router.get('/articles', getArticles);

router.get('/articles/:id', getArticleById);

router.post('/articles/:id/rewrite', rewriteArticle);

export default router;