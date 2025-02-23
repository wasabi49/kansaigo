import { HStack, IconButton, Box } from "@yamada-ui/react"; 
import { Home, Crown, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box 
      id="footer"
      position="fixed" 
      bottom="0" 
      width="100%"  
      bg="#226FA8" 
      p="3"
      color="white"
      boxShadow="md"
    >
      <HStack 
        justify="center" 
        gap="15" 
        maxWidth="500px" 
        margin="0 auto"
      >
        {/* ホームボタン */}
        <IconButton 
          aria-label="Home"
          icon={<Home size={28} />}
          variant="ghost"
          color="white"
          size="lg"
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
          onClick={() => navigate("/")}
        />

        {/* ランキングボタン（未実装のため無効化） */}
        <IconButton 
          aria-label="Ranking"
          icon={<Crown size={28} />}
          variant="ghost"
          color="gray.200" // 無効ボタンのため明るいグレー
          size="lg"
          isDisabled={true} // クリック無効化
        />

        {/* プロフィールボタン */}
        <IconButton 
          aria-label="Profile"
          icon={<User size={28} />}
          variant="ghost"
          color="white"
          size="lg"
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
          onClick={() => navigate("/profile")}
        />
      </HStack>
    </Box>
  );
};

export default Footer;
