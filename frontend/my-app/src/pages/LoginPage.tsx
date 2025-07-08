import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../login.css';
import { BASE_URL } from '../api'; // 👈 use environment-based URL

interface LoginPageProps {
  setIsLoggedIn: (value: boolean) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: username,
          Password: password,
        }),
      });

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
        alert('Logged in successfully');
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../login.css';

// interface LoginPageProps {
//   setIsLoggedIn: (value: boolean) => void;//setIsLogged is a function that takes boolean value as parameter and returns void
// }

// export const LoginPage: React.FC<LoginPageProps> = ({ setIsLoggedIn }) => {//it says LoginPage is a React function componenet
//   const [username, setUsername] = useState('');//state variable
//   const [password, setPassword] = useState('');//state variable
//   const [error, setError] = useState('');//state variable
//   const navigate = useNavigate();//navigate function used for navigation

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();//function to handle to form submission

//     try {
//       const response = await fetch("https://localhost:7172/api/auth/login", {//response is a variable which stores the response got from backend
//         method: "POST",//adding a new user 
//         headers: {
//           "Content-Type": "application/json",// tells that body should be in json format
//         },
//         body: JSON.stringify({ Username: username, Password: password }),//converts our data to strings
//       });

//       if (response.ok) {
//         localStorage.setItem("isLoggedIn", "true");
//          setIsLoggedIn(true); 
//         alert("Loginned successfully");//stores the user in localstorage and navigates to dashboard.
//         console.log("Navigating to dashboard...");
//         navigate("/dashboard");
//       } else {
//         const data = await response.json();
//         setError(data.message || "Login failed");//if login fails error message will comes
//       }
//     } catch (err) {
//       setError("Server error. Please try again later.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}> 
//         <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         {error && <p className="error">{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
