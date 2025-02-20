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
      <h1>Googleログインテスト</h1>
      <button onClick={() => {
        window.location.href = `${API_URL}/auth/google`;
      }}>Google Login</button>
      <hr />
      <h1>ローカルログインテスト</h1>
      <form
        action={`${API_URL}/auth/local/login`}
        method="POST"
      >
        <input type="text" name="mail_address" />
        <input type="text" name="password" />
        <button type="submit">ログイン</button>
      </form>

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
      <hr />
      <h1>ローカルユーザー登録</h1>
      <form
        action={`${API_URL}/auth/local/register`}
        method="POST"
      >
        <input type="text" name="mail_address" />
        <input type="text" name="password" />
        <button type="submit">登録</button>
      </form>
      <hr />
      <h1>方言一覧取得</h1>
      <button onClick={() => {
        window.location.href = `${API_URL}/dialects`;
      }}>dialects</button>
    </div>
  );
}

export default App;
