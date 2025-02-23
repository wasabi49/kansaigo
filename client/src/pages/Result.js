import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import CustomButton from "../components/Button";

const Result = () => {
  const navigate = useNavigate();
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Lottieアニメーションデータを読み込む
    fetch("/assets/Obachaan.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading animation:", error));

    // フッターを非表示にする
    const footer = document.getElementById("footer");
    if (footer) footer.style.display = "none";

    return () => {
      if (footer) footer.style.display = "block";
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "20px", textAlign: "center", padding: "16px", animation: "fadeIn 0.6s ease-in-out" }}>
      {/* 吹き出しのコンテナ */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "bounceIn 0.8s ease-in-out" }}>
        <img src="/assets/bubble3.png" alt="bubble3" style={{ width: "85%", maxWidth: "350px", height: "auto" }} />
        <p style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "black", fontSize: "22px", fontWeight: "bold", width: "75%", whiteSpace: "pre-wrap", textAlign: "center", lineHeight: "1.5" }}>飴ちゃんあげるわぁ～</p>
      </div>

      {/* Lottieアニメーション */}
      {animationData && (
        <Lottie loop animationData={animationData} play style={{ width: "50%", maxWidth: "230px", height: "auto" }} />
      )}

      {/* XP受け取りボタン */}
      <CustomButton text="XPを受け取る" onClick={() => navigate("/")} bgColor="#F9A31A" textColor="white" hoverColor="#E89217" style={{ maxWidth: "260px", fontSize: "18px", boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)" }} />
    </div>
  );
};

export default Result;
