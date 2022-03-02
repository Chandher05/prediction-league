import React, { useEffect, useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue,
  useToast,
  HStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function Predict() {
  const history = useHistory();
  const toast = useToast();
  let { id } = useParams();

  const [games, setGames] = useState([]);
  const [showConfidence, setConfidence] = useState(true);
  const [selected, setSelected] = useState([]);
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const getGames = () => {
      if (id) {
        fetch(process.env.REACT_APP_API + `/game/id/${id}`).then(
          async (response) => {
            if (response.ok) {
              const res = await response.json();
              setGames([res]);
              if (res) setSelected([res]);
            }
          }
        );
      } else {
        fetch(process.env.REACT_APP_API + "/game/scheduled").then(
          async (response) => {
            if (response.ok) {
              const games = await response.json();
              setGames(games);
              if (games[0]) setSelected([games[0]]);
            }
          }
        );
      }
    };
    getGames();
  }, [id]);
  const onSubmit = (data) => {
    data["gameId"] = selected[0]?.gameId;
    fetch(process.env.REACT_APP_API + "/prediction/new", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
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
          description: "Hopefully it is the right future",
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
  const checkIfLeave = (e) => {
    if(e.target.value === "Leave") {
      setConfidence(false);
    }
    else {
      setConfidence(true);
    }
  }
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
            colorScheme="orange"
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl isRequired>
            <FormLabel>Game</FormLabel>
            <Select
              // placeholder="Select option"
              selected={games[0]}
              onChange={(e) => setSelected(JSON.parse(e.target.value))}
            >
              {games.map((game, index) => {
                return (
                  <option value={JSON.stringify(game)} key={index}>
                    Game {game.gameNumber} - {game.team1.shortName} v {game.team2.shortName}{" "}
                  </option>
                );
              })}
            </Select>
          </FormControl>
          {/* <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input type="text" {...register("userName")} />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Unique Code</FormLabel>
            <Input
              placeholder="111-111"
              _placeholder={{ color: "gray.500" }}
              type="text"
              {...register("uniqueCode")}
            />
          </FormControl> */}
          <FormControl isRequired>
            <FormLabel>Team</FormLabel>
            <Select placeholder="Select team" {...register("predictedTeamId")} onChange={checkIfLeave}>
              <option value={selected[0]?.team1._id}>{selected[0]?.team1.fullName}</option>
              <option value={selected[0]?.team2._id}>{selected[0]?.team2.fullName}</option>
              <option value="Leave">Leave</option>
            </Select>
          </FormControl>
          {showConfidence && 
          <FormControl>
            <FormLabel>Confidence</FormLabel>
            <Input
              pattern="^(5[1-9]|[6-9][0-9]|100|FH|L)$"
              {...register("confidence")}
              placeholder="51 - 100 or FH or L"
            />
          </FormControl>
          }

          <Stack spacing={6} mt={5}>
            <Button
              bg={"orange.400"}
              color={"white"}
              _hover={{
                bg: "orange.500",
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
