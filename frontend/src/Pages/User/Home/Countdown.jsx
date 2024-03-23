import {
  Box,
  Center,
  Stack,
  useColorModeValue,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";

import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

function Countdown() {
  const authId = useStoreState((state) => state.authId);

  const [nextGame, setNextGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const color = () => {
    if (
      nextGame.team1.shortName === "RCB" ||
      nextGame.team2.shortName === "RCB"
    ) {
      return "red";
    }
    return "blue";
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_API_BE + "/game/scheduled", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const games = await response.json();
          setNextGame(games[0]);
        }
      })
      .catch((e) => console.log(e));
  }, [authId]);
  useEffect(() => {
    const intervalTimeCountdownClock = () => {
      if (!nextGame?.startTime) return;
      setTimeLeft(
        DateTime.fromISO(nextGame.startTime, { zone: "utc" })
          .toLocal()
          .diffNow(["hours", "minutes", "seconds", "milliseconds"])
          .toObject()
      );
    };
    intervalTimeCountdownClock();
    setInterval(intervalTimeCountdownClock, 1000);
  }, [nextGame]);
  return (
    <Box p="2">
      {nextGame && (
        <CountDownClock
          timeLeft={timeLeft}
          nextGame={nextGame}
          color={color()}
        ></CountDownClock>
      )}
    </Box>
  );
}

export default Countdown;

const checkTime = (timeLeft) => {
  if (timeLeft?.seconds > 0) return true;
  return false;
};

function CountDownClock({ timeLeft, nextGame, color }) {
  return (
    <Center>
      <Box
        minW={"350px"}
        maxW={"500px"}
        w={"full"}
        bg={useColorModeValue(`${color}.200`, "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
      >
        <Stack
          textAlign={"center"}
          p={2}
          color={useColorModeValue("gray.800", "white")}
          align={"center"}
        >
          <Text
            fontSize={"sm"}
            fontWeight={500}
            bg={useColorModeValue(`${color}.50`, `${color}.900`)}
            p={2}
            px={3}
            color={`${color}.500`}
            // rounded={"full"}
          >
            No. {nextGame?.gameNumber} :{" "}
            {`${nextGame?.team1.fullName} vs ${nextGame?.team2.fullName}`}
          </Text>
          {checkTime(timeLeft) && (
            <Stack
              direction={"row"}
              align={"center"}
              justify={"center"}
              spacing={5}
            >
              <VStack spacing={0} p={0}>
                <Text fontSize="4xl" fontWeight={700}>
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </Text>
                <Text fontSize="md" fontWeight={500}>
                  hours
                </Text>
              </VStack>{" "}
              <VStack spacing={0} p={0}>
                <Text fontSize="4xl" fontWeight={700}>
                  {timeLeft.minutes < 10
                    ? `0${timeLeft.minutes}`
                    : timeLeft.minutes}
                </Text>
                <Text fontSize="md" fontWeight={500}>
                  minutes
                </Text>
              </VStack>
              <VStack spacing={0} p={0}>
                <Text fontSize="4xl" fontWeight={700}>
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}
                </Text>
                <Text fontSize="md" fontWeight={500}>
                  seconds
                </Text>
              </VStack>
            </Stack>
          )}
        </Stack>
      </Box>
    </Center>
  );
}
