import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password] = useState("password");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container center">
      <div className="card login-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <input type="password" value={password} disabled />
          <button type="submit" className="btn">Login</button>
        </form>
        <div style={{marginTop:12, fontSize:14}}>
          <strong>Test Accounts:</strong>
          <ul>
            <li>admin@acme.test</li>
            <li>user@acme.test</li>
            <li>admin@globex.test</li>
            <li>user@globex.test</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
