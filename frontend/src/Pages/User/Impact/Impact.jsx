import React, { useEffect, useCallback, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  useToast,
  HStack,
  Image,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

export default function Impact() {
  const history = useHistory();
  const toast = useToast();
  let { id } = useParams();

  const authId = useStoreState((state) => state.authId);
  const userName = useStoreState((state) => state.userName);
  const photoURL = useStoreState((state) => state?.photoURL);
  const pageBg = useColorModeValue("gray.50", "surface");
  const cardBg = useColorModeValue("white", "surfaceMuted");
  const helperTextColor = useColorModeValue("gray.600", "gray.300");
  const warningColor = useColorModeValue("orange.600", "orange.300");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const submitBg = useColorModeValue("brand.600", "brand.300");
  const submitHover = useColorModeValue("brand.500", "brand.200");

  const [selected, setSelected] = useState({});
  const [predictedTeamId, setPredictedTeamId] = useState({});
  const [originalPredictedTeamId, setOriginalPredictedTeamId] = useState({});
  const { handleSubmit } = useForm();
  const [currConfidenceLevel, setCurrConfidenceLevel] = useState(0);

  const updateSelected = useCallback((game) => {
    if (game.gameId !== selected.gameId) {
      setSelected(game);
    }
  }, [selected]);

  useEffect(() => {
    const getGames = async () => {
      fetch(`${process.env.REACT_APP_API_BE}/game/impact/active`, {
        headers: {
          Authorization: `Bearer ${authId}`,
        },
      })
        .then(async (res) => {
          if (res.status === 200) {
            const data = await res.json();
            setCurrConfidenceLevel(data.confidence);
            predictionForGame(data.predictedTeam._id);
            setOriginalPredictedTeamId(data.predictedTeam._id);
            updateSelected(data.game);
          } else {
            toast({
              title: "Oops. You can't submit an Impact prediction now",
              // Custom error message from server
              description: "Maybe wait for the game to start.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            history.push("/");
          }
        })
        .catch((err) => {
          toast({
            title: "Oops. You can't submit an Impact player now",
            // Custom error message from server
            description: "Maybe wait for the game to start.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          history.push("/");
        });
    };
    getGames();
  }, [id, authId, history, toast, updateSelected]);

  const onSubmit = () => {
    const data = {
      gameId: selected?.gameId,
      predictedTeamId: predictedTeamId,
      confidence: currConfidenceLevel || "",
    };
    fetch(process.env.REACT_APP_API_BE + "/prediction/impact", {
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
          title: "You have made a dangerous change!",
          description: "Wish you luck!",
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
    if (value === "Leave") {
      setPredictedTeamId(null);
    } else {
      setPredictedTeamId(value);
    }
  };



  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={pageBg}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={cardBg}
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
            Impact change
          </Heading>
        </HStack>
        <VStack>
          <Text
            align={"center"}
            color={helperTextColor}
            fontSize={{ base: "md", md: "md" }}
          >
            Do you want to switch your team?
          </Text>
        </VStack>

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
        <VStack
          justify="center"
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="10px"
          p={4}
        >
          <Text fontSize={{ base: "md", md: "md" }}>
            Confidence Level: {currConfidenceLevel}
          </Text>
          <Text align={"center"} color={warningColor} fontSize={{ base: "xs" }}>
            Warning: You confidence level remains same
          </Text>
        </VStack>

        <form onSubmit={handleSubmit(onSubmit)}>
          {selected.team1 && selected.team2 ? (
            <Box
              borderWidth="1px"
              borderRadius="lg"
              m={2}
              borderColor={borderColor}
            >
              <HStack justifyContent="center">
                <div>
                  <Image
                    onClick={() => predictionForGame(selected.team1._id)}
                    src={`${process.env.PUBLIC_URL}/Logo_IPL/${
                      selected.team1.shortName
                    }${
                      selected.team1._id === predictedTeamId
                        ? " - Selected"
                        : ""
                    }.png`}
                    alt={selected.team1.shortName}
                    width="100px"
                    // border={"2px"}
                    // borderColor={
                    //   selected.team1._id === predictedTeamId && "green.400"
                    // }
                  />
                </div>

                <Image
                  onClick={() => predictionForGame(selected.team2._id)}
                  src={`${process.env.PUBLIC_URL}/Logo_IPL/${
                    selected.team2.shortName
                  }${
                    selected.team2._id === predictedTeamId ? " - Selected" : ""
                  }.png`}
                  alt={selected.team2.shortName}
                  width="100px"
                  // border={"2px"}
                  // borderColor={
                  //   selected.team2._id === predictedTeamId && "green.400"
                  // }
                />
              </HStack>
              <Text fontSize="xs" p="2" color={helperTextColor}>
                Select {originalPredictedTeamId === selected.team1._id ? selected.team2.fullName : selected.team1.fullName} and submit to switch teams
              </Text>
            </Box>
          ) : null}

          <Stack spacing={6} mt={5}>
            <Button
              bg={submitBg}
              color={"white"}
              _hover={{
                bg: submitHover,
              }}
              disabled={originalPredictedTeamId === predictedTeamId ? true : false}
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
