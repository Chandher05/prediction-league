import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useHistory } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import FameCard from "./FameCard";

function HallOfFame() {
  const history = useHistory();
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const surface = useColorModeValue("white", "surfaceMuted");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.600", "gray.300");
  const getWinners = [
    {
      winners: ["🥇Gurumoorthy Baskar", "🥈Abhishek Gupta", "🥉Barath C"],
      year: "2026",
      event: "T20 World Cup",
    },
    {
      winners: ["🥇Chandher Shekar", "🥈Jayasurya Pinaki", "🥉Abhishek Gupta"],
      year: "2025",
      event: "IPL",
    },
    {
      winners: ["🥇Himavarshith", "🥈Jayasurya Pinaki", "🥉Gurumoorthy Baskar"],
      year: "2024",
      event: "IPL",
    },
    {
      winners: ["🥇Barath C", "🥈Harikumar Shastry", "🥉Aditya Ranjan"],
      year: "2023",
      event: "Cricket World Cup",
    },
    {
      winners: ["🥇Prajwal Prasad", "🥈Barath C", "🥉Jayasurya P"],
      year: "2023",
      event: "IPL",
    },
    {
      winners: ["🥇Sujith R", "🥈Chandher Shekar", "🥉Abhishek Gupta"],
      year: "2023",
      event: "WPL",
    },
    {
      winners: ["🥇KAUSHAL DONGRE", "🥈Jayasurya Pinaki", "🥉Barath C"],
      year: "2022",
      event: "IPL",
    },
    {
      winners: ["🥇Sujith", "🥈Abhishek Gupta", "🥉Barath C"],
      year: "2021",
      event: "T20 World Cup",
    },
    {
      winners: ["🥇Abhishek Gupta"],
      year: "2021",
      event: "IPL",
    },
  ];
  return (
    <Box minH="100vh" bg={pageBg}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
        <Stack spacing={{ base: 8, md: 10 }}>
          <Stack
            spacing={6}
            bg={surface}
            borderWidth="1px"
            borderColor={borderColor}
            rounded="3xl"
            p={{ base: 6, md: 8 }}
            boxShadow="2xl"
          >
            <HStack spacing={3} alignItems="center">
              <Button
                colorScheme="brand"
                borderRadius="10px"
                size="sm"
                variant="outline"
                onClick={() => history.push("/")}
              >
                <ArrowBackIcon></ArrowBackIcon>
              </Button>
              <Stack spacing={1}>
                <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                  Hall Of Fame
                </Heading>
                <Text color={mutedText}>
                  Historic winners and podium finishes from past tournaments.
                </Text>
              </Stack>
            </HStack>
          </Stack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {getWinners.map(({ winners, year, event }) => (
              <FameCard
                key={`${event}-${year}`}
                winners={winners}
                year={year}
                event={event}
              ></FameCard>
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
}

export default HallOfFame;
