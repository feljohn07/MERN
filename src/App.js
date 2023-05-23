import React, { useEffect, useState } from "react"

// We use Route in order to define the different routes of our application
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthContext } from './Hooks/useAuthContext'

import Layout from "./Pages/Layout"
import Dashboard from "./Pages/Dashboard"
import Product from "./Pages/Product"
import Purchase from "./Pages/Purchase"
import Order from "./Pages/Order"
import Supplier from  "./Pages/Supplier"
import Customer from "./Pages/Customer"
import Login from "./Pages/Login"
import Register from "./Pages/Signup"
import Profile from "./Pages/Profile"
 
const App = () => {

  const { user } = useAuthContext()

  console.log(process.env.REACT_APP_CLIENT_ID);//printing it to console
  console.log(process.env.REACT_APP_URL);//printing it to console
 
  return (
    <>
      <BrowserRouter>
          <Routes>

            <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
              <Route index element={<Dashboard />} />
              <Route path="product" element={<Product />} />
              <Route path="purchase" element={<Purchase />} />
              <Route path="order" element={<Order />} />
              <Route path="supplier" element={<Supplier />} />
              <Route path="customer" element={<Customer />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />

            <Route 
              path="/signup" 
              element={!user ? <Register /> : <Navigate to="/" />} 
            />

            {/* <Route path="*" element={<Navigate to="/login" />} /> */}
  
          </Routes>
      </BrowserRouter>

    </>
  );
};
 
export default App;