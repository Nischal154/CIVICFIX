import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNavbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitComplaint from './pages/SubmitComplaint';
import Feed from './pages/Feed';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit" element={<SubmitComplaint />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
