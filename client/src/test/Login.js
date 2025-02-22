import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api"; // 正しいパス

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // API通信
      alert("ログイン成功！");
      navigate("/"); // ログイン後にトップページへ
    } catch (error) {
      alert("ログイン失敗: " + (error.response?.data?.message || "エラーが発生しました"));
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  );
};

export default Login;
