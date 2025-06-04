import React, { useState } from 'react';
import { db } from '../firebase/config';
import { auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';


const AddArticle = () => {
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
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dodaj nov članek</h2>

      <input
        type="text"
        placeholder="Naslov"
        className="w-full p-2 border rounded mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Vsebina članka..."
        className="w-full p-2 border rounded mb-4 h-40"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Shranjujem...' : 'Shrani članek'}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default AddArticle;
