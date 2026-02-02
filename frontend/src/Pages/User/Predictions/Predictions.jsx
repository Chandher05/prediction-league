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
  Select,
  TableContainer,
  Tag,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
} from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";

function Predictions() {
  const history = useHistory();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const authId = useStoreState((state) => state.authId);

  const getPredictions = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_BE}/prediction/user`, {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        const result = await response.json();
        let allTeamsFromResponse = new Set(["Show all"]);

        for (var game of result.predictions) {
          allTeamsFromResponse.add(game.team1.fullName);
          allTeamsFromResponse.add(game.team2.fullName);
        }
        setAllTeams(Array.from(allTeamsFromResponse));
        setSelectedTeam("Show all");
        setGames(result.predictions);
      } else {
        toast({
          title: "Something went wrong",
          description: "Contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    });
  }, [authId, toast]);

  useEffect(() => {
    getPredictions();
  }, [getPredictions]);

  const filteredGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    if (selectedTeam === "Show all") return games;
    return games.filter(
      (game) =>
        selectedTeam === game.team1.fullName ||
        selectedTeam === game.team2.fullName
    );
  }, [games, selectedTeam]);

  const stats = useMemo(() => {
    const total = games?.length || 0;
    let correct = 0;
    let pending = 0;
    for (const game of games || []) {
      if (!game.gameStarted) {
        pending += 1;
      } else if (game.predictedTeam?.shortName === game.winner?.shortName) {
        correct += 1;
      }
    }
    return { total, correct, pending };
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
            <StatLabel>Total Predictions</StatLabel>
            <StatNumber>{stats.total}</StatNumber>
            <StatHelpText>All time</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Correct Picks</StatLabel>
            <StatNumber>{stats.correct}</StatNumber>
            <StatHelpText>Completed games</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Pending</StatLabel>
            <StatNumber>{stats.pending}</StatNumber>
            <StatHelpText>Not started yet</StatHelpText>
          </Stat>
        </SimpleGrid>

        <HStack w="full" justify="space-between" spacing={4}>
          <Box flex="1">
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              bg={useColorModeValue("white", "gray.900")}
              borderRadius="lg"
            >
              {allTeams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </Select>
          </Box>
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
                          onClick={() => history.push(`/predict/${game.id}`)}
                        >
                          {game.gameStarted ? "Locked" : "Predict"}
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            ) : null}
          </Table>
        </TableContainer>
      </VStack>
    </Flex>
  );
}

export default Predictions;
