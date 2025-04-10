import pool from '../db';

export interface Article {
  id: string;
  title: string;
  author: string;
  content: any;
  slug: string;
  createdAt: string;
}

export async function getAllArticles(): Promise<Article[]> {
  try {
    const [rows] = await pool.query<any>('SELECT * FROM articles ORDER BY created_at DESC');
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      author: row.author,
      content: JSON.parse(row.content),
      slug: row.slug,
      createdAt: row.created_at
    }));
  } catch (error) {
    console.error('Ошибка при получении всех статей:', error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const [rows] = await pool.query<any>('SELECT * FROM articles WHERE slug = ?', [slug]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    let parsedContent;
    
    try {
      parsedContent = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    } catch (parseError) {
      console.error(`Ошибка при парсинге JSON для статьи ${slug}:`, parseError);
      parsedContent = [];
    }
    
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      content: parsedContent,
      slug: row.slug,
      createdAt: row.created_at
    };
  } catch (error) {
    console.error(`Ошибка при получении статьи по slug ${slug}:`, error);
    throw error;
  }
}

export async function createArticle(article: Omit<Article, 'createdAt'>): Promise<void> {
  try {
    let contentToSave;
    
    try {
      if (typeof article.content === 'string') {
        JSON.parse(article.content);
        contentToSave = article.content;
      } else {
        contentToSave = JSON.stringify(article.content);
      }
    } catch (error) {
      contentToSave = JSON.stringify(article.content);
    }
    
    await pool.query(
      'INSERT INTO articles (id, title, author, content, slug) VALUES (?, ?, ?, ?, ?)',
      [
        article.id,
        article.title,
        article.author,
        contentToSave,
        article.slug
      ]
    );
  } catch (error) {
    console.error('Ошибка при создании статьи:', error);
    throw error;
  }
}

export async function generateUniqueSlug(
  baseSlug: string, 
  day: string, 
  month: string, 
  year: string
): Promise<string> {
  const dateSlug = `${baseSlug}-${day}-${month}-${year}`;
  
  const [rows] = await pool.query<any>(
    'SELECT slug FROM articles WHERE slug LIKE ?',
    [`${dateSlug}%`]
  );
  
  if (rows.length === 0) {
    return dateSlug;
  }
  
  return `${dateSlug}-${rows.length + 1}`;
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const [rows] = await pool.query<any>('SELECT * FROM articles WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    const row = rows[0];
    let parsedContent;
    
    try {
      parsedContent = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    } catch (parseError) {
      console.error(`Ошибка при парсинге JSON для статьи с ID ${id}:`, parseError);
      parsedContent = [];
    }
    
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      content: parsedContent,
      slug: row.slug,
      createdAt: row.created_at
    };
  } catch (error) {
    console.error(`Ошибка при получении статьи по ID ${id}:`, error);
    throw error;
  }
}

export async function updateArticle(article: Omit<Article, 'createdAt'>): Promise<void> {
  try {
    let contentToSave;
    
    try {
      if (typeof article.content === 'string') {
        JSON.parse(article.content);
        contentToSave = article.content;
      } else {
        contentToSave = JSON.stringify(article.content);
      }
    } catch (error) {
      contentToSave = JSON.stringify(article.content);
    }
    
    await pool.query(
      'UPDATE articles SET title = ?, author = ?, content = ? WHERE id = ?',
      [
        article.title,
        article.author,
        contentToSave,
        article.id
      ]
    );
  } catch (error) {
    console.error(`Ошибка при обновлении статьи с ID ${article.id}:`, error);
    throw error;
  }
} 