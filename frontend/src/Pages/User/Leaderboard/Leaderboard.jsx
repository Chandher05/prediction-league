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
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

function Leaderboard() {
  const history = useHistory();
  const authId = useStoreState((state) => state.authId);

  const [games, setGames] = useState([]);
  const [showStrategies, setShowStrategies] = useState(false);
  const getLeaderboard = useCallback(() => {
    fetch(process.env.REACT_APP_API_BE + "/prediction/leaderboard", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setGames(await response.json());
    });
  }, [authId]);
  useEffect(() => {
    getLeaderboard();
  }, [getLeaderboard]);
  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <VStack w="full" h="full" p={4} spacing={10}>
        <HStack spacing={3} alignItems="justify-center">
          <Button
            color="blue.300"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Leaderboard
          </Heading>
        </HStack>

        <Button onClick={() => setShowStrategies(!showStrategies)}>
          {showStrategies ? "Hide Strategies" : "Show Strategies"}
        </Button>

        <Table size="sm">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Score</Th>
              <Th>FH</Th>
              <Th>L</Th>
            </Tr>
          </Thead>
          <Tbody>
            {games.map((row, index) => {
              if ((showStrategies && row.isAdmin) || !row.isAdmin) {
                return (
                  <Tr backgroundColor={row.isAdmin ? "blue.400" : "blue.200"}>
                    <Td>{row.position}</Td>
                    <Td>{row.username}</Td>
                    <Td>{row.score.toFixed(7)}</Td>
                    <Td>{row.freeHitsRemaining}</Td>
                    <Td>{row.leavesRemaining}</Td>
                  </Tr>
                );
              } else {
                return null;
              }
            })}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
}

export default Leaderboard;
