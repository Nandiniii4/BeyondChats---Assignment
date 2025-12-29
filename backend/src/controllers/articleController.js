import Article from '../models/Article.js';

export const getArticles = async(req, res) => {
    try {
        const articles = await Article.findAll();
        res.status(200).json(articles);
    } catch (error) {
        console.log('Error getting all articles', error);
        res.status(500).json({error: 'Failed to fetch articles'});
    }
};

export const getArticleById = async(req, res) => {
    try {
       const { id } = req.params;
       const article = await Article.findByPk(id);
       if(!article){
        return res.status(404).json({error: 'Article not found'});
       }
       res.status(200).json(article); 
    } catch (error) {
        console.log("Error fetching article by id", error);
        res.status(500).json({error: 'Failed to fetch article'});
    }
}