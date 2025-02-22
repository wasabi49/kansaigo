import { VStack, Box, Flex, Image, Text, HStack } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";  // ← navigate を使うためにインポート
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();  // ← useNavigate を定義

  return (
    <Box minH="100vh" p="4" pb="80px">
      {/* ヘッダー（StatusBadgeを直接記述して横並びに） */}
      <Flex justify="center" align="center" mt="4">
        <HStack spacing="4">
          <StatusBadge imgSrc="/assets/icon-usi.png" count={4} />
          <StatusBadge imgSrc="/assets/icon-fire.png" count={169} />
          <StatusBadge imgSrc="/assets/icon-heart.png" count={13} />
        </HStack>
      </Flex>

      {/* 吹き出し風のデザイン（bubble1.png を使用） */}
      <Flex justify="center" mt="6">
        <Box position="relative" width="300px" height="auto">
          <Image 
            src="/assets/bubble1.png"  // 吹き出し画像
            alt="吹き出し"
            width="100%"
            height="auto"
          />
          <Text
            position="absolute"
            top="45%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="lg"
            fontWeight="bold"
            textAlign="center"
            width="90%"
            lineHeight="1.4"
            color="black"
          >
            大阪弁について知る
          </Text>
        </Box>
      </Flex>

      {/* レッスン一覧（牛アイコンをクリックで正しい画面へ遷移） */}
      <VStack mt="6" spacing="4" align="center">
        {[1, 2, 3, 4, 5].map((num) => (
          <Flex key={num} justify="center" align="center" w="100%">
            <Box
              onClick={() => navigate(`/question/${num}`)}  // ← クリックで問題画面へ遷移
              _hover={{ cursor: "pointer", transform: "scale(1.05)", transition: "0.2s" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="80px"
              h="80px"
              bg="white"
              borderRadius="full"
              border="3px solid black"
              boxShadow="md"
            >
              <Image 
                src="/assets/icon-usi.png" 
                alt={`レッスン${num}`} 
                boxSize="50px"
                objectFit="contain"
              />
            </Box>
          </Flex>
        ))}
      </VStack>

      {/* フッター */}
      <Footer />
    </Box>
  );
};

export default Home;
