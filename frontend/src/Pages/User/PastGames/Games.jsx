import { Heading, VStack, HStack, Flex } from "@chakra-ui/layout";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
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
  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <VStack
        spacing={4}
        w={"full"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <HStack>
          <Button
            colorScheme="blue"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Games
          </Heading>
        </HStack>

        <Select
          selected={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          {allTeams.map((team) => {
            return <option value={team}>{team}</option>;
          })}
        </Select>

        <Table variant="striped" colorScheme="blue" size="sm">
          <Thead>
            <Tr>
              <Th>No.</Th>
              <Th>Team 1</Th>
              <Th>Team 2</Th>
              {/* <Th>Start Time</Th> */}
              <Th>Winner</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {games
              .map((game, index) => {
                if (
                  selectedTeam === "Show all" ||
                  selectedTeam === game.team1.fullName ||
                  selectedTeam === game.team2.fullName
                ) {
                  return (
                    <Tr key={index}>
                      <Td>{game.gameNumber}</Td>
                      <Td>{game.team1.fullName}</Td>
                      <Td>{game.team2.fullName}</Td>
                      {/* <Td>
                  {DateTime.fromISO(game.startTime, { zone: "utc" })
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                  {game.StartTime}
                </Td> */}
                      <Td>{game.winner.fullName}</Td>
                      <Td>
                        <ViewPredictions gameId={game.gameId}></ViewPredictions>
                      </Td>
                    </Tr>
                  );
                } else {
                  return null;
                }
              })

              .reverse()}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
}

export default PastGames;
