import { VStack, Box, Flex, Image, Text, HStack } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";  
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" p="4" pb="80px">
      {/* ヘッダー（ステータスバッジを中央配置） */}
      <Flex justify="center" align="center" mt="10">
        <HStack spacing="4">
          <StatusBadge imgSrc="/assets/icon-usi.png" count={4} />
          <StatusBadge imgSrc="/assets/icon-fire.png" count={169} />
          <StatusBadge imgSrc="/assets/icon-heart.png" count={13} />
        </HStack>
      </Flex>

      {/* 吹き出し（テキストを中央に配置） */}
      <Flex justify="center" mt="12">
        <Box position="relative" width="260px">
          <Image 
            src="/assets/bubble1.png"  
            alt="吹き出し"
            width="100%"
          />
          <Text
            position="absolute"
            top="40%"  
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="md"
            fontWeight="bold"
            textAlign="center"
            width="80%"
            lineHeight="1.2"
            color="black"
          >
            大阪弁について知る
          </Text>
        </Box>
      </Flex>

      {/* レッスン一覧（牛アイコンをクリックで問題画面へ遷移） */}
      <VStack mt="5" align="center">
        {[1, 2, 3, 4, 5].map((num, index) => (
          <Flex key={num} justify="center" align="center" w="100%">
            <Box
              onClick={() => navigate(`/question/${num}`)}
              _hover={{ cursor: "pointer", transform: "scale(1.08)", transition: "0.2s ease-in-out" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              w="75px"
              h="75px"
              bg="white"
              borderRadius="full"
              border="3px solid black"
              boxShadow="md"
              mb={index !== 4 ? "12px" : "0"} // 最後のアイコン以外は間隔を追加
            >
              <Image 
                src="/assets/icon-usi.png" 
                alt={`レッスン${num}`} 
                boxSize="48px"
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
