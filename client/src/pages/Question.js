import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestDetails, submitAnswer } from "../api/api";
import { Box, VStack, Image, HStack, IconButton, Text, keyframes } from "@yamada-ui/react";
import CustomButton from "../components/Button";
import Card from "../components/Card";
import StatusBadge from "../components/StatusBadge";

// アニメーション（フェードイン）
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const Question = () => {
  const { id: questId } = useParams(); // URLからクエストIDを取得
  const navigate = useNavigate();
  const [quest, setQuest] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // ✅ APIからクエスト詳細を取得
  useEffect(() => {
    const getQuestDetails = async () => {
      try {
        const response = await fetchQuestDetails(questId);
        console.log("取得した問題:", response.data);
        setQuest(response.data);
      } catch (error) {
        console.error("クエストの取得に失敗:", error);
      }
    };

    getQuestDetails();
  }, [questId]);

  // ✅ 回答を送信
  const handleSubmit = async () => {
    if (!selectedAnswer) return;
  
    // 選択肢オブジェクトを取得
    const selectedChoice = quest.choices.find((choice) => choice.content === selectedAnswer);
    if (!selectedChoice) {
      console.error("選択肢が見つかりません:", selectedAnswer);
      return;
    }
  
    console.log("送信するボタンが押された:", selectedChoice);
    
    try {
      const response = await submitAnswer(questId, selectedChoice.id); // 選択肢のIDを送る
      console.log("サーバーからの回答結果:", response.data);
      
      if (response.data) {
        setResult(response.data); // 正解 or 不正解の結果をセット
        setIsSubmitted(true);
      } else {
        console.error("APIのレスポンスが空です");
      }
    } catch (error) {
      console.error("回答の送信に失敗:", error);
      if (error.response) {
        console.log("エラーレスポンス:", error.response.data);
        console.log("ステータスコード:", error.response.status);
      }
    }
  };
  
  return (
    <Box bg="white" minH="100vh" py="6" px="4" display="flex" flexDirection="column" alignItems="center">
      {/* ヘッダー */}
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
        {quest ? (
          <>
            <Card title={quest.question} mt="4" />

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
                  {quest.example_sentence || "例文がありません"}
                </Text>
              </Box>
              <Image src="/assets/Obachaan.png" alt="おばちゃん" width="90px" />
            </HStack>

            <VStack spacing="6" mt="4" width="100%" align="center">
              {quest.choices.map((choice) => (
                <CustomButton
                  key={choice.id}
                  text={choice.content}
                  onClick={() => setSelectedAnswer(choice.content)}
                  bgColor={selectedAnswer === choice.content ? "#CBBD87" : "#FFD015"}
                  selected={selectedAnswer === choice.content}
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
                    bg={result.is_correct ? "green.100" : "red.100"}
                    textAlign="center"
                    maxWidth="70%"
                    border="2px solid"
                    borderColor={result.is_correct ? "green.500" : "red.500"}
                    transform="rotate(-2deg)"
                  >
                    <Text fontSize="xl" fontWeight="bold" color={result.is_correct ? "green.700" : "red.700"}>
                      {result.is_correct ? "🎉 正解やで！" : "😢 不正解やん！"}
                    </Text>
                    {!result.is_correct && (
                      <Text fontSize="md" mt="2" fontWeight="bold">
                        正解は「{result.correct_answer}」やで！
                      </Text>
                    )}
                  </Box>

                  <CustomButton
                    text="OK"
                    onClick={() => {
                      console.log("OKボタン押した");
                      navigate("/result");
                    }}
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
          </>
        ) : (
          <Text>問題を読み込んでいます...</Text>
        )}
      </VStack>
    </Box>
  );
};

export default Question;
