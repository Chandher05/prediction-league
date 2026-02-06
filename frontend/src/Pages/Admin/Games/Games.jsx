import { Heading, VStack, HStack, Text } from "@chakra-ui/layout";
import { useForm } from "react-hook-form";

import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  useColorModeValue,
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
  TableContainer,
  Container,
  Tag,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import DateTime from "luxon/src/datetime";
import { useHistory } from "react-router";
import { useToast } from "@chakra-ui/react";
import ViewPredictions from "../../../common/ViewPredictions";
import { CheckIcon, CopyIcon, DeleteIcon, EditIcon, RepeatIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

function Games() {
  const history = useHistory();
  const [games, setGames] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
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

  const getTeams = useCallback(() => {
    fetch(process.env.REACT_APP_API_BE + "/teams/all", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setTeams(await response.json());
    });
  }, [authId]);

  const getUsers = useCallback(() => {
    fetch(process.env.REACT_APP_API_BE + "/users/all", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setUsers(await response.json());
    });
  }, [authId]);

  useEffect(() => {
    getGames();
  }, [getGames]);

  useEffect(() => {
    getTeams();
  }, [getTeams]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const navToUser = () => {
    history.push("/admin/Users");
  };
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 10 }}>
        <VStack w="full" spacing={6} alignItems="flex-start">
          <HStack
            w="full"
            spacing={3}
            justify="space-between"
            flexWrap="wrap"
            alignItems="center"
          >
            <Heading size="2xl">Games</Heading>
            <HStack spacing={2} flexWrap="wrap">
              <AddGameModal onCloseCall={getGames} teams={teams}></AddGameModal>
              <Button onClick={getGames}>Refresh</Button>
              <Button onClick={navToUser}>Users Table</Button>
              <AddPredictionModal
                users={users}
                games={games}
                teams={teams}
              ></AddPredictionModal>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
            <Stat bg={useColorModeValue("white", "gray.900")} p={4} borderRadius="xl" boxShadow="md">
              <StatLabel>Total Games</StatLabel>
              <StatNumber>{games.length}</StatNumber>
              <StatHelpText>All fixtures</StatHelpText>
            </Stat>
            <Stat bg={useColorModeValue("white", "gray.900")} p={4} borderRadius="xl" boxShadow="md">
              <StatLabel>Teams</StatLabel>
              <StatNumber>{teams.length}</StatNumber>
              <StatHelpText>Available teams</StatHelpText>
            </Stat>
            <Stat bg={useColorModeValue("white", "gray.900")} p={4} borderRadius="xl" boxShadow="md">
              <StatLabel>Users</StatLabel>
              <StatNumber>{users.length}</StatNumber>
              <StatHelpText>Registered users</StatHelpText>
            </Stat>
          </SimpleGrid>

          <TableContainer
            w="full"
            bg={useColorModeValue("white", "gray.900")}
            borderRadius="xl"
            boxShadow="md"
            overflowX="auto"
          >
            <Table variant="simple" size="sm">
              <Thead bg={useColorModeValue("gray.100", "gray.700")}>
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
                    <Tr key={game.gameId || game.gameNumber}>
                      <Td fontWeight="semibold">{game.gameNumber}</Td>
                      <Td>{game.team1.fullName}</Td>
                      <Td>{game.team2.fullName}</Td>
                      <Td>
                        {DateTime.fromISO(game.startTime, { zone: "utc" })
                          .toLocal()
                          .toLocaleString(DateTime.DATETIME_SHORT)}
                      </Td>
                      <Td>
                        <Tag size="sm" colorScheme="green" variant="subtle">
                          {game.winner.fullName}
                        </Tag>
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <AutoUpdateWinner gameId={game.gameId}></AutoUpdateWinner>
                          <UpdateGameModal game={game}></UpdateGameModal>
                          <ViewPredictions gameId={game.gameId}></ViewPredictions>
                          <CopyLink id={game.gameId}></CopyLink>
                          <DeleteConfirmModal gameId={game.gameId}></DeleteConfirmModal>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      </Container>
    </Box>
  );
}

export default Games;

function AddGameModal({ onCloseCall, teams }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();

  const authId = useStoreState((state) => state.authId);
  const onSubmit = (data) => {
    fetch(process.env.REACT_APP_API_BE + "/game/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
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
                <Select {...register("team1")}>
                  <option value={null}></option>
                  {teams.map((team) => {
                    return <option value={team.teamId}>{team.fullName}</option>
                  })}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Team 2</FormLabel>
                <Select {...register("team2")}>
                  <option value={null}></option>
                  {teams.map((team) => {
                    return <option value={team.teamId}>{team.fullName}</option>
                  })}
                </Select>
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
      startTime: game?.startTime,
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
                <Input placeholder="Start Time" {...register("startTime")} />
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

function AutoUpdateWinner({ gameId }) {
  const { onClose } = useDisclosure();
  const toast = useToast();

  const authId = useStoreState((state) => state.authId);

  const updateWinner = () => {
    if (!gameId) return;
    fetch(`${process.env.REACT_APP_API_BE}/game/update-winner/${gameId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        toast({
          title: "Game Updated.",
          description: "Game has been updated",
          status: "sucess",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Game not updated",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }
    })
  };

  return (
    <Button variant="ghost" onClick={updateWinner} ml={2}>
      <RepeatIcon></RepeatIcon>
    </Button>
  );
}

function DeleteConfirmModal({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const warningColor = useColorModeValue("red.600", "red.300");

  const authId = useStoreState((state) => state.authId);

  const delGame = () => {
    if (!gameId) return;
    fetch(`${process.env.REACT_APP_API_BE}/game/delete/${gameId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
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
          <ModalHeader color={warningColor}>Delete Game</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="xl">
              Are you sure you want to delete this game?
            </Text>
            <Text color={warningColor} fontSize="sm">
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



function AddPredictionModal({ users, games, teams }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();

  const toast = useToast();

  const authId = useStoreState((state) => state.authId);
  const onSubmit = (data) => {
    fetch(process.env.REACT_APP_API_BE + "/prediction/admin/new", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data),
    })
    .then(async (response) => {
      if (response.ok) {
        toast({
          title: "Success",
          description: "Prediction Added",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        reset();
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Could not add prediction",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    });
  };
  return (
    <>
      <Button colorScheme="teal" mx onClick={onOpen}>
        Add Prediction
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>New Prediction</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>User</FormLabel>
                <Select {...register("userId")}>
                  <option value={null}></option>
                  {users.map((user) => {
                    return <option value={user.mongoId}>{user.username}</option>
                  })}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Game Number</FormLabel>
                <Select {...register("gameId")}>
                  <option value={null}></option>
                  {games.map((game) => {
                    return <option value={game.gameId}>{game.gameNumber + " - " + game.team1.fullName + " vs " + game.team2.fullName}</option>
                  })}
                </Select>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Predicted Team</FormLabel>
                <Select {...register("predictedTeamId")}>
                  <option value={null}></option>
                  {teams.map((team) => {
                    return <option value={team.teamId}>{team.fullName}</option>
                  })}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Confidence</FormLabel>
                <Input
                  pattern="^(5[1-9]|[6-9][0-9]|100|FH|L)$"
                  {...register("confidence")}
                  placeholder="51 - 100 or FH or L"
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <Input {...register("password")} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Add Prediction
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
