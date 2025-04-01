import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setToken, setUserData } from "../utils/auth";

const API_BASE_URL = "http://localhost:3003"; // Change this if your API moves

const Auth = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({ username: "", email: "", password: "" });
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setAlertMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? `${API_BASE_URL}/user/login` : `${API_BASE_URL}/user/register`;

      const response = await axios.post(url, {
        email: user.email,
        password: user.password,
        username: user.username,
      });

      if (isLogin) {
        setToken(response.data.token);

        // Fetch the logged-in user's data
        const userResponse = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        });

        localStorage.setItem("userData", JSON.stringify(userResponse.data));

        setUserData(userResponse.data);
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setAlertMessage("Account created successfully! Please log in.");
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="container">
      {alertMessage && <div className="alert alert-info">{alertMessage}</div>}
      <div className="card mt-5">
        <div className="card-body">
          <h5 className="card-title">{isLogin ? "Login" : "Register"}</h5>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              {isLogin ? "Login" : "Register"}
            </button>
            <button
              type="button"
              className="btn btn-link mt-3"
              onClick={handleSwitch}
            >
              Switch to {isLogin ? "Register" : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
