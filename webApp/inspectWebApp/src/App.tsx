
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Articles from './pages/Articles';
import AddArticle from './pages/AddArticle';
import ObservationMap from './pages/ObservationMap';
import RequireAuth from './services/firebase/authService';
import ArticleDetails from './pages/ArticleDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/" element={<RequireAuth><ObservationMap /></RequireAuth>}/>
        <Route path="/articles" element={<RequireAuth><Articles /></RequireAuth>}/>
        <Route path='/articles/:uid/:id' element={<ArticleDetails />}/>
        <Route path="/add-article" element={<AddArticle />}/>
      </Routes>
    </Router>
  )
}

export default App
