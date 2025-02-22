// Question.js
import { useState } from "react";
import { Box, VStack, Image, HStack, IconButton, Text } from "@yamada-ui/react";
import CustomButton from "../components/Button";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const correctAnswer = "本当に";
  const questionTitle = "関西弁の『ほんま』は、標準語でどういう意味でしょう？";

  const choices = ["本当に", "実は", "確かに", "絶対に"];

  return (
    <Box bg="white" minH="100vh" py="8" px="4">
      <HStack 
        justify="space-between" 
        align="center" 
        px={{ base: "min(300px, 10%)", md: "4" }} 
        py="4"
      >
        <IconButton
          icon={<Image src="/assets/icon-back.png" alt="戻る" width="24px" />}
          onClick={() => navigate(-1)}
          variant="ghost"
          aria-label="戻る"
        />
        <StatusBadge imgSrc="/assets/icon-heart.png" count={4} />
      </HStack>

      <VStack spacing="8" p="4" align="center">
        <Card title={questionTitle} mt="4" />

        <HStack spacing="6" justify="center" alignItems="flex-end">
          <Box position="relative" maxWidth="350px">
            <Image src="/assets/bubble2.png" alt="吹き出し" width="100%" />
            <Text
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              fontSize="lg"
              fontWeight="bold" // ★ 太文字に変更
              textAlign="center"
              width="85%"
              whiteSpace="pre-wrap"
            >
              あの映画、「ほんま」泣けたわ。
            </Text>
          </Box>
          <Image src="/assets/Obachaan.png" alt="おばちゃん" width="100px" />
        </HStack>

        <VStack spacing="6" mt="4">
          {choices.map((choice) => (
            <CustomButton
              key={choice}
              text={choice}
              onClick={() =>
                setSelectedAnswer((prev) => (prev === choice ? null : choice))
              }
              bgColor={selectedAnswer === choice ? "#CBBD87" : "#FFD015"}
              selected={selectedAnswer === choice}
            />
          ))}

          <CustomButton
            text="送信する"
            onClick={() => setIsSubmitted(true)}
            bgColor={selectedAnswer ? "#F9A31A" : "#C1C1C1"}
            textColor="white"
            isDisabled={!selectedAnswer}
            hoverColor={selectedAnswer ? "#E89217" : "#A0A0A0"}
          />
        </VStack>
      </VStack>
    </Box>
  );
};

export default Question;
