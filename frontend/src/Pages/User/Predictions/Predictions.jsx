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
  Input,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useHistory } from "react-router";

function Predictions() {
  const history = useHistory();
  const toast = useToast();
  const [games, setGames] = useState([]);
  const inputRef = useRef();
  const getPredictions = () => {
    const userCode = inputRef.current.value;
    if(userCode) {
      fetch(`http://declaregame.in:7500/prediction/user/${userCode}`).then(async (response) => {
        if (response.ok) {
          const result = await response.json()
          setGames(result.predictions)
        } else {
          toast({
            title: "Please check your unique code and try again",
            description: "Contact us for help if the issue persists.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      });
    }
  };
  const navToUser = () => {
    history.push("/");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Predictions</Heading>
        <Button onClick={navToUser}>Home</Button>
      </HStack>

      <HStack spacing={3} alignItems="justify-center">
        <Input border="solid"  ref={inputRef} ></Input>
        <Button onClick={getPredictions} colorScheme="orange">Get</Button>
      </HStack>

      {games && games.length > 0? 

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Teams</Th>
            <Th>Confidence</Th>
            <Th>Predicted Team</Th>
            <Th>Actual Winner</Th>
          </Tr>
        </Thead>
        <Tbody>
          {  games.map((game) => {
            return (
              <Tr id={game.gameNumber}>
                <Td>{game.gameNumber}</Td>
                <Td>{game.teams}</Td>
                <Td>{game.confidence}</Td>
                <Td>{game.predictedTeam}</Td>
                <Td>{game.winner}</Td>
              </Tr>
            )
          })
        } 
        </Tbody>
      </Table>
      : null }
    </VStack>
  );
}

export default Predictions;
