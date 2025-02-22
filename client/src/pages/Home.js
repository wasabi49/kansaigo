import { VStack, Box, Flex, Image, Text, HStack } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" p="4" pb="80px"> {/* 背景画像の指定は削除 */}
      {/* ヘッダー（StatusBadgeを直接記述して横並びに） */}
      <Flex justify="center" align="center" mt="4">
        <HStack spacing="4">
          <StatusBadge imgSrc="/assets/icon-usi.png" count={4} />
          <StatusBadge imgSrc="/assets/icon-fire.png" count={169} />
          <StatusBadge imgSrc="/assets/icon-heart.png" count={13} />
        </HStack>
      </Flex>

      {/* 吹き出し風の「大阪弁について知る」 */}
      <Flex justify="center" mt="6">
        <Box
          position="relative"
          bg="white"
          border="2px solid black"
          borderRadius="20px"
          px="6"
          py="3"
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          boxShadow="md"
          _hover={{ cursor: "pointer", transform: "scale(1.05)", transition: "0.2s" }}
          onClick={() => navigate("/about-kansaiben")}
          _before={{
            content: '""',
            position: "absolute",
            bottom: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "14px solid black",
          }}
          _after={{
            content: '""',
            position: "absolute",
            bottom: "-12px",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "12px solid white",
          }}
        >
          大阪弁について知る
        </Box>
      </Flex>

      {/* レッスン一覧（牛アイコンを中央配置） */}
      <VStack mt="6" spacing="4" align="center">
        {[1, 2, 3, 4, 5].map((num) => (
          <Flex key={num} justify="center" align="center" w="100%">
            <Box
              onClick={() => navigate(`/question/${num}`)}
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
