import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout:  60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getArticles = async () => {
    try {
       const response = await api.get('/articles');
       return response.data; 
    } catch (error) {
        console.error("Error fetching articles", error);
        throw error;
    }
};

export const getArticleById = async (id) => {
    try {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching article with id: ${id}`, error);
        throw error;
    }
}

export const rewriteArticle = async (id) => {
    try {
        const response = await api.post(`/articles/${id}/rewrite`);
        return response.data;
    } catch (error) {
        console.error("Error rewriting article:", error);
        throw error;
    }
}