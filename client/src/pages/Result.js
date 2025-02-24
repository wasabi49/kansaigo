import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "react-lottie-player";
import animationData from "../assets/Obachaan.json"; // Lottieアニメーションデータをインポート

const Result = () => {
  const navigate = useNavigate();
  const lottieRef = useRef(null);

  useEffect(() => {
    // フッターを非表示にする
    const footer = document.getElementById("footer");
    if (footer) footer.style.display = "none";

    return () => {
      if (footer) footer.style.display = "block"; // クリーンアップ時にフッターを再表示
    };
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.goToAndPlay(0, true); // アニメーションを最初から再生
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "20px",
        textAlign: "center",
        padding: "16px",
        animation: "fadeIn 0.6s ease-in-out",
      }}
    >
      {/* 吹き出しのデザイン */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          animation: "bounceIn 0.8s ease-in-out",
        }}
      >
        <img
          src="/assets/bubble3.png"
          alt="吹き出し"
          style={{ width: "85%", maxWidth: "350px", height: "auto" }}
        />
        <p
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
            fontSize: "22px",
            fontWeight: "bold",
            width: "75%",
            whiteSpace: "pre-wrap",
            textAlign: "center",
            lineHeight: "1.5",
          }}
        >
          飴ちゃんあげるわぁ～
        </p>
      </div>

      {/* Lottieアニメーション */}
      <Lottie
        ref={lottieRef}
        loop={true} // アニメーションをループ再生
        play={true} // 自動再生
        animationData={animationData}
        onComplete={() => {
          if (lottieRef.current) {
            lottieRef.current.goToAndPlay(0, true); // 再生が終わったら最初に戻る
          }
        }}
        style={{ width: "50%", maxWidth: "230px", height: "auto" }}
      />

      {/* XP受け取りボタン */}
      <button
        onClick={() => navigate("/")}
        style={{
          background: "linear-gradient(135deg, #226FA8 0%, #1D5E90 100%)", // 青系グラデーション
          color: "white",
          padding: "16px 24px",
          fontSize: "20px",
          fontWeight: "bold",
          border: "2px solid rgb(10, 44, 70)",
          borderRadius: "12px", // 角丸デザイン
          cursor: "pointer",
          transition: "all 0.3s ease-in-out",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)", // 影を追加
          transform: "scale(1)",
          maxWidth: "260px",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)"; // ホバー時に拡大
          e.target.style.boxShadow = "0px 12px 24px rgba(0, 0, 0, 0.3)"; // 影を強調
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)"; // 元のサイズに戻す
          e.target.style.boxShadow = "0px 8px 20px rgba(0, 0, 0, 0.2)"; // 影を戻す
        }}
      >
        XPを受け取る
      </button>
    </div>
  );
};

export default Result;
