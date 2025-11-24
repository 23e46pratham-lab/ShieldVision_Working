import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Result from './pages/Result';
import UploadCSV from './pages/UploadCSV';
import Logs from './pages/Logs';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/result" element={<Result />} />
            <Route path="/upload" element={<UploadCSV />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;