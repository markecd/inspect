
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Login from './pages/Login';
import Articles from './pages/Articles';
import AddArticle from './pages/AddArticle';
import ObservationMap from './pages/ObservationMap';
import ArticleDetails from './pages/ArticleDetails';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ObservationMap />}/> 
        <Route path="/login" element={<Login />}/>
        <Route path="/articles" element={<Articles />}/>
        <Route path='/articles/:uid/:id' element={<ArticleDetails />}/>
        <Route path="/add-article" element={<AddArticle />}/>
      </Routes>
    </Router>
  )
}

export default App
