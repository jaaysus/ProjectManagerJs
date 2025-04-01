// src/utils/auth.js

export const getToken = () => {
    return localStorage.getItem('jwt_token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('jwt_token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('jwt_token');
  };
  
  export const getUserData = () => {
    return JSON.parse(localStorage.getItem('user_data'));
  };
  
  export const setUserData = (user) => {
    localStorage.setItem('user_data', JSON.stringify(user));
  };
  
  export const removeUserData = () => {
    localStorage.removeItem('user_data');
  };
  