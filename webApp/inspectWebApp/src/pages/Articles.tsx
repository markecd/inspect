import React, { useEffect, useState } from 'react';
import {
  collectionGroup,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase/firebaseConfig'
import Article from '../components/Article/Article';
import '../assets/styles/articles.css';

interface ArticleData {
  id: string;
  title: string;
  content: string;
  createdAt?: Timestamp;
  username: string;
  imageUrl?: string;
  uid: string;
}

function Articles() {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [authorFilter, setAuthorFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    const fetchArticles = async () => {
      const articlesRef = query(
        collectionGroup(db, 'articles'),
        orderBy('createdAt', sortOrder)
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
          imageUrl: data.imageUrl || '',
          uid: data.uid,
        };
      });

      setArticles(fetched);
    };

    fetchArticles();
  }, [sortOrder]);

  const filteredArticles = articles.filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = article.username.toLowerCase().includes(authorFilter.toLowerCase());

    const createdAtDate = article.createdAt?.toDate();
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    const dateMatch =
      (!fromDate || (createdAtDate && createdAtDate >= fromDate)) &&
      (!toDate || (createdAtDate && createdAtDate <= toDate));

    return titleMatch && authorMatch && dateMatch;
  });

  return (
    <div className="articles-wrapper">
      <h2 className="articles-heading">Vsi članki</h2>

      <div className="articles-controls">
        <input
          type="text"
          placeholder="Išči po naslovu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <input
          type="text"
          placeholder="Filter po avtorju..."
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="search-input"
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="sort-select"
        >
          <option value="desc">Novejši najprej</option>
          <option value="asc">Starejši najprej</option>
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="date-input"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="articles-flex">
        {filteredArticles.map((article) => (
          <Article
            key={article.id}
            {...article}
            id={article.id}
            uid={article.uid}
          />
        ))}
      </div>
    </div>
  );
}

export default Articles;
