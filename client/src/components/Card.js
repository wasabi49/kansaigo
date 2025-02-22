import { Box, Text } from "@yamada-ui/react";

const Card = ({ title }) => {
  return (
    <Box 
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      p="4"
      width="100%" 
      maxWidth={{ base: "600px", md: "90%" }} // PC: 600px, スマホ: 90%
      textAlign="center"
      mx="auto"
    >
      <Text fontSize="lg" fontWeight="bold">{title}</Text>
    </Box>
  );
};

export default Card;
