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
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";

function Leaderboard() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const getLeaderboard = () => {
    fetch(process.env.REACT_APP_API + "/prediction/leaderboard").then(
      async (response) => {
        if (response.ok) setGames(await response.json());
      }
    );
  };
  useEffect(() => {
    getLeaderboard();
  }, []);
  return (
    <Flex
      minH={"100vh"}
      
      justify={"center"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <VStack w="full" h="full"  p={4} spacing={10}>
        <HStack spacing={3} alignItems="justify-center">
          <Button
            colorScheme="orange"
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

        <Table variant="striped" colorScheme="orange" size="sm">
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
              return (
                <Tr>
                  <Td>{index + 1}</Td>
                  <Td>{row.username}</Td>
                  <Td>{row.score.toFixed(7)}</Td>
                  <Td>{row.freeHitsRemaining}</Td>
                  <Td>{row.leavesRemaining}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </VStack>
    </Flex>
  );
}

export default Leaderboard;
