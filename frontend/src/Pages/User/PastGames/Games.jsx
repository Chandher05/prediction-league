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
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Container,
  Stack,
  HStack,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import ViewPredictions from "./ViewPredictions";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

function PastGames() {
  const history = useHistory();
  const authId = useStoreState((state) => state.authId);
  const [games, setGames] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  useEffect(() => {
    const getGames = async () => {
      fetch(process.env.REACT_APP_API_BE + "/game/completed", {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          const completedGames = await response.json();

          let allTeamsFromResponse = new Set(["Show all"]);

          for (var game of completedGames) {
            allTeamsFromResponse.add(game.team1.fullName);
            allTeamsFromResponse.add(game.team2.fullName);
          }
          setAllTeams(Array.from(allTeamsFromResponse));
          setSelectedTeam("Show all");
          setGames(completedGames);
        }
      });
    };
    getGames();
  }, [authId]);

  const filteredGames = useMemo(() => {
    if (!games || games.length === 0) return [];
    if (selectedTeam === "Show all") return games;
    return games.filter(
      (game) =>
        selectedTeam === game.team1.fullName ||
        selectedTeam === game.team2.fullName
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
              <StatLabel>Completed Games</StatLabel>
              <StatNumber>{games.length}</StatNumber>
              <StatHelpText>All time</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Teams Filtered</StatLabel>
              <StatNumber>{filteredGames.length}</StatNumber>
              <StatHelpText>Currently shown</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Teams in List</StatLabel>
              <StatNumber>{Math.max(allTeams.length - 1, 0)}</StatNumber>
              <StatHelpText>Unique teams</StatHelpText>
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
                  <Th>Team 1</Th>
                  <Th>Team 2</Th>
                  <Th>Winner</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredGames
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
                        <ViewPredictions gameId={game.gameId}></ViewPredictions>
                      </Td>
                    </Tr>
                  ))
                  .reverse()}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
}

export default PastGames;
