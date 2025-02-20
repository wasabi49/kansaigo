// client/src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   axios.get(`${API_URL}/auth/google`)
  //     .then(response => {
  //       setMessage(response.data);
  //     })
  //     .catch(error => {
  //       console.error('There was an error!', error);
  //     });
  // }, []);

  return (
    <div className="App">
      <h1>ログインテスト</h1>
      <button onClick={() => {
        window.location.href = `${API_URL}/auth/google`;
      }}>Google Login</button>
      <hr />
      <h1>ログイン確認</h1>
      <button onClick={() => {
        window.location.href = `${API_URL}/auth/verify`;
      }}>login check</button>
      <hr />
      <h1>ログアウト</h1>
      <button onClick={() => {
        window.location.href = `${API_URL}/auth/logout`;
      }}>logout</button>
    </div>
  );
}

export default App;
