import { useState } from "react";
import { Box, Flex, VStack, Input, Button, Text, Image, IconButton, Link } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ログイン情報:", formData);
    navigate("/home");  // ログイン後にHome.jsへ遷移
  };

  return (
    <Flex justify="center" align="center" minH="100vh" p={{ base: "4", md: "8" }}>
      <VStack spacing="6" width="100%" maxW="400px" align="center">

        {/* 吹き出しタイトル */}
        <Box position="relative" width="250px" height="auto" mx="auto">
          <Image 
            src="/assets/bubble1.png"
            alt="吹き出し"
            width="100%"
            height="auto"
          />
          <Box
            position="absolute"
            top="35%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="md" fontWeight="bold" textAlign="center" color="black">
              ログインする
            </Text>
          </Box>
        </Box>

        {/* フォームコンテナ */}
        <Box
          bg="white"
          p="6"
          borderRadius="lg"
          boxShadow="lg"
          border="2px solid black"
          width="100%"
          maxW="400px"
          mx="auto"
        >
          <VStack spacing="4" as="form" onSubmit={handleSubmit} align="center" width="100%">

            {/* メールアドレス */}
            <Flex align="center" border="2px solid black" borderRadius="md" p="2" width="100%" height="50px" boxShadow="md">
              <Image src="/assets/icon-mail.png" alt="メールアイコン" boxSize="20px" mr="2" />
              <Input
                name="email"
                placeholder="メールアドレス"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="unstyled"
                flex="1"
                bg="white"
                appearance="none"
                _focus={{ outline: "none", boxShadow: "none", background: "white" }}
              />
            </Flex>

            {/* パスワード */}
            <Flex align="center" border="2px solid black" borderRadius="md" p="2" width="100%" height="50px" boxShadow="md">
              <Image src="/assets/icon-kagi.png" alt="鍵アイコン" boxSize="20px" mr="2" />
              <Input
                name="password"
                placeholder="パスワード"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                variant="unstyled"
                flex="1"
                bg="white"
                appearance="none"
                _focus={{ outline: "none", boxShadow: "none", background: "white" }}
              />
              <IconButton
                icon={
                  <Image
                    src={showPassword ? "/assets/password-mieru.png" : "/assets/password-mienai.png"}
                    alt="目アイコン"
                    boxSize="24px"
                  />
                }
                aria-label="パスワード表示切り替え"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
              />
            </Flex>

            {/* ログインボタン */}
            <Button
              type="submit"
              bg="orange.400"
              color="white"
              borderRadius="full"
              width="100%"
              size="lg"
              _hover={{ bg: "orange.500" }}
              border="2px solid black"
            >
              ログインする
            </Button>

            {/* アカウント作成案内（改行 + 下線） */}
            <Text fontSize="sm" color="gray.600" textAlign="center">
              アカウントをお持ちでない方はこちら
            </Text>
            <Link 
              fontSize="sm" 
              fontWeight="bold" 
              color="blue.500" 
              cursor="pointer"
              textDecoration="underline"
              borderBottom="2px solid blue" // 下線を追加
              _hover={{ textDecoration: "none", borderBottom: "2px solid blue" }}
              onClick={() => navigate("/register")}
            >
              新規登録する
            </Link>

          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Login;
