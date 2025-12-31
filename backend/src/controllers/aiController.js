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
                original_content: article.content, 
                updated_content: article.updated_content,
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
            try {
                if(validReferences.length >= 3){
                    break;
                }
                const scrapedData = await scrapeURL(result.link);

                if(scrapedData && scrapedData.content){
                    validReferences.push({title: scrapedData.title, url: result.link});
                    referenceContent += `\n\n--- REFERENCE ARTICLE: ${scrapedData.title} ---\n${scrapedData.content.substring(0, 1500)}`;
                }

            } catch (error) {
                console.warn(`Skipping reference URL ${result.link}: ${error.message}`);
            }
        }

        let instructions = "";
        if (referenceContent.trim()) {
            instructions = `
            2. Incorporate new facts or insights found in the Reference Articles provided above.
            3. Merge the "Original Article" with the "Reference Articles" to create a comprehensive guide.
            `;
        } else {
            instructions = `
            2. Improve the clarity, flow, and tone of the original text.
            3. Expand on the concepts using your own knowledge to make it more comprehensive.
            `;
        }

        const prompt = `
            You are an expert tech editor. Your task is to rewrite the "Original Article" below.
            
            ORIGINAL ARTICLE:
            Title: ${article.title}
            Content: ${article.content}

            ${referenceContent ? "REFERENCE MATERIALS (Use these to enhance the article):" : ""}
            ${referenceContent}

            INSTRUCTIONS:
            1. Rewrite the article completely to be engaging, modern, and professional (Markdown format).
            ${instructions}
            4. Use clear headings (##), lists, and short paragraphs.
            5. **IMPORTANT:** Output ONLY the article content. Do NOT output a "References" section at the end.
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
            original_content: article.content,
            updated_content: updatedText,
            references: validReferences
        });

    } catch (error) {
        console.log("Error in rewriting articles", error);
        res.status(500).json({error: "Rewrite failed", details: error.message});
    }
};