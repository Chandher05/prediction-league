import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
  HStack,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

export default function Predict() {
  const history = useHistory();
  const toast = useToast();
  let { id } = useParams();

  const [games, setGames] = useState([]);
  const [showConfidence, setConfidence] = useState(true);
  const [selected, setSelected] = useState({});
  const [predictedTeamId, setPredictedTeamId] = useState({});
  const { register, handleSubmit, setValue } = useForm();
  const authId = useStoreState((state) => state.authId);
  const userName = useStoreState((state) => state.userName);
  const photoURL = useStoreState((state) => state?.photoURL);

  useEffect(() => {
    const getGames = () => {
      if (id) {
        fetch(process.env.REACT_APP_API_BE + `/game/id/${id}`, {
          headers: {
            Authorization: `Bearer ${authId}`,
          },
        }).then(async (response) => {
          if (response.ok) {
            const res = await response.json();
            setGames([res]);
            if (res) setSelected(res);
          }
        });
      } else {
        fetch(process.env.REACT_APP_API_BE + "/game/scheduled", {
          headers: {
            Authorization: `Bearer ${authId}`,
          },
        }).then(async (response) => {
          if (response.ok) {
            const games = await response.json();
            setGames(games);
            if (games[0]) setSelected(games[0]);
          }
        });
      }
    };
    getGames();
  }, [id, authId]);
  const onSubmit = (data) => {
    data["gameId"] = selected?.gameId;
    data["predictedTeamId"] = selected ? predictedTeamId : "";
    data["confidence"] = showConfidence ? data["confidence"] : "L";
    fetch(process.env.REACT_APP_API_BE + "/prediction/new", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          return response;
        }
        throw response;
      })
      .then((data) => {
        toast({
          title: "You have predicted the future",
          description: "May the force be with you!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        history.push("/");
      })
      .catch((e) => {
        toast({
          title: "Something went wrong.",
          // Custom error message from server
          description:
            "Please try again or contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };
  const predictionForGame = (value) => {
    setPredictedTeamId(value);
  };

  const toggleFH = () => {
    if (showConfidence) {
      setConfidence(false);
      setValue("confidence", "FH");
    } else {
      setConfidence(true);
      setValue("confidence", "");
    }
  };

  const updateSelected = (game) => {
    if (game.gameId !== selected.gameId) {
      setSelected(game);
      setConfidence(true);
      setPredictedTeamId(null);
      setValue("confidence", "");
    }
  };

  const IPL_TEAMS = new Set([
    "CSK",
    "DC",
    "GG",
    "GT",
    "KKR",
    "LSG",
    "MI",
    "PBKS",
    "RCB",
    "RR",
    "SRH",
    "UPW",
  ]);

  const getTeamLogoPath = (shortName, isSelected = false) => {
    const folder = IPL_TEAMS.has(shortName) ? "Logo_IPL" : "Logo";
    return `${process.env.PUBLIC_URL}/${folder}/${shortName}${
      isSelected ? " - Selected" : ""
    }.png`;
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <HStack>
          <Button
            colorScheme="blue"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Enter your prediction
          </Heading>
        </HStack>

        <HStack justifyContent="center">
          <Image
            boxSize="40px"
            borderRadius="full"
            src={photoURL}
            alt="Profile photo"
            border={"2px"}
          />
          <Text fontSize="25px">{userName}</Text>
        </HStack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack>
            {games.map((game, index) => {
              return (
                <Button
                  colorScheme={
                    selected.gameId === game.gameId ? "blue" : "teal"
                  }
                  w="100%"
                  p={4}
                  color="white"
                  onClick={() => updateSelected(game)}
                >
                  Game {game.gameNumber} - {game.team1.shortName} v{" "}
                  {game.team2.shortName}{" "}
                </Button>
              );
            })}
          </HStack>

          {selected.team1 && selected.team2 ? (
            <Box borderWidth="1px" borderRadius="lg" m={2} boxShadow="sm">
              <Box px={{ base: 3, md: 4 }} py={{ base: 4, md: 5 }}>
                <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                  <Box
                    bg={"white"}
                    flex="1"
                    borderWidth="2px"
                    borderColor={
                      selected.team1._id === predictedTeamId
                        ? "green.400"
                        : "gray.200"
                    }
                    borderRadius="xl"
                    p={4}
                    cursor="pointer"
                    transition="transform 0.15s ease, box-shadow 0.15s ease"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                    onClick={() => predictionForGame(selected.team1._id)}
                  >
                    <Stack align="center" spacing={3}>
                      <Image
                        src={getTeamLogoPath(
                          selected.team1.shortName,
                          selected.team1._id === predictedTeamId,
                        )}
                        alt={selected.team1.shortName}
                        width={{ base: "96px", md: "110px" }}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={
                          selected.team1._id === predictedTeamId
                            ? "green.400"
                            : "gray.300"
                        }
                      />
                      <Text fontSize="sm" color="gray.700">
                        {selected.team1.fullName || selected.team1.shortName}
                      </Text>
                    </Stack>
                  </Box>
                  <Box
                    flex="1"
                    bg={"white"}
                    borderWidth="2px"
                    borderColor={
                      selected.team2._id === predictedTeamId
                        ? "green.400"
                        : "gray.200"
                    }
                    borderRadius="xl"
                    p={4}
                    cursor="pointer"
                    transition="transform 0.15s ease, box-shadow 0.15s ease"
                    _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                    onClick={() => predictionForGame(selected.team2._id)}
                  >
                    <Stack align="center" spacing={3}>
                      <Image
                        src={getTeamLogoPath(
                          selected.team2.shortName,
                          selected.team2._id === predictedTeamId,
                        )}
                        alt={selected.team2.shortName}
                        width={{ base: "96px", md: "110px" }}
                        borderRadius="md"
                        border="1px solid"
                        borderColor={
                          selected.team2._id === predictedTeamId
                            ? "green.400"
                            : "gray.300"
                        }
                      />
                      <Text fontSize="sm" color="gray.700">
                        {selected.team2.fullName || selected.team2.shortName}
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
              <Text fontSize="xs" p="2">
                Click on a team to lock in your pick.
              </Text>
            </Box>
          ) : null}

          {/* {showConfidence && ( */}
          <FormControl>
            <FormLabel>Confidence</FormLabel>
            <Input
              pattern="^(5[1-9]|[6-9][0-9]|100|FH)$"
              {...register("confidence")}
              disabled={!showConfidence}
              placeholder={showConfidence ? "51 - 100 or FH" : "FH"}
            />
            <Button
              mt={3}
              w="full"
              size="md"
              variant={showConfidence ? "outline" : "solid"}
              colorScheme="purple"
              onClick={toggleFH}
            >
              {showConfidence ? "Use Free Hit" : "Free Hit Selected"}
            </Button>
          </FormControl>
          {/* )} */}

          <Stack spacing={6} mt={5}>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
            >
              Submit
            </Button>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}
