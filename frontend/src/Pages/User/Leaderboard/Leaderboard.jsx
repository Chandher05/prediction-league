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
import { useHistory } from "react-router";

function Leaderboard() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const getLeaderboard = () => {
    fetch("http://localhost:8000/prediction/leaderboard").then(
      async (response) => {
        if (response.ok) setGames(await response.json());
      }
    );
  };
  useEffect(() => {
    getLeaderboard();
  });
  const navToUser = () => {
    history.push("/");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Leaderboard</Heading>
        <Button onClick={navToUser}>Home</Button>
      </HStack>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Score</Th>
            <Th>FH</Th>
            <Th>Leaves</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((row) => {
            return (
              <Tr>
                <Td>{row.username}</Td>
                <Td>{row.score}</Td>
                <Td>{row.freeHitsRemaining}</Td>
                <Td>{row.leavesRemaining}</Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>Name</Th>
            <Th>Score</Th>
            <Th>FH</Th>
            <Th>Leaves</Th>
          </Tr>
        </Tfoot>
      </Table>
    </VStack>
  );
}

export default Leaderboard;
