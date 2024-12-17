import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import CooksPage from './pages/Cooks';
import { useEffect } from 'react';
import { setAuthToken } from './features/auth/authSlice';
import ProductsPage from './pages/Products';
import { setProfile } from './features/profile/profileSlice';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cooks" element={<CooksPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </>
  );
}

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      dispatch(setAuthToken(token)); // Устанавливаем токен в Redux
    }

    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const customerId = localStorage.getItem('customerId')
    const userEmail = localStorage.getItem('userEmail')
    const userRole = localStorage.getItem('userRole')

    if (userId && userName && customerId && userEmail && userRole) {
      dispatch(setProfile({
        id: Number(userId),
        id_customer: Number(customerId),
        name: userName,
        email: userEmail,
        role: userRole,
      }))
    }
  }, [dispatch]);

  return <App />;
};

const WrappedApp = () => (
  <Provider store={store}>
    <Router>
      <AppWrapper />
    </Router>
  </Provider>
);

export default WrappedApp;