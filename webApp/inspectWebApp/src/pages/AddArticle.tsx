import React, { useState } from 'react';
import { db } from '../services/firebase/config';
import { auth } from '../services/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import '../assets/styles/add-article.css';


function AddArticle(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!title || !content) return;
  
    const user = auth.currentUser;
    if (!user) {
      setMessage('Uporabnik ni prijavljen.');
      return;
    }
  
    setLoading(true);
    setMessage('');
  
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      let username = '';
      if (userDocSnap.exists()) {
        username = userDocSnap.data().username || '';
      } else {
        setMessage('Uporabniški profil ni najden.');
        setLoading(false);
        return;
      }
  
      const userArticlesRef = collection(db, 'users', user.uid, 'articles');
      await addDoc(userArticlesRef, {
        title,
        content,
        username, 
        createdAt: serverTimestamp(),
      });
  
      setMessage('Članek uspešno shranjen!');
      console.log("Članek oddan");
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Napaka pri shranjevanju članka:', err);
      setMessage('Napaka pri shranjevanju članka.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="add-article-container">
    <h2 className="add-article-title">Dodaj nov članek</h2>

    <input
      type="text"
      placeholder="Naslov"
      className="add-article-input"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <textarea
      placeholder="Vsebina članka..."
      className="add-article-textarea"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />

    <button
      onClick={handleSubmit}
      disabled={loading}
      className="add-article-button"
    >
      {loading ? 'Shranjujem...' : 'Shrani članek'}
    </button>

    {message && <p className="add-article-message">{message}</p>}
  </div>
  );
};

export default AddArticle;
