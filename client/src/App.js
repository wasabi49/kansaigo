import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Question from "./pages/Question";
import Result from "./pages/Result";
import Footer from "./components/Footer";

const API_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [message, setMessage] = useState(""); // ← ここで `message` を定義

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
      <div className="App" style={{ background: "none"}}>
        {/* バックエンドからのメッセージ表示（確認用） */}
        {message && <h1>{message}</h1>} {/* ← `message` を参照してもエラーが出ないように修正 */}

        {/* ルーティング設定 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/question" element={<Question />} />
          <Route path="/result" element={<Result />} />
        </Routes>

        {/* ナビゲーションバー（全ページ共通） */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
