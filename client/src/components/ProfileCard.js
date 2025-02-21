import { Box, Text, Image, VStack } from "@yamada-ui/react";

const ProfileCard = ({ image, name, level, points }) => {
  return (
    <Box
      p="4"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      width="100%"
      maxWidth="320px"
      textAlign="center"
    >
      {/* ユーザー画像 */}
      <Image
        borderRadius="full"
        boxSize="100px"
        src={image}
        alt={name}
        mx="auto"
      />
      
      {/* ユーザー名 */}
      <Text fontSize="xl" fontWeight="bold" mt="4">{name}</Text>
      
      {/* ユーザーのレベルとポイント */}
      <VStack mt="2" spacing="1">
        <Text fontSize="md" color="gray.500">レベル: {level}</Text>
        <Text fontSize="md" color="gray.500">ポイント: {points}</Text>
      </VStack>
    </Box>
  );
};

export default ProfileCard;
