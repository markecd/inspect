import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import '../assets/styles/login.css'
import splashIcon from '../assets/images/splash-icon.png';
import { useNavigate } from 'react-router-dom';


const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Prijava uspešna:", user.uid);
    } catch (err: any) {
      console.error("Napaka pri prijavi:", err.message);
      setError("Prijava ni uspela. Preveri e-pošto in geslo.");
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="login-container">
        <img src={splashIcon} alt="Dashboard" className="login-icon" />
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="E-pošta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Geslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          {error && <div className="login-error">{error}</div>}
          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Prijavljanje..." : "Prijava"}
          </button>
        </form>
      </div>
    );
};

export default Login;
