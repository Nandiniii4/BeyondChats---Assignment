import { GoogleGenerativeAI} from '@google/generative-ai';
import Article from "../models/Article.js";
import { searchGoogle} from "../utils/searchService.js";
import { scrapeURL } from "../utils/scraperService.js";
import 'dotenv/config';

const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest"});

export const rewriteArticle = async(req, res) => {
    try {
        const { id } = req.params;
        const article = await Article.findByPk(id);

        if(!article || !article.content){
            return res.status(404).json({error: "Article content not found"});
        }

        if (article.is_updated && article.updated_content) {
            console.log(`Article ${id} already updated. Returning updated version.`);
            return res.status(200).json({ 
                message: "Article fetched from cache (no API call needed)", 
                original: article.content, 
                updated: article.updated_content,
                references: [] 
            });
        }

        const searchResults = await searchGoogle(article.title);

        if (searchResults.length === 0) {
            console.log("No relevant Google results found ");
        }

        let referenceContent = "";
        let validReferences = [];

        for(const result of searchResults){
            const scrapedData = await scrapeURL(result.link);

            if(scrapedData){
                validReferences.push({title: scrapedData.title, url: result.link});
            }
        }

        const prompt = `
            You are an expert tech editor. Your task is to rewrite the "Original Article" below.
            To do this, analyze the "Reference Articles" provided. 
            
            Goal: Update the Original Article to match the quality, depth, and formatting style of the Reference Articles.

            ORIGINAL ARTICLE:
            Title: ${article.title}
            Content: ${article.content}

            ${referenceContent}

            IINSTRUCTIONS:
            1. Rewrite the original article completely to be engaging and modern.
            2. Incorporate new facts or insights found in the Reference Articles.
            3. Use short paragraphs and clear headings.
            4. **IMPORTANT:** Do NOT include a "References" section. Do NOT list links. I will handle citations programmatically.
            5. Output ONLY the final rewritten article text (Markdown format).
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        let updatedText = response.text();

        if (validReferences.length > 0) {
            updatedText += "\n\n## References\n\n";
            validReferences.forEach(ref => {
                updatedText += `* [${ref.title}](${ref.url})\n`;
            });
        }

        article.updated_content = updatedText;
        article.is_updated = true;
        await article.save();

        res.status(200).json({
            message: "Article updated successfully",
            original: article.content,
            updated: updatedText,
            references: validReferences
        });

    } catch (error) {
        console.log("Error in rewriting articles", error);
        res.status(500).json({error: "Rewrite failed", details: error.message});
    }
};