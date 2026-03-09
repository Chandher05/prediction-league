import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Select,
  TableContainer,
  Tag,
  Text,
  Container,
  Stack,
  HStack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import ViewPredictions from "./ViewPredictions";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ApiError, apiRequest } from "../../../api/client";

function PastGames() {
  const history = useHistory();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      setIsLoading(true);
      try {
        const completedGames = await apiRequest("/game/completed");
        let allTeamsFromResponse = new Set(["Show all"]);

        for (var game of completedGames) {
          allTeamsFromResponse.add(game.team1.fullName);
          allTeamsFromResponse.add(game.team2.fullName);
        }
        setAllTeams(Array.from(allTeamsFromResponse));
        setSelectedTeam("Show all");
        setGames(completedGames);
      } catch (error) {
        toast({
          title: "Could not load past games",
          description:
            error instanceof ApiError ? error.message : "Please try again.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    getGames();
  }, [toast]);

  const filteredGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    if (selectedTeam === "Show all") return games;
    return games.filter(
      (game) =>
        selectedTeam === game.team1.fullName ||
        selectedTeam === game.team2.fullName,
    );
  }, [games, selectedTeam]);

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
        <Stack spacing={{ base: 8, md: 10 }}>
          <Stack spacing={6}>
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
                  Past Games
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  Review completed fixtures and revisit predictions.
                </Text>
              </Stack>
            </HStack>
          </Stack>

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
                  <Th>Team 1</Th>
                  <Th>Team 2</Th>
                  <Th>Winner</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGames.length > 0 ? (
                  filteredGames
                    .map((game) => (
                      <Tr key={game.gameId || game.gameNumber}>
                        <Td fontWeight="semibold">{game.gameNumber}</Td>
                        <Td>{game.team1.fullName}</Td>
                        <Td>{game.team2.fullName}</Td>
                        <Td>
                          <Tag size="sm" colorScheme="green" variant="subtle">
                            {game.winner.fullName}
                          </Tag>
                        </Td>
                        <Td>
                          <ViewPredictions
                            gameId={game.gameId}
                            gameNumber={game.gameNumber}
                            team1Name={game.team1?.fullName}
                            team2Name={game.team2?.fullName}
                          ></ViewPredictions>
                        </Td>
                      </Tr>
                    ))
                    .reverse()
                ) : (
                  <Tr>
                    <Td colSpan={5}>
                      {isLoading ? "Loading games..." : "No games found"}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
}

export default PastGames;
