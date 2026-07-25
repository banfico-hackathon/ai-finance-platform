import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './api/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Dashboard from './pages/User Side/Dashboard/Dashboard';
import Transactions from './pages/User Side/Transactions/Transactions';
import Spending from './pages/User Side/Spending/Spending';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/transactions" element={<Transactions />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/dashboard/spending" element={<Spending />} />
            <Route path="/spending" element={<Spending />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
