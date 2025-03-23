import { useState } from "react"; 
import { Box, Flex, VStack, Input, Button, Text, Image, IconButton, Link } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/api";


const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // フィールドの入力チェック
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("すべてのフィールドを入力してください");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }



    try {
      await register(formData.email, formData.password);
    } catch (error) {
      setError("登録に失敗しました: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 入力チェック
  const isFormValid = formData.email && formData.password && formData.confirmPassword;

  return (
    <Flex justify="center" align="center" minH="100vh" p={{ base: "4", md: "8" }}>
      <VStack spacing="6" width="100%" maxW="400px" align="center">
        {/* 吹き出しタイトル */}
        <Box position="relative" width="250px" height="auto" mx="auto">
          <Image src="/assets/bubble1.png" alt="吹き出し" width="100%" height="auto" />
          <Box position="absolute" top="40%" left="50%" transform="translate(-50%, -50%)" width="100%" display="flex" alignItems="center" justifyContent="center">
            <Text fontSize="md" fontWeight="bold" textAlign="center" color="black" whiteSpace="nowrap" maxWidth="80%">
              アカウント登録する
            </Text>
          </Box>
        </Box>

        {/* フォームコンテナ */}
        <Box bg="white" p="6" borderRadius="lg" boxShadow="lg" border="2px solid black" width="100%" maxW="400px" mx="auto">
          <VStack spacing="4" as="form" onSubmit={handleSubmit} align="center" width="100%">
            {/* エラーメッセージ */}
            {error && (
              <Text color="red.500" fontSize="sm" fontWeight="bold">
                {error}
              </Text>
            )}

            {/* メールアドレス */}
            <Flex align="center" border="2px solid black" borderRadius="md" p="2" width="100%" height="50px">
              <Image src="/assets/icon-mail.png" alt="メールアイコン" boxSize="20px" mr="2" />
              <Input name="email" placeholder="メールアドレス" type="email" value={formData.email} onChange={handleChange} variant="unstyled" flex="1" bg="white" _focus={{ outline: "none", boxShadow: "none", background: "white" }} />
            </Flex>

            {/* パスワード */}
            <Flex align="center" border="2px solid black" borderRadius="md" p="2" width="100%" height="50px">
              <Image src="/assets/icon-kagi.png" alt="鍵アイコン" boxSize="20px" mr="2" />
              <Input name="password" placeholder="パスワード" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} variant="unstyled" flex="1" bg="white" _focus={{ outline: "none", boxShadow: "none", background: "white" }} />
              <IconButton
                icon={
                  <Image src={showPassword ? "/assets/password-mieru.png" : "/assets/password-mienai.png"} alt="目アイコン" boxSize="24px" />
                }
                aria-label="パスワード表示切り替え"
                variant="ghost"
                _hover={{ bg: "transparent" }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </Flex>

            {/* パスワード確認 */}
            <Flex align="center" border="2px solid black" borderRadius="md" p="2" width="100%" height="50px">
              <Image src="/assets/icon-kagi.png" alt="鍵アイコン" boxSize="20px" mr="2" />
              <Input name="confirmPassword" placeholder="パスワード確認" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} variant="unstyled" flex="1" bg="white" _focus={{ outline: "none", boxShadow: "none", background: "white" }} />
              <IconButton
                icon={
                  <Image src={showConfirmPassword ? "/assets/password-mieru.png" : "/assets/password-mienai.png"} alt="目アイコン" boxSize="24px" />
                }
                aria-label="パスワード確認表示切り替え"
                variant="ghost"
                _hover={{ bg: "transparent" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </Flex>

            {/* 登録ボタン */}
            <Button type="submit" bg={isFormValid ? "orange.400" : "#C1C1C1"} color="white" borderRadius="full" width="100%" size="lg" _hover={{ bg: isFormValid ? "orange.500" : "#C1C1C1" }} border="2px solid black" isDisabled={!isFormValid || loading} isLoading={loading}>
              登録する
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default Register;