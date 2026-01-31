import { useState, useContext } from 'react';
import API from '../../API/api';
import {
    AuthContext

} from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const submit = async (e) => {

        e.preventDefault();
        console.log(form);
        try {
            const res = await API.post('/auth/login', form);
            console.log('login response', res.data);
            localStorage.setItem('token', res.data.token);
            alert('Login successful!');
            console.log('render ')
            login(res.data.token,res.data.user);
          console.log("hopeful")
            navigate('/dashboard');
        
            
        } catch (err) {
            alert(err.response?.data?.msg || 'Error');
        }
    };
    
   return (
  <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-gray-300 font-mono px-4 relative overflow-hidden">
    {/* Subtle Grid Background Pattern */}
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
         style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}>
    </div>

    <form
      onSubmit={submit}
      className="z-10 w-full max-w-md bg-[#161616] border border-[#333] rounded-sm p-8 space-y-8 shadow-2xl"
    >
      {/* IDE-like Header */}
      <div className="space-y-2 border-l-4 border-indigo-500 pl-4">
        <h1 className="text-2xl font-bold tracking-tighter text-white uppercase">
          Auth::Authenticate
        </h1>
        
      </div>

      <div className="space-y-4">
        {/* Email Field */}
        <div className="group">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 group-focus-within:text-indigo-400 transition-colors">
            User_ID (Email)
          </label>
          <div className="relative">
             <span className="absolute left-3 top-3 text-gray-600 text-sm">@</span>
             <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="developer@node.local"
              autoComplete="username"
              className="w-full bg-[#0d0d0d] px-8 py-3 rounded-none border border-[#333] text-indigo-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="group">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 group-focus-within:text-indigo-400 transition-colors">
            Access_Key (Password)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600 text-sm">#</span>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#0d0d0d] px-8 py-3 rounded-none border border-[#333] text-indigo-300 placeholder-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* IDE Button Style */}
      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 text-white font-bold uppercase tracking-tighter hover:bg-indigo-500 active:scale-[0.98] transition-all border-b-4 border-indigo-800 flex items-center justify-center gap-2 group"
      >
        <span>Execute Login</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </button>

      {/* Footer / Meta Info */}
      <div className="pt-4 border-t border-[#333] flex flex-col gap-2">
        <p className="text-[10px] text-gray-500 flex justify-between">
          <span>STATUS: NO_AUTH</span>
          <Link to="/signup" className="text-indigo-400 hover:text-white hover:underline transition-colors">
            INIT_NEW_USER
          </Link>
        </p>
      </div>
    </form>
  </div>
);
}