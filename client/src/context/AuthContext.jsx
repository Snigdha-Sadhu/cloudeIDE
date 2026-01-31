import { createContext,useState,useEffect } from "react";
import  API from '../API/api';
export const AuthContext=createContext();

export function AuthProvider({children}){
const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
  
  });
  
  const [token, setToken] = useState(() => localStorage.getItem("token"));
const [loading, setLoading] = useState(true);

  useEffect(() => {
     console.log("Token at useEffect:", token);
    if (!token) {
        setUser(null);
        setLoading(false);
        return;
    }
      // Set the auth header for API calls
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verify token and get fresh user data from server
      API.get("/auth/me")
        .then((res) => {
            console.log("Auth/me success:", res.data);
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => {
          console.warn("Auth check failed", err.response?.data || err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          
            
            setUser(null);
            setToken(null);
        }).finally(() => setLoading(false));
      
    
},[token]);
const login=(token,userData)=>{
    localStorage.setItem('token',token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
   
}
const logout=()=>{
    localStorage.removeItem('token');
      localStorage.removeItem('user');
   
    delete API.defaults.headers.common['Authorization'];
     setUser(null);
  
}
return <AuthContext.Provider value={{user,loading,login,logout}}>{children}</AuthContext.Provider>
}
//export {  AuthProvider as default };