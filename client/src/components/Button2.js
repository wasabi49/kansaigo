import { Button } from "@yamada-ui/react"; // YAMADA UI の Button を使用（もし他のライブラリを使う場合は変更）

// Button2 コンポーネント
const Button2 = ({ onClick, children, ...props }) => {
  return (
    <Button
      onClick={onClick}
      colorScheme="teal" // ボタンの色（適宜変更）
      size="lg" // ボタンのサイズ
      variant="solid" // ボタンのバリアント（solid）
      borderRadius="lg" // 丸みを帯びた角（大きな丸み）
      padding="12px 24px" // ボタンの内側の余白（長方形にするため）
      _hover={{ bg: "teal.600", color: "white" }} // ホバー時の背景色
      {...props} // 他のプロパティをそのまま渡す
    >
      {children}
    </Button>
  );
};

export default Button2;
