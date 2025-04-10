import express from 'express';
import { getAllArticles, getArticleBySlug, createArticle, updateArticle, getArticleById } from '../models/article';

const router = express.Router();

router.get('/', (async (req, res) => {
  try {
    const articles = await getAllArticles();
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Failed to fetch articles' });
  }
}) as express.RequestHandler);

router.get('/:slug', (async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await getArticleBySlug(slug);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    res.status(200).json(article);
  } catch (error) {
    console.error(`Error fetching article with slug ${req.params.slug}:`, error);
    res.status(500).json({ message: 'Failed to fetch article' });
  }
}) as express.RequestHandler);

router.post('/', (async (req, res) => {
  try {
    const articleData = req.body;
    
    if (!articleData.id || !articleData.title || !articleData.author || 
        !articleData.content || !articleData.slug) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    await createArticle(articleData);
    res.status(201).json({ message: 'Article created successfully' });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Failed to create article' });
  }
}) as express.RequestHandler);

router.put('/:id', (async (req, res) => {
  try {
    const { id } = req.params;
    const articleData = req.body;
    
    const existingArticle = await getArticleById(id);
    if (!existingArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    if (!articleData.title || !articleData.author || !articleData.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const articleToUpdate = {
      id,
      title: articleData.title,
      author: articleData.author,
      content: articleData.content,
      slug: existingArticle.slug
    };
    
    await updateArticle(articleToUpdate);
    res.status(200).json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error(`Error updating article with ID ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to update article' });
  }
}) as express.RequestHandler);

export default router; 