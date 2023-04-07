import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from './Context/AuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google'

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    {/* Wrap Whole application with Google OAuth */}
    <GoogleOAuthProvider clientId="237773783724-n6cgcfru32cfpn8jl5gu0ndivjfi6hcb.apps.googleusercontent.com">
        {/* AuthContext is a provider that wraps the entire app */}
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
