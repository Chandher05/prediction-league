import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Avatar,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useToast,
  HStack,
  Link,
  Image,
  Text,
  Box,
  Select,
  ScaleFade,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";
import { ApiError, apiRequest } from "../../../api/client";

export default function Predict() {
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  let { id } = useParams();

  const [games, setGames] = useState([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [showConfidence, setConfidence] = useState(true);
  const [selected, setSelected] = useState({});
  const [predictedTeamId, setPredictedTeamId] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSubmittingPrediction, setIsSubmittingPrediction] = useState(false);
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const userName = useStoreState((state) => state.userName);
  const photoURL = useStoreState((state) => state?.photoURL);
  const helperTextColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    const getGames = () => {
      setIsLoadingGames(true);
      if (id) {
        apiRequest(`/game/id/${id}`)
          .then((res) => {
            setGames([res]);
            if (res) setSelected(res);
          })
          .catch(() => {})
          .finally(() => setIsLoadingGames(false));
      } else {
        apiRequest("/game/scheduled")
          .then((gamesData) => {
            setGames(gamesData || []);
            if (gamesData?.[0]) setSelected(gamesData[0]);
          })
          .catch(() => {})
          .finally(() => setIsLoadingGames(false));
      }
    };
    getGames();
  }, [id]);
  const currentConfidence = watch("confidence");
  const canSubmitPrediction =
    Boolean(selected?.gameId) &&
    (Boolean(predictedTeamId) || currentConfidence === "L");

  const isBetween70And100 = (value) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 70 && num <= 100;
  };

  const getRandomDescription = (confidence) => {
    let description = [
        "Future you is either proud or embarrassed.",
        "May the force be with you!",
        "The odds are in. Now we wait for reality to grade you.",
        "Confidence submitted. Accuracy pending.",
        "The future is now under pressure to cooperate.",
        "Reality is preparing its response."
      ]
    if (isBetween70And100(confidence)) {
      description = [
        "Strong opinions about a future that hasn't happened yet. Respect.", 
        "This will either age like fine wine or unrefrigerated milk.", 
        "That's either brilliant foresight or legendary overconfidence.", 
        "This prediction may become prophecy… or a meme.", 
        "A bold forecast has entered the timeline. Good luck.", 
        "Either genius or chaos. Time will reveal which."
      ]
    }
    // Return random description
    const randomIndex = Math.floor(Math.random() * description.length);
    return description[randomIndex];
  }

  const onSubmit = (data) => {
    if (!canSubmitPrediction) {
      toast({
        title: "Select a team first",
        description: "Choose a team before submitting your prediction.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    data["gameId"] = selected?.gameId;
    data["predictedTeamId"] = selected ? predictedTeamId : "";
    data["confidence"] = showConfidence
      ? data["confidence"]
      : data["confidence"] || "FH";
    const predictedTeamName =
      predictedTeamId === selected?.team1?._id
        ? selected?.team1?.shortName
        : predictedTeamId === selected?.team2?._id
          ? selected?.team2?.shortName
          : "Leave";
    const matchLabel = `${selected?.team1?.shortName || "-"} vs ${selected?.team2?.shortName || "-"}`;
    const predictionLabel = `${predictedTeamName} (${data["confidence"] || "-"})`;
    setIsSubmittingPrediction(true);
    apiRequest("/prediction/new", {
      method: "POST",
      body: data,
    })
      .then(() => {
        toast({
          title: `Prediction saved for ${matchLabel}`,
          description:  getRandomDescription(data["confidence"]),
          status: "success",
          duration: 7000,
          isClosable: true,
        });
        if (location.state?.returnTo) {
          history.push(location.state.returnTo);
          return;
        }
        if (location.state?.source === "home") {
          setShowSuccessAnimation(true);
          setTimeout(() => setShowSuccessAnimation(false), 2200);
          return;
        }
        history.push("/");
      })
      .catch((e) => {
        toast({
          title: "Something went wrong.",
          // Custom error message from server
          description:
            e instanceof ApiError && e.message
              ? e.message
              : "Please try again or contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsSubmittingPrediction(false);
      });
  };
  const predictionForGame = (value) => {
    setConfidence(true);
    setPredictedTeamId(value);
    const current = getValues("confidence");
    if (current === "L" || current === "FH") {
      setValue("confidence", "");
    }
  };

  const selectLeave = () => {
    setConfidence(false);
    setPredictedTeamId(null);
    setValue("confidence", "L");
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
    return `${process.env.PUBLIC_URL}/${folder}/${shortName}.png`;
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
          <Avatar name={userName} src={photoURL} size="sm" />
          <Text fontSize="25px">{userName}</Text>
        </HStack>

        <form onSubmit={handleSubmit(onSubmit)}>
          <ScaleFade initialScale={0.96} in={showSuccessAnimation}>
            {showSuccessAnimation ? (
              <Alert status="success" borderRadius="md" mb={3}>
                <AlertIcon />
                Prediction confirmed
              </Alert>
            ) : null}
          </ScaleFade>
          <FormControl>
            <FormLabel>Select game</FormLabel>
            <Select
              value={selected?.gameId || ""}
              onChange={(e) => {
                const next = games.find((g) => String(g.gameId) === e.target.value);
                if (next) updateSelected(next);
              }}
            >
              <option value="" disabled>
                Choose a game
              </option>
              {games.map((game) => (
                <option key={game.gameId || game.gameNumber} value={game.gameId}>
                  {`Game ${game.gameNumber} - ${game.team1.shortName} vs ${game.team2.shortName}`}
                </option>
              ))}
            </Select>
          </FormControl>
          {isLoadingGames && (
            <Text fontSize="sm" color={helperTextColor} p={2}>
              Loading games...
            </Text>
          )}

          {selected.team1 && selected.team2 ? (
            <Box borderWidth="1px" borderRadius="lg" m={2} boxShadow="sm">
              <Box px={{ base: 3, md: 4 }} py={{ base: 4, md: 5 }}>
                <Stack spacing={4}>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                    <Box
                      bg={"white"}
                      flex="1"
                      position="relative"
                      borderWidth="2px"
                      borderColor={
                        selected.team1._id === predictedTeamId
                          ? "green.500"
                          : "gray.200"
                      }
                      boxShadow={
                        selected.team1._id === predictedTeamId
                          ? "0 0 0 3px rgba(56, 161, 105, 0.35), 0 8px 24px rgba(56, 161, 105, 0.18)"
                          : "sm"
                      }
                      bgColor={
                        selected.team1._id === predictedTeamId
                          ? "green.50"
                          : "white"
                      }
                      borderRadius="xl"
                      p={4}
                      cursor="pointer"
                      transition="transform 0.15s ease, box-shadow 0.15s ease"
                      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                      onClick={() => predictionForGame(selected.team1._id)}
                    >
                      {selected.team1._id === predictedTeamId && (
                        <Text
                          position="absolute"
                          top={2}
                          right={2}
                          fontSize="xs"
                          fontWeight="700"
                          bg="green.500"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="full"
                          letterSpacing="0.02em"
                        >
                          Selected
                        </Text>
                      )}
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
                      position="relative"
                      borderWidth="2px"
                      borderColor={
                        selected.team2._id === predictedTeamId
                          ? "green.500"
                          : "gray.200"
                      }
                      boxShadow={
                        selected.team2._id === predictedTeamId
                          ? "0 0 0 3px rgba(56, 161, 105, 0.35), 0 8px 24px rgba(56, 161, 105, 0.18)"
                          : "sm"
                      }
                      bgColor={
                        selected.team2._id === predictedTeamId
                          ? "green.50"
                          : "white"
                      }
                      borderRadius="xl"
                      p={4}
                      cursor="pointer"
                      transition="transform 0.15s ease, box-shadow 0.15s ease"
                      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                      onClick={() => predictionForGame(selected.team2._id)}
                    >
                      {selected.team2._id === predictedTeamId && (
                        <Text
                          position="absolute"
                          top={2}
                          right={2}
                          fontSize="xs"
                          fontWeight="700"
                          bg="green.500"
                          color="white"
                          px={2}
                          py={1}
                          borderRadius="full"
                          letterSpacing="0.02em"
                        >
                          Selected
                        </Text>
                      )}
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
                  <Button
                    variant="outline"
                    colorScheme={
                      !showConfidence && predictedTeamId === null ? "green" : "gray"
                    }
                    borderWidth="2px"
                    borderColor={
                      !showConfidence && predictedTeamId === null
                        ? "green.400"
                        : "gray.200"
                    }
                    onClick={selectLeave}
                  >
                    Leave
                  </Button>
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
              isDisabled={getValues("confidence") === "L"}
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
              isDisabled={!canSubmitPrediction || isSubmittingPrediction}
              isLoading={isSubmittingPrediction}
              loadingText="Submitting"
            >
              Submit
            </Button>
            <Text fontSize="xs" p="2">
              NOTE: If you are unable to submit a prediction here, please use this form instead. Using the form after submitting a prediction will not be considered. {" "}
              <Link
                href="https://forms.gle/9Z8PkgzRQX5GfrP88"
                isExternal
                color="blue.500"
              >
                Open form
              </Link>
            </Text>
          </Stack>
        </form>
      </Stack>
    </Flex>
  );
}
