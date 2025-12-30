import pkg from 'google-search-results-nodejs';
const { GoogleSearch } = pkg;
import 'dotenv/config';

export const searchGoogle = async(query) => {
    return new Promise((resolve, reject) => {
        try {
           const search = new GoogleSearch(process.env.SERPAPI_KEY);

           search.json({
                engine: "google",
                q: query,
                num: 5
            }, (data) => {
                    if(!data.organic_results){
                console.log("No organic results found!");
                resolve([]);
            }
            
            const articles = data.organic_results
                .filter(result => {
                    const link = result.link || '';
                    return link &&
                        !link.includes('youtube.com') &&
                        !link.includes('amazon') &&
                        !link.includes('ebay') &&
                        !link.includes('pinterest') && 
                        !link.includes('instagram') &&
                        !link.includes('facebook') &&
                        !link.includes('beyondchats.com') && 
                        !link.endsWith('.pdf');
                })
                .slice(0,2)
                .map(result => ({
                    title: result.title,
                    link: result.link,
                    source: result.source
                }));
            resolve(articles);
           });
        } catch (error) {
            console.log("Error in search service", error);
            reject(error);
        }
    });
};