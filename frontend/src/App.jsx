import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        <main className="flex-grow-1 mt-4">
          <div className="container py-4">
            <AppRoutes />
          </div>
        </main>
        <footer className="bg-white shadow-sm mt-auto">
          <div className="container py-3">
            <p className="text-center text-muted mb-0">
              © 2025 E-Shop. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
