import { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, VStack, Image, HStack, IconButton, Text, keyframes } from "@yamada-ui/react";
import CustomButton from "../components/Button";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";

// アニメーション（フェードイン）
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const correctAnswer = "本当に";
  const questionTitle = "関西弁の『ほんま』は、標準語でどういう意味でしょう？";

  const choices = ["本当に", "実は", "確かに", "絶対に"];

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsCorrect(selectedAnswer === correctAnswer);
      setIsSubmitted(true);
    }
  };

  return (
    <Box bg="white" minH="100vh" py="6" px="4" display="flex" flexDirection="column" alignItems="center">
      <HStack 
        justify="space-between" 
        align="center" 
        width="100%"
        maxWidth="800px"
        px={{ base: "min(300px, 10%)", md: "4" }} 
        py="3"
      >
        <IconButton
          icon={<Image src="/assets/icon-back.png" alt="戻る" width="24px" />}
          onClick={() => navigate(-1)}
          variant="ghost"
          aria-label="戻る"
        />
        <StatusBadge imgSrc="/assets/icon-heart.png" count={4} />
      </HStack>

      <VStack spacing="6" p="4" align="center" maxWidth="600px" width="100%">
        <Card title={questionTitle} mt="4" />

        <HStack spacing="6" justify="center" alignItems="flex-end">
          <Box position="relative" maxWidth="300px">
            <Image src="/assets/bubble2.png" alt="吹き出し" width="100%" />
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize="md"
              fontWeight="bold"
              textAlign="center"
              width="85%"
              whiteSpace="pre-wrap"
            >
              あの映画、「ほんま」泣けたわ。
            </Text>
          </Box>
          <Image src="/assets/Obachaan.png" alt="おばちゃん" width="90px" />
        </HStack>

        <VStack spacing="6" mt="4" width="100%" align="center">
          {choices.map((choice) => (
            <CustomButton
              key={choice}
              text={choice}
              onClick={() =>
                setSelectedAnswer((prev) => (prev === choice ? null : choice))
              }
              bgColor={selectedAnswer === choice ? "#CBBD87" : "#FFD015"}
              selected={selectedAnswer === choice}
              width="100%"
              maxWidth="300px"
            />
          ))}

          {!isSubmitted ? (
            <CustomButton
              text="送信する"
              onClick={handleSubmit}
              bgColor={selectedAnswer ? "#F9A31A" : "#C1C1C1"}
              textColor="white"
              isDisabled={!selectedAnswer}
              hoverColor={selectedAnswer ? "#E89217" : "#A0A0A0"}
              width="100%"
              maxWidth="300px"
            />
          ) : (
            <VStack spacing="3" align="center" textAlign="center" width="100%" animation={`${fadeIn} 0.5s ease-in-out`}>
              {/* コンパクトな吹き出し風の結果表示 */}
              <Box
                position="relative"
                p="4"
                borderRadius="lg"
                boxShadow="lg"
                bg={isCorrect ? "green.100" : "red.100"}
                textAlign="center"
                maxWidth="70%" // 幅を小さく
                border="2px solid"
                borderColor={isCorrect ? "green.500" : "red.500"}
                transform="rotate(-2deg)"
              >
                <Text fontSize="xl" fontWeight="bold" color={isCorrect ? "green.700" : "red.700"}>
                  {isCorrect ? "🎉 正解やで！" : "😢 不正解やん！"}
                </Text>
                {!isCorrect && (
                  <Text fontSize="md" mt="2" fontWeight="bold">
                    正解は「{correctAnswer}」やで！
                  </Text>
                )}

                {/* 吹き出しの三角形 */}
                <Box
                  position="absolute"
                  bottom="-10px"
                  left="50%"
                  transform="translateX(-50%)"
                  width="0"
                  height="0"
                  borderLeft="12px solid transparent"
                  borderRight="12px solid transparent"
                  borderTop="12px solid"
                  borderTopColor={isCorrect ? "green.500" : "red.500"}
                />
              </Box>

              <CustomButton
                text="OK"
                onClick={() => navigate("/result")}
                bgColor="#F9A31A"
                textColor="white"
                hoverColor="#E89217"
                width="100%"
                maxWidth="300px"
                boxShadow="lg"
              />
            </VStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default Question;
