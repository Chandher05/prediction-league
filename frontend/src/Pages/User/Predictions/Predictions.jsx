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
  Input,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router";

function Predictions() {
  const history = useHistory();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const inputRef = useRef();

  const getPredictions = () => {
    fetch(`${process.env.REACT_APP_API}/prediction/user`).then(
      async (response) => {
        if (response.ok) {
          const result = await response.json();
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
      }
    );
  };

  useEffect(() => {
    getPredictions();
  }, []);

  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
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
            Your Predictions
          </Heading>
        </HStack>


        <Table variant="striped" colorScheme="orange" size="sm">
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
                return (
                  <Tr id={game.gameNumber}>
                    <Td>{game.gameNumber}</Td>
                    <Td>{`${game.team1.shortName} vs ${game.team2.shortName}`}</Td>
                    <Td>{game.confidence}</Td>
                    <Td>{game.predictedTeam.shortName}</Td>
                    <Td>{game.winner.shortName}</Td>
                  </Tr>
                );
              })}
            </Tbody>
          ) : null}
        </Table>

      </VStack>
    </Flex>
  );
}

export default Predictions;
