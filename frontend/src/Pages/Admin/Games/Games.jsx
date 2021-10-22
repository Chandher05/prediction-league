import { Heading, VStack, HStack } from "@chakra-ui/layout";
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
  useClipboard
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DateTime from "luxon/src/datetime";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";
import ViewPredictions from "../../../common/ViewPredictions";
import { CheckIcon, CopyIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

function Games() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const toast = useToast();

  const getGames = () => {
    fetch(process.env.REACT_APP_API + "/game/all").then(async (response) => {
      if (response.ok) setGames(await response.json());
    });
  };
  const delGame = (gameId) => {
    if (!gameId) return;
    fetch(`${process.env.REACT_APP_API}/game/delete/${gameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (response.ok) {
        toast({
          title: "Game Deleted.",
          description: "We've deleted the game for you.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    });
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
        <AddGameModal onCloseCall={getGames}></AddGameModal>
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
                <Td>{game.team1}</Td>
                <Td>{game.team2}</Td>
                <Td>
                  {DateTime.fromISO(game.startTime, { zone: "utc" })
                    .toLocal()
                    .toLocaleString(DateTime.DATETIME_SHORT)}
                </Td>
                <Td>{game.winner}</Td>
                <Td>
                  <CopyLink id={game.gameId}></CopyLink>
                  <ViewPredictions gameId={game.gameId}></ViewPredictions>
                  <UpdateGameModal game={game}></UpdateGameModal>

                  <Button size="sm" mx={1} onClick={() => delGame(game.gameId)}>
                    <DeleteIcon></DeleteIcon>
                  </Button>
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
    console.log(data);
    fetch(process.env.REACT_APP_API + "/game/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onClose();
    reset();
    onCloseCall();
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
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      // startTime: toDatetimeLocal(game.startTime) || '',
      ...game,
    },
  });
  const onSubmit = (data) => {
    fetch(process.env.REACT_APP_API + "/game/update", {
      method: "PUT", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
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
  const [value, ] = useState(
    `${process.env.REACT_APP_PUBLIC_URL}/predict/${id}`
  );
  const { hasCopied, onCopy } = useClipboard(value);

  return (
    <Button variant="ghost" onClick={onCopy} ml={2}>
      {hasCopied ? <CheckIcon></CheckIcon> : <CopyIcon></CopyIcon>}
    </Button>
  );
}
