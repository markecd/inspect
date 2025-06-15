import React from 'react';
import type { Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/article.css';

interface ArticleProps {
  id: string;
  uid: string; // dodan UID
  title: string;
  content: string;
  username?: string;
  createdAt?: Timestamp;
  imageUrl?: string;
}

const Article: React.FC<ArticleProps> = ({ id, uid, title, username, createdAt, imageUrl }) => {
  const navigate = useNavigate();

  const formatDate = (timestamp?: Timestamp) => {
    if (!timestamp) return 'Brez datuma';
    const date = timestamp.toDate();

    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="article-card" onClick={() => navigate(`/articles/${uid}/${id}`)} style={{ cursor: 'pointer' }}>
      <h3 className="article-title">{title}</h3>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Slika članka"
          className="article-image"
        />
      )}
      <div className="article-meta">
        <strong>{username || 'Neznano'}</strong> | {formatDate(createdAt)}
      </div>
    </div>
  );
};

export default Article;
