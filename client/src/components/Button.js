// Button.js
import { Button } from "@yamada-ui/react";

const CustomButton = ({ 
  text, 
  bgColor = "#FFD015", 
  textColor = "black", 
  hoverColor = "#EDBD00",
  onClick, 
  leftIcon, 
  isDisabled = false, 
  selected = false 
}) => {
  return (
    <Button
      bg={bgColor}
      color={textColor}
      size="lg"
      borderRadius="full"
      isDisabled={isDisabled}
      onClick={onClick}
      leftIcon={leftIcon}
      width="100%" 
      maxWidth={{ base: "400px", md: "80%" }}
      mx="auto"
      my="2" // 各ボタンに個別の余白を追加
      _hover={{
        bg: isDisabled ? bgColor : hoverColor,
        transform: isDisabled ? "none" : "scale(1.05)",
        transition: "0.2s"
      }}
      _active={{ transform: "scale(0.95)", transition: "0.1s" }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
