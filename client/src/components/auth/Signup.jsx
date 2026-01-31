import {useState,useContext,useEffect} from 'react';
import API from'../../API/api';
import { AuthContext
    
 } from '../../context/AuthContext';
 import { Link } from 'react-router-dom';
 import {useNavigate} from'react-router-dom';
 export default function Signup(){
    const[form,setForm]=useState({name:'',email:'',password:''});
const {login}=useContext(AuthContext);
const navigate=useNavigate();
//const [form, setForm] = useState({ name: "", email: "", password: "" });

  // Run this once when component mounts
 useEffect(() => {
  const timer = setTimeout(() => {
    setForm({ name: '', email: '', password: '' });
  }, 50);
  return () => clearTimeout(timer);
}, []);// empty dependency array => runs only once

const submit=async(e)=>{

    e.preventDefault();
    console.log(form);
    try{
        const res=await API.post('/auth/signup',form);
        login(res.data.token,res.data.user);
        
    }catch(err){
const msg=(err.response?.data?.msg|| 'signup failed');
alert(msg);
if(msg.includes('User exists')){
    navigate('/login');
}
    }
    };
   
   return (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-300 font-mono px-4 relative overflow-hidden">
    {/* Subtle Grid Background */}
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
         style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
    </div>

    <form
      onSubmit={submit}
      autoComplete="off"
      className="z-10 w-full max-w-md bg-[#161616] border border-[#333] rounded-sm p-8 space-y-7 shadow-2xl"
    >
      {/* Branding & Status */}
      <div className="flex justify-between items-start border-b border-[#333] pb-4 mb-2">
        <div>
          <h1 className="text-xl font-bold text-indigo-500 tracking-tighter uppercase">
            AlgoKernel
          </h1>
         
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="group">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 group-focus-within:text-indigo-400 transition-colors">
          user.name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-indigo-500/50 text-sm italic font-bold">{">"}</span>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Developer Name"
              className="w-full bg-[#0d0d0d] px-8 py-3 rounded-none border border-[#333] text-indigo-300 placeholder-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 group-focus-within:text-indigo-400 transition-colors">
             user.email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-indigo-500/50 text-sm italic font-bold">{">"}</span>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="id@environment.local"
              className="w-full bg-[#0d0d0d] px-8 py-3 rounded-none border border-[#333] text-indigo-300 placeholder-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 group-focus-within:text-indigo-400 transition-colors">
          password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-indigo-500/50 text-sm italic font-bold">{">"}</span>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full bg-[#0d0d0d] px-8 py-3 rounded-none border border-[#333] text-indigo-300 placeholder-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 bg-[#1e1e1e] border border-[#444] text-white font-bold uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 active:bg-indigo-700 transition-all duration-200 group flex items-center justify-center gap-3"
        >
          <span className="text-indigo-500 group-hover:text-white transition-colors">INIT</span> 
          SIGN_UP
        </button>
      </div>

      {/* Footer */}
      <div className="pt-4 flex items-center justify-between text-[10px] text-gray-600 border-t border-[#333]">
        
        <div className="space-x-4">
           <span>EXISTING?</span>
           <Link to="/login" className="text-indigo-400 hover:text-white hover:underline uppercase tracking-wider">
             GOTO_LOGIN
           </Link>
        </div>
      </div>

    </form>
  </div>
);
 }