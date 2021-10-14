import { Heading, VStack, HStack } from "@chakra-ui/layout";
import { useForm } from "react-hook-form";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  FormLabel,
  FormControl,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DateTime from "luxon/src/datetime";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";

function Games() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const toast = useToast();

  const getGames = () => {
    fetch("http://localhost:8000/game/all").then(async (response) => {
      if (response.ok) setGames(await response.json());
    });
  };
  const delGame = (gameId) => {
    if (!gameId) return;
    fetch(`http://localhost:8000/game/delete/${gameId}`).then(
      async (response) => {
        if (response.ok) {
          toast({
            title: "Game Deleted.",
            description: "We've deleted the game for you.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    );
  };
  useEffect(() => {
    getGames();
  }, []);
  const navToUser = () => {
    history.push("/admin/Users");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Games</Heading>
        <AddGameModal></AddGameModal>
        <Button onClick={navToUser}>Users Table</Button>
      </HStack>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            <Th>Start Time</Th>
            <Th>Winner</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {games.map((game) => {
            return (
              <Tr>
                <Td>{game.gameNumber}</Td>
                <Td>{game.team1}</Td>
                <Td>{game.team2}</Td>
                <Td>
                  {DateTime.fromISO(game.startTime, { zone: "utc" })
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                  {game.StartTime}
                </Td>
                <Td>{game.winner}</Td>
                <Td>
                  <ViewPredictions gameId={game.gameId}></ViewPredictions>
                  <Button mx={1}>Update</Button>
                  <Button mx={1} onClick={() => delGame(game.gameId)}>
                    Del
                  </Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>No.</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            <Th>Start Time</Th>
            <Th>Winner</Th>
            <Th>Actions</Th>
          </Tr>
        </Tfoot>
      </Table>
    </VStack>
  );
}

export default Games;

function AddGameModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    fetch("http://localhost:8000/game/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onClose();
  };
  return (
    <>
      <Button onClick={onOpen}>Add Game</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Create Game</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Game Number</FormLabel>
                <Input placeholder="No." {...register("gameNumber")} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Team 1</FormLabel>
                <Input placeholder="RCB" {...register("team1")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Team 2</FormLabel>
                <Input placeholder="DC" {...register("team2")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Start Time</FormLabel>
                <Input type="datetime-local" {...register("startTime")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Winner</FormLabel>
                <Input placeholder="" {...register("winner")} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function ViewPredictions({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!gameId || !isOpen) return;
    fetch(`http://localhost:8000/prediction/game/${gameId}`).then(
      async (response) => {
        if (response.ok) setPredictions(await response.json());
      }
    );
  }, [gameId, isOpen]);

  return (
    <>
      <Button onClick={onOpen}>View</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Predictions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>user id</Th>
                  <Th>username</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Thead>
              <Tbody>
                {predictions.map((record) => {
                  return (
                    <Tr>
                      <Td>{record.userId}</Td>
                      <Td>{record.username}</Td>
                      <Td>
                        {" "}
                        {record.prediction.map((rec) => (
                          <p>{`${rec.predictedTeam} - ${rec.confidence} - ${
                            rec.considered ? "Yes" : "No"
                          }`}</p>
                        ))}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>user id</Th>
                  <Th>username</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Tfoot>
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function UpdateGameModal({}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    fetch("http://localhost:8000/game/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onClose();
  };
  return (
    <>
      <Button onClick={onOpen}>Add Game</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Update Game</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Game Number</FormLabel>
                <Input placeholder="No." {...register("gameNumber")} />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Team 1</FormLabel>
                <Input placeholder="RCB" {...register("team1")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Team 2</FormLabel>
                <Input placeholder="DC" {...register("team2")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Start Time</FormLabel>
                <Input type="datetime-local" {...register("startTime")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Winner</FormLabel>
                <Input placeholder="" {...register("winner")} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
