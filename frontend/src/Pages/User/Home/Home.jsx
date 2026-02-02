import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  CalendarIcon,
  CheckCircleIcon,
  ChevronUpIcon,
  RepeatIcon,
  StarIcon,
} from "@chakra-ui/icons";
import { useHistory } from "react-router";
import { Illustration } from "./Illustration";
import Countdown from "./Countdown";

import { logout } from "../../../Firebase/config";
import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import { useStoreActions } from "easy-peasy";

import { useState } from "react";

export default function Home() {
  const [impact, setImpact] = useState(false);
  const [impactMessage, setImpactMessage] = useState("Impact window is closed");
  const authId = useStoreState((state) => state.authId);
  const userName = useStoreState((state) => state.userName);
  const photoURL = useStoreState((state) => state?.photoURL);
  const reset = useStoreActions((actions) => actions.reset);
  const history = useHistory();
  const heroHighlight = useColorModeValue("red.500", "orange.200");
  const primaryCtaBg = useColorModeValue("brand.600", "brand.300");
  const primaryCtaHover = useColorModeValue("brand.500", "brand.200");
  const surface = useColorModeValue("white", "surfaceMuted");
  const surfaceSubtle = useColorModeValue("brand.50", "whiteAlpha.200");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.600", "whiteAlpha.700");
  const accent = useColorModeValue("brand.600", "brand.200");
  const quickActions = [
    {
      key: "leaderboard",
      title: "Leaderboard",
      description: "See how your predictions stack up after every match.",
      cta: "View leaderboard",
      icon: ChevronUpIcon,
      action: () => navTo("leaderboard"),
    },
    {
      key: "predictions",
      title: "Your Predictions",
      description: "Review or tweak the picks you've already submitted.",
      cta: "Open predictions",
      icon: CheckCircleIcon,
      action: () => navTo("predictions"),
    },
    {
      key: "past",
      title: "Past Games",
      description: "Look back at finished fixtures and outcomes.",
      cta: "Browse games",
      icon: CalendarIcon,
      action: () => navTo("PastGames"),
    },
    {
      key: "halloffame",
      title: "Hall of Fame",
      description: "Celebrate legendary streaks from the community.",
      cta: "See legends",
      icon: StarIcon,
      action: () => navTo("halloffame"),
    },
  ];
  const navTo = (route) => {
    history.push(`/${route}`);
  };

  useEffect(() => {
    const checkImpact = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BE}/game/impact/active`,
          {
            headers: {
              Authorization: `Bearer ${authId}`,
            },
          },
        );
        if (res.status === 200) {
          setImpact(true);
          setImpactMessage("Impact window is open");
          return;
        }
        const message = await res.text();
        setImpact(false);
        setImpactMessage(message || "Impact window is closed");
      } catch (err) {
        setImpact(false);
        setImpactMessage("Impact availability could not be checked");
      }
    };
    checkImpact();
  }, [authId]);

  function handleLogout() {
    reset();
    logout(history);
  }

  return (
    <Container maxW={"6xl"} px={{ base: 4, md: 8 }} py={{ base: 8, md: 16 }}>
      <Stack spacing={{ base: 8, md: 16 }}>
        <Flex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="center"
          gap={{ base: 8, lg: 16 }}
        >
          <Stack
            flex="1"
            spacing={{ base: 5, md: 6 }}
            p={{ base: 2 }}
            textAlign="center"
            align="center"
          >
            <Tag
              w={{ base: "fit-content", lg: "auto" }}
              alignSelf="center"
              size="lg"
              colorScheme="brand"
              variant="subtle"
            >
              Season {new Date().getFullYear()}
            </Tag>
            <Heading
              fontWeight={700}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              lineHeight={"120%"}
              className="neon"
            >
              T20 Prediction League
              <br />
              <Text as="span" color={heroHighlight} fontSize={{ base: "xl" }}>
                Fortune favours the brave
              </Text>
            </Heading>
            <Text color={mutedText} fontSize={{ base: "md", md: "lg" }}>
              Lock in your picks before the first ball, chase the leaderboard,
              and earn bragging rights all season long.
            </Text>
            {impact && (
              <Tag
                colorScheme="green"
                size="lg"
                variant="subtle"
                alignSelf="center"
              >
                Impact window is open
              </Tag>
            )}
            <Stack
              direction="column"
              spacing={{ base: 3, md: 4 }}
              justify="center"
              align="stretch"
              w="full"
              pb={{ base: 4, md: 0 }}
              pt={{ base: 2, md: 0 }}
              px={{ base: 4, md: 0 }}
            >
              <Button
                px={{ base: 6, md: 8 }}
                colorScheme="brand"
                bg={primaryCtaBg}
                _hover={{ bg: primaryCtaHover }}
                onClick={() => navTo("predict")}
                size="lg"
                w="full"
              >
                Predict next game
              </Button>
              <Button
                px={{ base: 6, md: 8 }}
                variant="outline"
                colorScheme="brand"
                borderColor={surfaceSubtle}
                onClick={() => navTo("predictions")}
                size="lg"
                w="full"
              >
                Review picks
              </Button>
              <Tooltip
                label={
                  impact
                    ? "You can change your impact prediction now."
                    : impactMessage
                }
                placement="top"
                hasArrow
              >
                <Box w="full">
                  <Button
                    leftIcon={<RepeatIcon />}
                    colorScheme={impact ? "brand" : "gray"}
                    variant="outline"
                    px={{ base: 6, md: 8 }}
                    onClick={() => navTo("impact")}
                    w="full"
                    size="lg"
                    isDisabled={!impact}
                  >
                    Edit impact pick
                  </Button>
                </Box>
              </Tooltip>
            </Stack>
          </Stack>
          <Stack flex="1" w="full" p={{ base: 2 }} align="center">
            <Box
              bg={surface}
              borderWidth="1px"
              borderColor={borderColor}
              rounded="3xl"
              p={{ base: 5, md: 8 }}
              position="relative"
              overflow="hidden"
              boxShadow="2xl"
            >
              <Stack spacing={3} position="relative" zIndex={1}>
                <HStack justify="space-between">
                  <Text fontWeight="semibold" color={mutedText}>
                    Next match countdown
                  </Text>
                  <Tag colorScheme="brand" variant="subtle">
                    Live
                  </Tag>
                </HStack>
                <Text fontWeight="bold" fontSize="xl">
                  Stay ahead of the toss
                </Text>
                <Text color={mutedText} fontSize="sm">
                  Predictions lock a few minutes before the first ball.
                </Text>
                <Countdown
                  impactAvailable={impact}
                  impactMessage={impactMessage}
                />
              </Stack>
              <Box
                position="absolute"
                inset={{ base: "auto", md: "auto -50px -160px" }}
                opacity={{ base: 0.05, md: 0.2 }}
                pointerEvents="none"
                display={{ base: "none", md: "block" }}
              >
                <Illustration />
              </Box>
            </Box>
          </Stack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
          {quickActions.map((card) => (
            <Box
              key={card.key}
              bg={surface}
              borderWidth="1px"
              borderColor={borderColor}
              rounded="2xl"
              p={{ base: 4, md: 6 }}
              boxShadow="xl"
              h="full"
            >
              <Stack spacing={4} h="full">
                <HStack spacing={4} align="center">
                  <Box p={3} rounded="full" bg={surfaceSubtle} color={accent}>
                    <Icon as={card.icon} boxSize={5} />
                  </Box>
                  <Heading size="md">{card.title}</Heading>
                </HStack>
                <Text color={mutedText} flex={1}>
                  {card.description}
                </Text>
                <Button
                  variant="ghost"
                  colorScheme="brand"
                  onClick={card.action}
                  alignSelf={{ base: "stretch", sm: "flex-start" }}
                  w={{ base: "full", sm: "auto" }}
                >
                  {card.cta}
                </Button>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>

        <Box
          bg={surface}
          borderWidth="1px"
          borderColor={borderColor}
          rounded="2xl"
          p={{ base: 4, md: 6 }}
          boxShadow="xl"
        >
          <Flex
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "center" }}
            justify="space-between"
            gap={6}
          >
            <HStack spacing={4} align="center">
              <Avatar name={userName} src={photoURL} size="lg" />
              <Box>
                <Text color={mutedText} fontSize="sm">
                  Welcome back
                </Text>
                <Heading size="md">{userName || "Predictor"}</Heading>
              </Box>
            </HStack>
            <Button
              colorScheme="red"
              onClick={handleLogout}
              alignSelf={{ base: "stretch", sm: "flex-end" }}
              w={{ base: "full", sm: "auto" }}
            >
              Log out
            </Button>
          </Flex>
        </Box>
      </Stack>
    </Container>
  );
}
