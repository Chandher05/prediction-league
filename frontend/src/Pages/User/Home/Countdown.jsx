import { Box, Center, Stack, useColorModeValue, Text } from "@chakra-ui/react";

import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

function Countdown() {
  const [nextGame, setNextGame] = useState({});
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    fetch(process.env.REACT_APP_API + "/game/scheduled").then(
      async (response) => {
        if (response.ok) {
          const games = await response.json();
          setNextGame(games[0]);
        }
      }
    );
  }, []);
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
        ></CountDownClock>
      )}
    </Box>
  );
}

export default Countdown;

function CountDownClock({ timeLeft, nextGame }) {
  return (
    <Center>
      <Box
        minW={"350px"}
        maxW={"500px"}
        w={"full"}
        bg={useColorModeValue("orange", "gray.800")}
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
            bg={useColorModeValue("orange.50", "orange.900")}
            p={2}
            px={3}
            color={"orange.500"}
            // rounded={"full"}
          >
            No. {nextGame?.gameNumber} :{" "}
            {`${nextGame?.team1} vs ${nextGame?.team2}`}
          </Text>
          {timeLeft && (
            <Stack direction={"row"} align={"center"} justify={"center"}>
              <Text fontSize={"4xl"} fontWeight={600}>
                {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}h :{" "}
                {timeLeft.minutes < 10
                  ? `0${timeLeft.minutes}`
                  : timeLeft.minutes}
                {"m "}:{" "}
                {timeLeft.seconds < 10
                  ? `0${timeLeft.seconds}`
                  : timeLeft.seconds}
                s
              </Text>
            </Stack>
          )}
        </Stack>
      </Box>
    </Center>
  );
}
