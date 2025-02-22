import { VStack, Box, Flex } from "@yamada-ui/react";
import StatusBadges from "../components/StatusBadge";
import CustomButton from "../components/Button";
import Card from "../components/Card";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <Box bg="yellow.300" minH="100vh" p="4">
      {/* ヘッダー（中央寄せのステータスバッジ） */}
      <Flex justify="center" align="center" mt="4">
        <StatusBadges />
      </Flex>

      {/* クエストの説明ボタン */}
      <VStack mt="6" spacing="4">
        <CustomButton 
          text="大阪弁について知る"
          onClick={() => console.log("大阪弁ページへ")}
        />
        
        {/* レッスン一覧 */}
        {[1, 2, 3, 4, 5].map((num) => (
          <Card key={num} title={`レッスン ${num}`} onClick={() => console.log(`レッスン ${num} へ`)} />
        ))}
      </VStack>

      {/* フッター */}
      <Footer />
    </Box>
  );
};

export default Home;
