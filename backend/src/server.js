import express from 'express';
import 'dotenv/config';
import sequelize from './config/database.js';
import Article from './models/Article.js';
import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use('/api', apiRoutes);
app.get("/", (req, res) => {
    res.status(200).send("Welcome to BeyondChats Scraper API 🙌");
});


//connecting to the db and starting the server
const startServer = async () => {
    try{
        await sequelize.sync();
        console.log("Database connected and Tables synced!");

        app.listen(PORT, () => {
            console.log(`Server running on PORT: ${PORT}`);
        })
    }catch(error){
        console.log("Error connecting to Database", error);
    }
}

startServer();
