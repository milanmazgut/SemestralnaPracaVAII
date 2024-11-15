import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import RoofDetailPage from './pages/RoofDetailPage';
import ChimneyDetailPage from './pages/ChimneyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strechy" element={<RoofDetailPage />} />
        <Route path="/kominy" element={<ChimneyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />   
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
