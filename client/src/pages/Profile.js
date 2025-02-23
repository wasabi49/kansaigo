import { Box, Flex, VStack, Text, Image } from "@yamada-ui/react";  
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/Button"; // カスタムボタンコンポーネントをインポート

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Flex justify="center" align="center" minH="100vh" p="4">
      <VStack spacing="6" width="100%" maxW="400px" align="center">
        
        {/* ユーザー情報セクション */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
          textAlign="center"
        >
          <Flex justify="space-between" align="center">
            {/* ユーザー名・情報 */}
            <VStack align="start">
              <Text fontSize="xl" fontWeight="bold">毎度の舞妓</Text>
              <Text color="gray.600">@maiko-ookini</Text>
              <Text fontSize="sm" color="gray.500">2022年12月に参加</Text>
            </VStack>
            {/* ユーザーアイコン */}
            <Image 
              src="/assets/icon-maiko.png"
              alt="ユーザーアイコン"
              borderRadius="full"
              width="80px"
              height="80px"
            />
          </Flex>
        </Box>

        {/* 進捗情報セクション */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
        >
          {/* 連続記録 */}
          <Flex justify="space-between" align="center">
            <Text fontWeight="bold">連続記録</Text>
            <Flex align="center">
              <Image src="/assets/icon-fire.png" alt="連続記録" width="20px" height="20px" />
              <Text ml="2">169</Text>
            </Flex>
          </Flex>
          
          {/* 累計XP */}
          <Flex justify="space-between" align="center" mt="2">
            <Text fontWeight="bold">累計XP</Text>
            <Flex align="center">
              <Image src="/assets/icon-kaminari.png" alt="累計XP" width="20px" height="20px" />
              <Text ml="2">3000</Text>
            </Flex>
          </Flex>
        </Box>

        {/* ランクセクション */}
        <Box
          bg="white"
          p="4"
          borderRadius="lg"
          boxShadow="md"
          border="2px solid black"
          width="100%"
        >
          <Text fontWeight="bold">ランク</Text>

          {/* 各地域のランク情報 */}
          {[{ label: "大阪", rank: "江戸っ子", icon: "icon-tako.png" },
            { label: "神戸", rank: "牛使い", icon: "icon-usi.png" },
            { label: "京都", rank: "ブブ漬け職人", icon: "icon-ume.png" }
          ].map(({ label, rank, icon }) => (
            <Flex align="center" justify="space-between" mt="2" key={label}>
              <Text color="gray.700">{label}</Text>
              <Flex align="center" p="2" border="2px solid black" borderRadius="full" width="180px" justify="flex-end">
                <Text mr="2">{rank}</Text>
                <Image src={`/assets/${icon}`} alt={`${label}ランク`} width="20px" height="20px" />
              </Flex>
            </Flex>
          ))}
        </Box>

        {/* ログアウトボタン */}
        <CustomButton 
          text="ログアウト"
          bgColor="#226FA8"
          textColor="white"
          hoverColor="#1b5a88"
          onClick={() => navigate("/login")}
          maxWidth="200px"  // ボタン幅を短く調整
        />
      </VStack>
    </Flex>
  );
};

export default Profile;