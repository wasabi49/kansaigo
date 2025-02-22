import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Question from "./pages/Question";
import Result from "./pages/Result";
import Footer from "./components/Footer";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function AppContent() {
  const location = useLocation(); // 現在のページURLを取得

  // Footerを表示するページ
  const showFooter = location.pathname === "/" || location.pathname === "/profile";

  return (
    <div className="App" style={{ background: "none" }}>

      {/* ログインテスト用のコード（必要なら有効化） */}
      {/* <h1>Googleログインテスト</h1>
        <button onClick={() => {
          window.location.href = `${API_URL}/auth/google`;
        }}>Google Login</button>
        <hr />

        <h1>ローカルログインテスト</h1>
        <form action={`${API_URL}/auth/local/login`} method="POST">
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
        <form action={`${API_URL}/auth/local/register`} method="POST">
          <input type="text" name="mail_address" />
          <input type="text" name="password" />
          <button type="submit">登録</button>
        </form>
        <hr />

        <h1>方言一覧取得</h1>
        <button onClick={() => {
          window.location.href = `${API_URL}/dialects`;
        }}>dialects</button> */}

      {/* ルーティング設定 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/question" element={<Question />} />
        <Route path="/result" element={<Result />} />
      </Routes>

      {/* Home と Profile のみ Footer を表示 */}
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/auth/verify`)
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <Router>
      {message && <h1>{message}</h1>}
      <AppContent />
    </Router>
  );
}

export default App;
