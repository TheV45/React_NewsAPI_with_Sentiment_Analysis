import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';

import { ChatOpenAI } from "@langchain/openai";
dotenv.config();
const model = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-4o",
});



const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static('build'));

const port = process.env.PORT || 3000;

// Update the connection string with your credentials
mongoose.connect('mongodb+srv://vmotwani:0e55qStgqOxyEYRW@cluster0.bfetynk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    app.listen(port, () => {
      console.log('Connected to Database and Server is running on port', port);
    });
  })
  .catch((error) => {
    console.error("Connection failed!", error);
  });

// Define the news schema
const newsSchema = new mongoose.Schema({
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: String,
  content: String,
  starred: Boolean,
});

// Create the model
const News = mongoose.model('News', newsSchema);

// Route to add starred news
app.post('/star-news', async (req, res) => {
  const { author, title, description, url, urlToImage, publishedAt, content } = req.body;
  const newsItem = new News({ author, title, description, url, urlToImage, publishedAt, content, starred: true });
  try {
    await newsItem.save();
    res.status(201).send(newsItem);
  } catch (error) {
    res.status(500).send({ error: 'Failed to save news item' });
  }
});

// Route to get all starred news
app.get('/starred-news', async (req, res) => {
  try {
    const starredNews = await News.find({ starred: true });
    res.status(200).send(starredNews);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch starred news' });
  }
});

app.delete('/unstar-news', async (req, res) => {
    const { url } = req.body;
    try {
      await News.deleteOne({ url }); // Assuming 'url' is unique for each news item
      res.status(200).send({ message: 'News unstarred successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Failed to unstar news' });
    }
  });

  app.post('/analyze-sentiment', async (req, res) => {
    const { headline } = req.body;  // Expecting 'headline' field from request body
  
    try {
      
  
      const response = await model.invoke(`Analyze the sentiment of the following news headline. Is it positive, negative, or neutral?\n\nHeadline: "${headline}"\n\nSentiment:`);
  
      const sentiment = response.content;
  
      res.status(200).send({ headline, sentiment });
  
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      res.status(500).send({ error: 'Failed to analyze sentiment of the headline' });
    }
  });