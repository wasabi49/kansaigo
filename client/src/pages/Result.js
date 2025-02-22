import { useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/Button"; // カスタムボタンを使用

const Result = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // フッターを非表示にする
    const footer = document.getElementById("footer");
    if (footer) footer.style.display = "none";

    return () => {
      // ページを離れるときにフッターを再表示する
      if (footer) footer.style.display = "block";
    };
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
        animation: "fadeIn 0.6s ease-in-out", // ふんわり表示のアニメーション
      }}
    >
      {/* 吹き出しのコンテナ */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          animation: "bounceIn 0.8s ease-in-out", // ポップな動き
        }}
      >
        {/* 吹き出し画像 */}
        <img
          src="/assets/bubble3.png"
          alt="bubble3"
          style={{
            width: "85%", // 吹き出しサイズを調整
            maxWidth: "350px",
            height: "auto",
          }}
        />

        {/* 吹き出し内のテキスト */}
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

      {/* おばちゃんの画像 */}
      <img
        src="/assets/obachaan.png"
        alt="obachaan"
        style={{
          width: "50%", // 幅を調整
          maxWidth: "230px",
          height: "auto",
          marginTop: "-5px", // 位置調整
          animation: "fadeInUp 0.6s ease-in-out", // ふんわり表示
        }}
      />

      {/* XP受け取りボタン */}
      <CustomButton
        text="XPを受け取る"
        onClick={() => navigate("/")}
        bgColor="#F9A31A"
        textColor="white"
        hoverColor="#E89217"
        style={{
          maxWidth: "260px", // 適度な幅に調整
          fontSize: "18px",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", // 立体感を追加
        }}
      />
    </div>
  );
};

export default Result;
