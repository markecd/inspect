import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase/firebaseConfig';
import type { Timestamp } from 'firebase/firestore';
import '../assets/styles/article-details.css';

interface ArticleData {
  title: string;
  content: string;
  username: string;
  createdAt?: Timestamp;
  imageUrl?: string;
}

function ArticleDetails() {
  const { uid, id } = useParams(); 
  const [article, setArticle] = useState<ArticleData | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!uid || !id) return;

      const articleRef = doc(db, 'users', uid, 'articles', id); 
      const snap = await getDoc(articleRef);
      if (snap.exists()) {
        setArticle(snap.data() as ArticleData);
      }
    };

    fetchArticle();
  }, [uid, id]);

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return '';
    const d = timestamp.toDate();
    return d.toLocaleString('sl-SI');
  };

  if (!article) return <div>Loading...</div>;

  return (
    <div className="article-detail">
  <h2 className="article-title">{article.title}</h2>
  {article.imageUrl && (
    <img
      className="article-image"
      src={article.imageUrl}
      alt="Slika članka"
    />
  )}
  <p className="article-meta">
    <strong className="article-author">{article.username}</strong> |{" "}
    <span className="article-date">{formatDate(article.createdAt)}</span>
  </p>
  <p className="article-content">{article.content}</p>
</div>

  );
}

export default ArticleDetails;
