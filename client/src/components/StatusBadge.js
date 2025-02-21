import { Box, Text, HStack } from "@yamada-ui/react";

const StatusBadge = ({ imgSrc, count, bgColor, textColor }) => {
  return (
    <HStack 
      p="2"
      bg={bgColor || 'white'}
      color={textColor || 'black'}
      borderRadius="full"
      border="2px solid"
      borderColor="gray.300"
      spacing="2"
      align="center"
    >
      <img src={imgSrc} alt="status icon" style={{ width: '24px', height: '24px' }} />
      <Text fontSize="md" fontWeight="bold">{count}</Text>
    </HStack>
  );
};

const StatusBadges = () => {
  return (
    <HStack spacing="4">
      <StatusBadge 
        imgSrc="/path/to/cow-icon.png" 
        count={13} 
        bgColor="white" 
        textColor="black" 
      />
      <StatusBadge 
        imgSrc="/path/to/fire-icon.png" 
        count={169} 
        bgColor="orange.100" 
        textColor="orange.600" 
      />
      <StatusBadge 
        imgSrc="/path/to/heart-icon.png" 
        count={4} 
        bgColor="pink.100" 
        textColor="pink.600" 
      />
    </HStack>
  );
};

export default StatusBadges;
