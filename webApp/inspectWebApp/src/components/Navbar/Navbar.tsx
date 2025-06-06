import { Link, useLocation, useNavigate } from 'react-router-dom';
import splashIcon from '../../assets/images/splash-icon.png';
import { getAuth, signOut } from 'firebase/auth';
import '../../assets/styles/navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  if (location.pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userId"); 
      navigate('/login');
    } catch (error) {
      console.error('Napaka pri odjavi:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={splashIcon} alt="App Icon" className="navbar-icon" />
        <Link to="/" className="navbar-link">Zemljevid</Link>
        <Link to="/articles" className="navbar-link">Članki</Link>
        <Link to="/add-article" className="navbar-link">Dodaj članek</Link>
      </div>
      <button onClick={handleLogout} className="navbar-logout-button">
        Odjava
      </button>
    </nav>
  );
};

export default Navbar;
