import { ArrowBackIcon } from "@chakra-ui/icons";
import { Heading, VStack, HStack, Flex } from "@chakra-ui/layout";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  useColorModeValue,
  TableContainer,
  Tag,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { ApiError, apiRequest } from "../../../api/client";

function Predictions() {
  const history = useHistory();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllGames, setShowAllGames] = useState(false);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);

  const getPredictions = useCallback(() => {
    setIsLoading(true);
    apiRequest("/prediction/user")
      .then((result) => {
        setGames(result.predictions);
      })
      .catch((error) => {
        toast({
          title: "Something went wrong",
          description:
            error instanceof ApiError
              ? error.message
              : "Contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  useEffect(() => {
    getPredictions();
  }, [getPredictions]);

  const filteredGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    if (showAllGames) return games;
    return games.filter((game) => !game.gameStarted);
  }, [games, showAllGames]);

  const stats = useMemo(() => {
    const total = games?.length || 0;
    let correct = 0;
    let pending = 0;
    let predictedGames = 0;
    let leavesRemaining = 7;
    let freehitRemaining = 2;
    let totalConfidenceWhenCorrect = 0;
    let totalConfidenceWhenWrong = 0;
    for (const game of games || []) {
      if (!game.gameStarted) {
        pending += 1;
      } else if (game.predictedTeam?.shortName === game.winner?.shortName) {
        correct += 1;
        if (game.confidence == "FH") {
          totalConfidenceWhenCorrect += 100;
        } else {
          totalConfidenceWhenCorrect += Number(game.confidence);
        }
      } else {
        if (game.confidence == "FH") {
          totalConfidenceWhenWrong += 50;
        } else if (game.confidence != "L") {
          totalConfidenceWhenWrong += Number(game.confidence);
        }
      }

      if (game.confidence != "L") {
        predictedGames += 1;
      } else if (leavesRemaining > 0) {
        leavesRemaining -= 1;
      }
      if (game.confidence == "FH" && freehitRemaining > 0) {
        freehitRemaining -= 1;
      }
    }
    
    const totalOverallConfidence = totalConfidenceWhenCorrect + totalConfidenceWhenWrong;

    let avgConfidenceWhenCorrect = "N/A";
    let avgConfidenceWhenWrong = "N/A";
    let avgOverallConfidence = "N/A";
    let predictionAccuracy = "N/A";
    if (predictedGames > 0) {
      predictionAccuracy = ((correct / predictedGames) * 100).toFixed(2) + "%";
      avgOverallConfidence = (totalOverallConfidence / predictedGames).toFixed(2);
    }
    if (correct > 0) {
      avgConfidenceWhenCorrect = (totalConfidenceWhenCorrect / correct).toFixed(2);
    }
    if ((predictedGames - correct) > 0) {
      avgConfidenceWhenWrong = (totalConfidenceWhenWrong / (predictedGames - correct)).toFixed(2);
    }
    return { total, leavesRemaining, pending, predictedGames, predictionAccuracy, correct, avgConfidenceWhenCorrect, avgConfidenceWhenWrong, avgOverallConfidence, freehitRemaining };
  }, [games]);

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack
        w="full"
        h="full"
        p={{ base: 6, md: 10 }}
        spacing={8}
        alignItems="flex-start"
        maxW="1200px"
      >
        <HStack spacing={3} alignItems="center">
          <Button
            colorScheme="blue"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <VStack alignItems="flex-start" spacing={1}>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Your Predictions
            </Heading>
            <Text color={useColorModeValue("gray.600", "gray.300")}>
              Track your picks, confidence, and results in one place.
            </Text>
          </VStack>
        </HStack>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={4}
            w="full"
            p={4}
            bg={useColorModeValue("white", "gray.900")}
            borderRadius="xl"
            boxShadow="md"
          >
          <Stat>
            <StatLabel>Pending Games</StatLabel>
            <StatNumber>{stats.pending}</StatNumber>
            <StatHelpText>Not started yet</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Leaves Remaining</StatLabel>
            <StatNumber>{stats.leavesRemaining}</StatNumber>
            <StatHelpText>Games you can skip without affecting your score</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Free hits remaining</StatLabel>
            <StatNumber>{stats.freehitRemaining}</StatNumber>
            <StatHelpText>Number of free hits you can use</StatHelpText>
          </Stat>
        {showAdvancedStats && (
          <>
          <Stat>
            <StatLabel>Games Predicted</StatLabel>
            <StatNumber>{stats.predictedGames}</StatNumber>
            <StatHelpText>Total number of games you have made predictions for</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Prediction accuracy</StatLabel>
            <StatNumber>{stats.predictionAccuracy} ({stats.correct} out of {stats.predictedGames})</StatNumber>
            <StatHelpText>Your predictions that have been correct</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average confidence (Overall)</StatLabel>
            <StatNumber>{stats.avgOverallConfidence}</StatNumber>
            <StatHelpText>Average confidence level across all predictions</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average confidence (Correct)</StatLabel>
            <StatNumber>{stats.avgConfidenceWhenCorrect}</StatNumber>
            <StatHelpText>Average confidence level for predictions that were correct</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Average confidence (Wrong)</StatLabel>
            <StatNumber>{stats.avgConfidenceWhenWrong}</StatNumber>
            <StatHelpText>Average confidence level for predictions that were incorrect</StatHelpText>
          </Stat>
          </>
        )}
        </SimpleGrid>

        <HStack w="full" justify="space-between" spacing={4}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="blue"
            onClick={() => setShowAllGames((prev) => !prev)}
          >
            {showAllGames ? "Show Unfinished Only" : "Show All Games"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => setShowAdvancedStats((prev) => !prev)}
          >
            {showAdvancedStats ? "Hide advanced stats" : "Show advanced stats"}
          </Button>
          <Tag
            size="lg"
            borderRadius="full"
            colorScheme="blue"
            variant="subtle"
          >
            {filteredGames.length} shown
          </Tag>
        </HStack>

        <TableContainer
          w="full"
          bg={useColorModeValue("white", "gray.900")}
          borderRadius="xl"
          boxShadow="md"
          overflowX="auto"
        >
          <Table variant="simple" size="md">
            <Thead bg={useColorModeValue("gray.100", "gray.700")}>
              <Tr>
                <Th>No.</Th>
                <Th>Teams</Th>
                <Th>Confidence</Th>
                <Th>Predicted Team</Th>
                <Th>Actual Winner</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            {filteredGames.length > 0 ? (
              <Tbody>
                {filteredGames.map((game) => {
                  const isCorrect =
                    game.predictedTeam?.shortName ===
                    game.winner?.shortName;
                  return (
                    <Tr key={game.id || game.gameNumber}>
                      <Td fontWeight="semibold">{game.gameNumber}</Td>
                      <Td>{`${game.team1.shortName} vs ${game.team2.shortName}`}</Td>
                      <Td>
                        <Tag
                          size="sm"
                          colorScheme={game.isImpact ? "red" : "blue"}
                          variant="subtle"
                        >
                          {game.confidence}
                          {game.isImpact ? " • IMP" : ""}
                        </Tag>
                      </Td>
                      <Td>{game.predictedTeam?.shortName || "-"}</Td>
                      <Td>
                        <Tag
                          size="sm"
                          colorScheme={
                            !game.gameStarted
                              ? "gray"
                              : isCorrect
                              ? "green"
                              : "orange"
                          }
                          variant="subtle"
                        >
                          {game.winner?.shortName || "TBD"}
                        </Tag>
                      </Td>
                      <Td>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          variant={game.gameStarted ? "ghost" : "solid"}
                          isDisabled={game.gameStarted}
                          onClick={() =>
                            history.push({
                              pathname: `/predict/${game.id || game.gameId}`,
                              state: { returnTo: "/predictions" },
                            })
                          }
                        >
                          {game.gameStarted ? "Locked" : "Predict"}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            ) : (
              <Tbody>
                <Tr>
                  <Td colSpan={6}>
                    {isLoading ? "Loading predictions..." : "No predictions found"}
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </TableContainer>
      </VStack>
    </Flex>
  );
}

export default Predictions;
