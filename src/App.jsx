import React from "react";
import Login from "./pages/Login/Login";
import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
    
    {/* Authentication  */}
    <Route path='/login' element={<Login/>}/>

    {/* Handle Invalid Routes  */}
    
    <Route path="*" element={<NotFound/>}/>


    </Routes>
  );
}
