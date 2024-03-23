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
} from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";
import { useCallback, useEffect, useState } from "react";
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

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
        <HStack spacing={3} alignItems="justify-center">
          <Button
            colorScheme="blue"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Your Predictions
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
              <Th>Teams</Th>
              <Th>Confidence</Th>
              <Th>Predicted Team</Th>
              <Th>Actual Winner</Th>
            </Tr>
          </Thead>
          {games && games.length > 0 ? (
            <Tbody>
              {games.map((game) => {
                if (
                  selectedTeam === "Show all" ||
                  selectedTeam === game.team1.fullName ||
                  selectedTeam === game.team2.fullName
                ) {
                  return (
                    <Tr id={game.gameNumber}>
                      <Td>{game.gameNumber}</Td>
                      <Td>{`${game.team1.shortName} vs ${game.team2.shortName}`}</Td>
                      <Td>{game.confidence}</Td>
                      <Td>{game.predictedTeam.shortName}</Td>
                      <Td>{game.winner.shortName}</Td>
                    </Tr>
                  );
                } else return <div>Not Found</div>;
              })}
            </Tbody>
          ) : null}
        </Table>
      </VStack>
    </Flex>
  );
}

export default Predictions;
