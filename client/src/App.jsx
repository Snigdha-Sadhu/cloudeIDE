import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import IDE from './pages/IDE'
import Dashboard from './pages/Dashboard'
import Signup from './components/auth/Signup'
import Login  from './components/auth/Login'
import { AuthProvider } from './context/AuthContext'
import {AuthContext} from'./context/AuthContext'
import CreateProject from './pages/CreateProject'
import LandingPage from './pages/LandingPage'
import { useContext } from 'react';
function PrivateRoute({children}){
  const {user}=useContext(AuthContext);
  return user? children :<Navigate to ="/login"/>
}
function AppRoutes(){
  const {user,loading}=useContext(AuthContext);
   
  return (
    
    <Routes>
         <Route path="/" element={<LandingPage/>} />
       <Route path="/project/:projectId" element={
        <PrivateRoute>
        <IDE/>
        </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
          <Dashboard/>
          </PrivateRoute>
          } />
          <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
          <Route path="/create-project" element={
            <PrivateRoute>
            <CreateProject/>
            </PrivateRoute>
            } />
        
    </Routes>
    
  )
}


function App() {
  

  return (
    <AuthProvider>
    <BrowserRouter>
  <AppRoutes/>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
