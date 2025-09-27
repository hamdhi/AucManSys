import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your page components
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import UserList from "./pages/UserList";
import Seller from "./pages/Seller";
import Bidder from "./pages/Bidder";
import SignUp from "./pages/SignUp";
import UpdateProduct from "./pages/updateProduct";
import UpdateUser from "./pages/UpdateUser";
import ViewProduct from "./pages/viewProduct";
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → login page */}
        <Route path="/" element={<HomePage />} />

        {/* Your pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/bidder" element={<Bidder />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/update-product" element={<UpdateProduct />} />
        <Route path="/update-user" element={<UpdateUser />} />
        <Route path="/view-product" element={<ViewProduct />} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
