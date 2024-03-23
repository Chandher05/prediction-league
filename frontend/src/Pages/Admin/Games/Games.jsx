import { Heading, VStack, HStack, Text } from "@chakra-ui/layout";
import { useForm } from "react-hook-form";

import {
  Table,
  Thead,
  Tbody,
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
  useClipboard,
  Select,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import DateTime from "luxon/src/datetime";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";
import ViewPredictions from "../../../common/ViewPredictions";
import { CheckIcon, CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

function Games() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const authId = useStoreState((state) => state.authId);

  const getGames = useCallback(() => {
    fetch(process.env.REACT_APP_API_BE + "/game/all", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setGames(await response.json());
    });
  }, [authId]);

  useEffect(() => {
    getGames();
  }, [getGames]);
  const navToUser = () => {
    history.push("/admin/Users");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Games</Heading>
        <AddGameModal onCloseCall={getGames}></AddGameModal>
        <Button onClick={getGames}>Refresh</Button>
        <Button onClick={navToUser}>Users Table</Button>
      </HStack>

      <Table variant="striped" size="small" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>id</Th>
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
              <Tr key={game.gameNumber}>
                <Td>{game.gameNumber}</Td>
                <Td>{game.gameId}</Td>
                <Td>{game.team1.fullName}</Td>
                <Td>{game.team2.fullName}</Td>
                <Td>
                  {DateTime.fromISO(game.startTime, { zone: "utc" })
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                </Td>
                <Td>{game.winner.fullName}</Td>
                <Td>
                  <CopyLink id={game.gameId}></CopyLink>
                  <ViewPredictions gameId={game.gameId}></ViewPredictions>
                  <UpdateGameModal game={game}></UpdateGameModal>

                  <DeleteConfirmModal gameId={game.gameId}></DeleteConfirmModal>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default Games;

function AddGameModal({ onCloseCall }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    console.log({ data });
    fetch(process.env.REACT_APP_API_BE + "/game/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      reset();
      onCloseCall();
    });
    onClose();
  };
  return (
    <>
      <Button colorScheme="teal" mx onClick={onOpen}>
        Add Game
      </Button>
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
                <Input type="datetime" {...register("startTime")} />
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

// function toDatetimeLocal(d) {
//   const date = d;
//   const ten = function (i) {
//     return (i < 10 ? "0" : "") + i;
//   };
//   const YYYY = date.getFullYear();
//   const MM = ten(date.getMonth() + 1);
//   const DD = ten(date.getDate());
//   const HH = ten(date.getHours());
//   const II = ten(date.getMinutes());
//   const SS = ten(date.getSeconds());
//   return YYYY + "-" + MM + "-" + DD + "T" + HH + ":" + II + ":" + SS;
// }

function UpdateGameModal({ game }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const authId = useStoreState((state) => state.authId);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      // startTime: toDatetimeLocal(game.startTime) || '',
      gameId: game.gameId,
      toss: game?.toss?._id,
      battingFirst: game?.battingFirst?._id,
      winner: game?.winner?._id,
      gameNumber: game.gameNumber,
      team1: game.team1?._id,
      team2: game.team2?._id,
      startTime: new Date(game?.startTime),
    },
  });
  const onSubmit = (data) => {
    fetch(process.env.REACT_APP_API_BE + "/game/update", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data),
    });
    onClose();
    reset();
  };
  return (
    <>
      <Button size="sm" mx="1" onClick={onOpen}>
        <EditIcon></EditIcon>
      </Button>
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

              {/* <FormControl mt={4}>
                <FormLabel>Team 1</FormLabel>
                <Input placeholder="Team 1" {...register("team1.fullName")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Team 2</FormLabel>
                <Input placeholder="Team 2" {...register("team2.fullName")} />
              </FormControl>*/}
              <FormControl mt={4}>
                <FormLabel>Start Time</FormLabel>
                <Input type="datetime-local" {...register("startTime")} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Winner</FormLabel>
                <Select {...register("winner")}>
                  <option value={null}></option>
                  <option value={game.team1._id}>{game.team1.fullName}</option>
                  <option value={game.team2._id}>{game.team2.fullName}</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Toss</FormLabel>
                <Select {...register("toss")}>
                  <option value={null}></option>
                  <option value={game.team1._id}>{game.team1.fullName}</option>
                  <option value={game.team2._id}>{game.team2.fullName}</option>
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Batting First</FormLabel>
                <Select {...register("battingFirst")}>
                  <option value={null}></option>
                  <option value={game.team1._id}>{game.team1.fullName}</option>
                  <option value={game.team2._id}>{game.team2.fullName}</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Update
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

function CopyLink({ id }) {
  const [value] = useState(`${process.env.REACT_APP_PUBLIC_URL}/predict/${id}`);
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Button variant="ghost" onClick={onCopy} ml={2}>
      {hasCopied ? <CheckIcon></CheckIcon> : <CopyIcon></CopyIcon>}
    </Button>
  );
}

function DeleteConfirmModal({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const delGame = () => {
    if (!gameId) return;
    fetch(`${process.env.REACT_APP_API_BE}/game/delete/${gameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        toast({
          title: "Game Deleted.",
          description: "Game has been deleted",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }
    });
  };
  return (
    <>
      <Button size="sm" mx="1" onClick={onOpen}>
        <DeleteIcon></DeleteIcon>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red">Delete Game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="xl">
              Are you sure you want to delete this game?
            </Text>
            <Text color="red" fontSize="sm">
              Note: This is not reversible
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={delGame}>
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
