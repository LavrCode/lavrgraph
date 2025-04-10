import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Descendant } from 'slate';
import { Slate, Editable } from 'slate-react';

import FormatToolbar from './FormatToolbar';

const API_URL = process.env.REACT_APP_API_URL;

interface Article {
  id: string;
  title: string;
  author: string;
  content: Descendant[];
  slug: string;
  createdAt: string;
}

interface EditArticleProps {
  editor: any;
  renderElement: any;
  renderLeaf: any;
}

const EditArticle: React.FC<EditArticleProps> = ({ 
  editor, 
  renderElement, 
  renderLeaf 
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    } as any,
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) {
        setError('Статья не найдена');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/articles/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            const savedArticles = localStorage.getItem('articles');
            
            if (savedArticles) {
              const articles: Article[] = JSON.parse(savedArticles);
              const foundArticle = articles.find(a => a.slug === slug);
              
              if (foundArticle) {
                setTitle(foundArticle.title);
                setAuthor(foundArticle.author);
                setValue(foundArticle.content);
                setArticleId(foundArticle.id);
                return;
              }
            }
            setError('Статья не найдена');
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          setTitle(data.title);
          setAuthor(data.author);
          setValue(data.content);
          setArticleId(data.id);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        
        try {
          const savedArticles = localStorage.getItem('articles');
          
          if (savedArticles) {
            const articles: Article[] = JSON.parse(savedArticles);
            const foundArticle = articles.find(a => a.slug === slug);
            
            if (foundArticle) {
              setTitle(foundArticle.title);
              setAuthor(foundArticle.author);
              setValue(foundArticle.content);
              setArticleId(foundArticle.id);
              return;
            }
          }
          setError('Ошибка при загрузке статьи');
        } catch (localErr) {
          setError('Ошибка при загрузке статьи');
          console.error(localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const updateArticle = async () => {
    if (!articleId) {
      setError('ID статьи не найден');
      return;
    }
    
    if (!title.trim()) {
      alert('Пожалуйста, добавьте заголовок для вашей статьи');
      return;
    }
    
    if (!author.trim()) {
      alert('Пожалуйста, укажите имя автора');
      return;
    }

    setSaving(true);
    setSuccess(false);
    setError(null);
    
    const updatedArticle = {
      title,
      author,
      content: value,
    };
    
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const savedArticles = localStorage.getItem('articles');
      if (savedArticles) {
        const articles: Article[] = JSON.parse(savedArticles);
        const updatedArticles = articles.map(article => {
          if (article.id === articleId) {
            return {
              ...article,
              title,
              author,
              content: value,
            };
          }
          return article;
        });
        
        localStorage.setItem('articles', JSON.stringify(updatedArticles));
      }
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/${slug}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating article:', error);
      setError('Ошибка при обновлении статьи');
      
      try {
        const savedArticles = localStorage.getItem('articles');
        if (savedArticles) {
          const articles: Article[] = JSON.parse(savedArticles);
          const updatedArticles = articles.map(article => {
            if (article.id === articleId) {
              return {
                ...article,
                title,
                author,
                content: value,
              };
            }
            return article;
          });
          
          localStorage.setItem('articles', JSON.stringify(updatedArticles));
          setSuccess(true);
          
          setTimeout(() => {
            navigate(`/${slug}`);
          }, 1500);
        }
      } catch (localErr) {
        console.error('Error updating article in localStorage:', localErr);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 dark:text-white">
        <div className="text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
        >
          Вернуться на главную
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white transition-colors duration-200">
      <header className="dark:bg-gray-800 shadow-md py-4 px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold dark:text-indigo-400">Редактирование статьи</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {success && (
          <div className="dark:bg-green-900 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold dark:text-green-200 mb-2">Статья обновлена!</h2>
            <p className="dark:text-green-300 mb-4">
              Ваша статья успешно обновлена.
            </p>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent dark:text-white dark:border-gray-700 dark:focus:border-indigo-400"
          />
        </div>
        
        <div className="mb-10">
          <input
            type="text"
            placeholder="Автор"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full italic border-b-2 border-gray-300 focus:outline-none focus:border-indigo-500 bg-transparent dark:text-white dark:border-gray-700 dark:focus:border-indigo-400"
          />
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Slate 
            editor={editor} 
            initialValue={value} 
            onChange={newValue => setValue(newValue)}
          >
            <div className="relative">
              <div className="sticky top-16 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-md mb-6 transition-all duration-200">
                <FormatToolbar />
              </div>
              <Editable
                className="prose prose-lg dark:prose-invert min-h-[500px] focus:outline-none"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                placeholder="Начните писать или вставьте медиаконтент..."
                spellCheck
              />
            </div>
          </Slate>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/${slug}`)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
          >
            Отмена
          </button>
          <button
            onClick={updateArticle}
            disabled={saving}
            className={`px-6 py-2 ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md flex items-center`}
          >
            {saving ? (
              <>
                <span className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                Обновление...
              </>
            ) : 'Сохранить изменения'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditArticle; 