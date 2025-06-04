import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ObservationMap from './pages/ObservationMap';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<ObservationMap />}/>
      </Routes>
    </Router>
  )
}

export default App
