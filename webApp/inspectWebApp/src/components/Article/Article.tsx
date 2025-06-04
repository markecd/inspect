import React from 'react';
import type { Timestamp } from 'firebase/firestore';
import '../../assets/styles/article.css';

interface ArticleProps {
  title: string;
  content: string;
  username?: string;
  createdAt?: Timestamp;
}

const Article: React.FC<ArticleProps> = ({ title, content, username, createdAt }) => {
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
    <div className="article-card">
      <h3 className="article-title">{title}</h3>
      <p className="article-meta">
        Objavil: <strong>{username || 'Neznano'}</strong> | {formatDate(createdAt)}
      </p>
      <p className="article-content">{content}</p>
    </div>
  );
};

export default Article;
