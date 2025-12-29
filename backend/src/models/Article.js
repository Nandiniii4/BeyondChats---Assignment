import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Article = sequelize.define(
    'Article',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT('long'),
            allowNull: false
        },
        updated_content: {
            type: DataTypes.TEXT('long'),
            allowNull: true 
        },
        author: {
            type: DataTypes.STRING,
            allowNull: true
        },
        src_url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        publication_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_updated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        reference_links: {
            type: DataTypes.JSON,
            defaultValue: []
        }
    }
);

export default Article;