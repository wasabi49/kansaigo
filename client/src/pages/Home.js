import { useState, useEffect } from "react";
import { VStack, Box, Flex, Image, Text, HStack, Button, Modal, ModalOverlay, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@yamada-ui/react";
import { useNavigate } from "react-router-dom";  
import { fetchDialects, fetchQuestsByDialect } from "../api/api";
import StatusBadge from "../components/StatusBadge";
import Footer from "../components/Footer";

const iconMapping = {
  "大阪弁": "/assets/icon-tako.png",
  "京都弁": "/assets/icon-ume.png",
  "兵庫弁": "/assets/icon-usi.png"
};

const Home = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dialects, setDialects] = useState([]);
  const [selectedDialect, setSelectedDialect] = useState(null);
  const [quests, setQuests] = useState([]);

  // ✅ ページを開いたときに `localStorage` から選択中の方言を取得
  useEffect(() => {
    const getDialects = async () => {
      try {
        const response = await fetchDialects();
        setDialects(response.data);

        // `localStorage` から前回選択した方言を取得
        const savedDialect = localStorage.getItem("selectedDialect");
        if (savedDialect) {
          const parsedDialect = JSON.parse(savedDialect);
          setSelectedDialect(parsedDialect);
        } else {
          setSelectedDialect(response.data[0]); // 初回のみデフォルトを設定
        }
      } catch (error) {
        console.error("方言の取得に失敗:", error);
      }
    };

    getDialects();
  }, []);

  // ✅ 方言を選択したときに `localStorage` に保存
  const handleDialectSelect = (dialect) => {
    setSelectedDialect(dialect);
    localStorage.setItem("selectedDialect", JSON.stringify(dialect)); // 保存
    onClose();
  };

  // ✅ `selectedDialect` が変わるたびにクエスト一覧を取得
  useEffect(() => {
    if (!selectedDialect) return;
  
    const getQuests = async () => {
      try {
        const response = await fetchQuestsByDialect(selectedDialect.id);
        console.log(`取得したクエスト一覧 (方言ID: ${selectedDialect.id})`, response.data);
        setQuests(response.data.slice(0, 5)); // 🔥 5個だけ表示
      } catch (error) {
        console.error("クエスト一覧の取得に失敗:", error);
      }
    };
  
    getQuests();
  }, [selectedDialect]); // 方言が変わるたびにクエストを再取得
  
  

  return (
    <Box minH="100vh" p="4" pb="80px">
      {/* ヘッダー */}
      <Flex justify="center" align="center" mt="10">
        <HStack spacing="4">
          {selectedDialect && (
            <Box onClick={onOpen} _hover={{ cursor: "pointer", transform: "scale(1.08)", transition: "0.2s ease-in-out" }}>
              <StatusBadge imgSrc={iconMapping[selectedDialect.name]} count={4} />
            </Box>
          )}
          <StatusBadge imgSrc="/assets/icon-fire.png" count={169} />
          <StatusBadge imgSrc="/assets/icon-heart.png" count={13} />
        </HStack>
      </Flex>

      {/* 吹き出し */}
      <Flex justify="center" mt="12">
        <Box position="relative" width="260px">
          <Image src="/assets/bubble1.png" alt="吹き出し" width="100%" />
          <Text position="absolute" top="40%" left="50%" transform="translate(-50%, -50%)" fontSize="md" fontWeight="bold" textAlign="center" width="80%" lineHeight="1.2" color="black">
            {selectedDialect ? `${selectedDialect.name}について知る` : "方言を選択してください"}
          </Text>
        </Box>
      </Flex>

      {/* クエスト一覧 */}
      <VStack mt="5" align="center">
        {quests.map((quest) => (
          <Flex key={quest.id} justify="center" align="center" w="100%">
            <Box
              onClick={() => navigate(`/question/${quest.id}`, { state: { dialectId: selectedDialect.id } })}
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
              mb="12px"
            >
              <Image src={iconMapping[selectedDialect.name]} alt={`クエスト${quest.id}`} boxSize="48px" objectFit="contain" />
            </Box>
          </Flex>
        ))}
      </VStack>

      <Footer />

      {/* 方言選択モーダル */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <Box bg="white" p={6} borderRadius="md" maxW="400px" width="90%" mx="auto" display="flex" flexDirection="column" justifyContent="center" alignItems="center" minH="250px" shadow="md">
          <ModalHeader textAlign="center" fontSize="lg">方言を選択</ModalHeader>
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={4} width="100%">
            {dialects.map((dialect) => (
              <Button key={dialect.id} w="100%" leftIcon={<Image src={iconMapping[dialect.name]} boxSize="24px" />} onClick={() => handleDialectSelect(dialect)}>
                {dialect.name}
              </Button>
            ))}
          </ModalBody>
          <ModalFooter justifyContent="center" mt={4}>
            <Button onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home;
