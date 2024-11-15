import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import RoofDetailPage from './pages/RoofDetailPage';
import ChimneyDetailPage from './pages/ChimneyDetailPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/strechy" element={<RoofDetailPage />} />
        <Route path="/kominy" element={<ChimneyDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
