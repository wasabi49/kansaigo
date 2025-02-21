import { Box, Text } from "@yamada-ui/react";

const Card = ({ title, onClick }) => {
  return (
    <Box
      p="4"
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
      onClick={onClick}
      w="full"
      textAlign="center"
    >
      <Text fontSize="lg" fontWeight="bold">{title}</Text>
    </Box>
  );
};

export default Card;
