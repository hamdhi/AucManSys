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
import PaymentInfo from "./pages/PaymentInfo";
// import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → login page */}
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/" element={<Login/>} />

        {/* Your pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/productList" element={<ProductList />} />
        <Route path="/userList" element={<UserList />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="/bidder" element={<Bidder />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/updateProduct" element={<UpdateProduct />} />
        <Route path="/updateUser" element={<UpdateUser />} />
        <Route path="/viewProduct" element={<ViewProduct />} />
        <Route path="/paymentInfo" element={<PaymentInfo />} />
        {/* <Route path="/HomePage" element={<HomePage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
