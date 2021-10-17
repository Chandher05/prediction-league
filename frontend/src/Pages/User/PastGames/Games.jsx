import { Heading, VStack, HStack } from "@chakra-ui/layout";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DateTime from "luxon/src/datetime";
import { useHistory } from "react-router";
import ViewPredictions from "./ViewPredictions";

function PastGames() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const getGames = () => {
    fetch("http://declaregame.in:7500/game/completed").then(async (response) => {
      if (response.ok) setGames(await response.json());
    });
  };
  useEffect(() => {
    getGames();
  },[]);
  const navToUser = () => {
    history.push("/");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Games</Heading>
        <Button onClick={navToUser}>Home</Button>
      </HStack>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            {/* <Th>Start Time</Th> */}
            <Th>Winner</Th>
            <Th>Predictions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((game) => {
            return (
              <Tr>
                <Td>{game.gameNumber}</Td>
                <Td>{game.team1}</Td>
                <Td>{game.team2}</Td>
                {/* <Td>
                  {DateTime.fromISO(game.startTime, { zone: "utc" })
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                  {game.StartTime}
                </Td> */}
                <Td>{game.winner}</Td>
                <Td><ViewPredictions gameId={game.gameId}></ViewPredictions></Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>No.</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            {/* <Th>Start Time</Th> */}
            <Th>Winner</Th>
            <Th>Predictions</Th>
          </Tr>
        </Tfoot>
      </Table>
    </VStack>
  );
}

export default PastGames;
