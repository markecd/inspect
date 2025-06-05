import React, { useEffect, useState } from 'react';
import { collectionGroup, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase/firebaseConfig';
import Article from '../components/Article/Article';
import '../assets/styles/articles.css';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  createdAt?: Timestamp;
  username: string;
}

function Articles(){
  const [articles, setArticles] = useState<ArticleData[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesRef = query(
        collectionGroup(db, 'articles'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(articlesRef);

      const fetched: ArticleData[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || 'Ni naslova',
          content: data.content || 'Brez vsebine',
          createdAt: data.createdAt,
          username: data.username || 'Neznano',
        };
      });

      setArticles(fetched);
    };

    fetchArticles();
  }, []);

  return (
    <div className="articles-wrapper">
      <h2 className="articles-heading">Vsi članki</h2>
      <div className="articles-flex">
        {articles.map((article) => (
          <Article key={article.id} {...article} />
        ))}
      </div>
    </div>
  );
};

export default Articles;
