import React, { useState } from 'react';
import {
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Footer from './component/Footer';
import Navbar from './component/Navbar';
import { CartProvider } from './pages/CartContext';
import CartPage from './pages/CartPage';
import Home from './pages/Home';
import Login from './pages/Login';
import { default as Orders, default as OrdersPage } from './pages/OrdersPage';
import ProductDetails from './pages/ProductsDetails';
import ProductsPage from './pages/ProductsPage';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import AdminDashboardUserDetails from './pages/admin/AdminDasboardUserDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDashboardOrderDetails from './pages/admin/AdminDashboardOrderDetails';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminRoutes from './protected_routes/AdminRoutes';
import UserRoutes from './protected_routes/UserRoutes';
function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    
    <CartProvider>
    <Router>
      <Navbar setSearchQuery={setSearchQuery}searchQuery={searchQuery} />
      
     
      <ToastContainer />
      <div className='main'>

      <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/products" element={<ProductsPage searchQuery={searchQuery} />} />
      <Route path="/product/:id" element={<ProductDetails />} />
        
       
        <Route path='/products' element={<ProductsPage />} />
       {/* <Route path="/cart" component={CartPage} /> */}
       <Route path="/cart/:id" element={<CartPage/>} />
        
      
        
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/orders' element={<Orders />} />
        
       

        <Route element={<UserRoutes/>}>
        
        <Route path='/orders' element={<OrdersPage/>} />
        
        </Route>


        <Route element={<AdminRoutes />} >
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/dashboarduser' element={<AdminDashboardUserDetails />} />
          <Route path='/admin/dashboardorder' element={<AdminDashboardOrderDetails />} />
          <Route path='/admin/edit/:id' element={<AdminEditProduct />} />
        </Route>

      </Routes>
      </div>

      <Footer></Footer>

    </Router>
    </CartProvider>
  );
}

export default App;
