import {
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  HStack,
  Tag,
  Box,
} from "@chakra-ui/react";

export default function FameCard({ event, winners, year }) {
  const cardBg = useColorModeValue("white", "surfaceMuted");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.600", "gray.300");
  const highlight = useColorModeValue("brand.600", "brand.200");
  return (
    <Center>
      <Stack
        borderWidth="1px"
        borderRadius="2xl"
        w="full"
        minH={{ base: "auto", md: "16rem" }}
        direction="column"
        bg={cardBg}
        borderColor={borderColor}
        boxShadow="xl"
        p={{ base: 5, md: 6 }}
        spacing={4}
      >
        <HStack justify="space-between" w="full">
          <Box>
            <Text fontSize="xs" color={mutedText} letterSpacing="0.08em">
              SEASON
            </Text>
            <Heading size="md">{year}</Heading>
          </Box>
          <Tag size="md" colorScheme="brand" variant="subtle">
            {event}
          </Tag>
        </HStack>
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          bg={useColorModeValue("gray.50", "whiteAlpha.100")}
          borderRadius="xl"
          p={{ base: 4, md: 5 }}
          spacing={2}
        >
          {winners.map((winner) => {
            return (
              <Heading
                key={`${event}-${year}-${winner}`}
                fontSize={{ base: "lg", md: "xl" }}
                fontFamily={"body"}
                color={highlight}
              >
                {winner}
              </Heading>
            );
          })}
          <Text color={mutedText} fontSize="sm">
            Podium finishers for this tournament.
          </Text>
        </Stack>
      </Stack>
    </Center>
  );
}
