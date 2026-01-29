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
  const pageBg = useColorModeValue("gray.50", "transparent");
  const backButtonColor = useColorModeValue("brand.600", "brand.200");
  const adminRowBg = useColorModeValue("brand.100", "whiteAlpha.300");
  const userRowBg = useColorModeValue("white", "whiteAlpha.100");
  const rowTextColor = useColorModeValue("gray.800", "whiteAlpha.900");
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
      bg={pageBg}
    >
      <VStack w="full" h="full" p={4} spacing={10}>
        <HStack spacing={3} alignItems="justify-center">
          <Button
            color={backButtonColor}
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
              <Th>IMP</Th>
              <Th>L</Th>
            </Tr>
          </Thead>
          <Tbody>
            {games.map((row, index) => {
              if ((showStrategies && row.isAdmin) || !row.isAdmin) {
                const rowBg = row.isAdmin ? adminRowBg : userRowBg;
                return (
                  <Tr bg={rowBg} color={rowTextColor}>
                    <Td>{row.position}</Td>
                    <Td>{row.username}</Td>
                    <Td>{row.score.toFixed(7)}</Td>
                    <Td>{row.freeHitsRemaining}</Td>
                    <Td>{row.impactRemaining}</Td>
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
