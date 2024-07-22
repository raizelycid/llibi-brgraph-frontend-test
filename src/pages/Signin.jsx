import React, {useState, useRef, useEffect} from 'react';
import Logo from '../images/logo.svg';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import ModalBlank from '../components/ModalBlank';
import { useAuth } from '../contexts/AuthContext';

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { user, setUser, csrfToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      csrfToken();
      const response = await axios.post('/login', {
        username,
        password,
        remember
      });
      setUser(response.data.user);
      navigate('/');
    } catch(error){
      if(error){
        setErrorMessage(error.response.data.message);
      }
      setErrorModalOpen(true);
    }
  };

  // check if the user is already logged in, if so redirect to the home page
  useEffect(() => {
    if(user){
      navigate('/');
    }
  }, []);


  return (
    <main className="bg-white dark:bg-slate-900">

      <div>

        {/* Content */}
        <div className='flex items-center justify-center h-sc'>
          <div className="min-h-[100dvh] h-full flex flex-col after:flex-1">

            {/* Header */}
            <div className="flex-1">
              <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link className="block j" to="/">
                  <img className="h-12" src={Logo} alt="Workflow" />
                  
                </Link>
              </div>
            </div>

            <div className="max-w-sm mx-auto w-full px-4 py-8">
              <h1 className="text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Log In</h1>
              {/* Form */}
              <form>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="username">Username</label>
                    <input id="username" className="form-input w-full" type="text" autoComplete="on" onChange={(e) => setUsername(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
                    <input id="password" className="form-input w-full" type="password" autoComplete="on" onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="remember">Remember me</label>
                    <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className='mx-2' />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <div className="mr-1">
                    <Link className="text-sm underline hover:no-underline" to="/reset-password">Forgot Password?</Link>
                  </div>
                  <div>
                    <button type="submit" onClick={handleSubmit} className="btn btn-primary">Log In</button>
                  </div>
                </div>
              </form>
              {/* Footer */}
              
            </div>

          </div>
        </div>
      

      </div>

    </main>
  );
}

export default Signin;