import { Button } from "@yamada-ui/react";

const CustomButton = ({ 
  text, 
  bgColor = "#F9A31A", 
  textColor = "white", 
  onClick, 
  leftIcon, 
  isDisabled = false 
}) => {
  return (
    <Button
      bg={bgColor} // 背景色
      color={textColor} // 文字色
      size="lg"
      borderRadius="full" // 丸みを強調
      isDisabled={isDisabled} // 無効化オプション
      onClick={onClick}
      leftIcon={leftIcon} // アイコン対応
      _hover={{ bg: "#e89217", transform: "scale(1.05)", transition: "0.2s" }} // ホバー時のエフェクト
      _active={{ bg: "#d38114", transform: "scale(0.95)", transition: "0.1s" }} // クリック時のエフェクト
    >
      {text}
    </Button>
  );
};

export default CustomButton;
