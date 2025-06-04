import React, { useState } from 'react';
import { db } from '../services/firebase/config';
import { auth } from '../services/firebase/config';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase/config'; 

import '../assets/styles/add-article.css';

function AddArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
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

   
      let imageUrl = '';
      if (imageFile) {
        const path = `articles/${user.uid}/${Date.now()}_${imageFile.name}`;
        console.log("Path za upload:", path);
        console.log("File obstaja?", !!imageFile);
        console.log("UID:", user.uid);
      
        const imageRef = ref(storage, path);
        await uploadBytes(imageRef, imageFile); 
        imageUrl = await getDownloadURL(imageRef);
      }

      const userArticlesRef = collection(db, 'users', user.uid, 'articles');
      await addDoc(userArticlesRef, {
        title,
        content,
        username,
        createdAt: serverTimestamp(),
        imageUrl, 
        uid: user.uid
      });

      setMessage('Članek uspešno shranjen!');
      console.log("Članek oddan");
      setTitle('');
      setContent('');
      setImageFile(null);
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

      <input
        type="file"
        accept="image/*"
        className="add-article-input"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
}

export default AddArticle;
