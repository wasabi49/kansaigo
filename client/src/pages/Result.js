import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button2 from "../components/Button2"; // 実際のパスに合わせて変更してください

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
      className="p-4"
      style={{
        display: "flex",
        flexDirection: "column", // 縦方向に並べる
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh"
      }}
    >
      <div 
        style={{
          display: "flex",
          flexDirection: "column", // 縦に並べる
          alignItems: "center",
          justifyContent: "center",
          position: "relative", // 親要素にrelativeを追加
        }}
      >
        {/* bubble3.png 画像 */}
        <img 
          src="/assets/bubble3.png" 
          alt="bubble3" 
          style={{
            width: "80%", // 幅を80%に設定
            maxWidth: "400px", // 最大幅を400pxに設定
            height: "auto", // 高さは自動調整
            marginBottom: "20px", // 下に余白を追加
          }}
        />
        
        {/* 画像の上に重ねるテキスト */}
        <p 
          style={{
            position: "absolute", // 絶対配置
            top: "50%", // 垂直中央
            left: "50%", // 水平中央
            transform: "translate(-50%, -50%)", // 完全に中央に配置
            color: "black", // テキストカラー
            fontSize: "24px", // フォントサイズ
            fontWeight: "bold", // 太字
            zIndex: 10, // 画像の上に表示
          }}
        >
          飴ちゃんあげるわぁ～
        </p>
      </div>
        {/* obachaan.png 画像 */}
        <img 
          src="/assets/obachaan.png" 
          alt="obachaan" 
          style={{
            width: "80%", // 幅を80%に設定
            maxWidth: "400px", // 最大幅を400pxに設定
            height: "auto", // 高さは自動調整
            marginTop: "20px", // 上に余白を追加
          }}
        />

      {/* ボタン */}
      <Button2 onClick={() => navigate("/")}>XPを受け取る</Button2>
    </div>
  );
};

export default Result;
