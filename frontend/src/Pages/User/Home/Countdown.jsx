import {
  Box,
  Center,
  Stack,
  useColorModeValue,
  Text,
  VStack,
  Tag,
} from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";

import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { apiRequest } from "../../../api/client";

function Countdown({ impactAvailable, impactMessage }) {
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
    const fetchGames = async () => {
      try {
        const games = await apiRequest("/game/scheduled");
        setNextGame(games?.[0] || null);
      } catch (error) {
        setNextGame(null);
      }
    };
    fetchGames();
  }, [authId]);
  useEffect(() => {
    const intervalTimeCountdownClock = () => {
      if (!nextGame?.startTime) return;
      setTimeLeft(
        DateTime.fromISO(nextGame.startTime, { zone: "utc" })
          .toLocal()
          .diffNow(["hours", "minutes", "seconds", "milliseconds"])
          .toObject(),
      );
    };
    intervalTimeCountdownClock();
    const timer = setInterval(intervalTimeCountdownClock, 1000);
    return () => clearInterval(timer);
  }, [nextGame]);
  return (
    <Box p="2">
      {nextGame && (
        <CountDownClock
          timeLeft={timeLeft}
          nextGame={nextGame}
          color={color()}
          impactAvailable={impactAvailable}
          impactMessage={impactMessage}
        ></CountDownClock>
      )}
    </Box>
  );
}

export default Countdown;

const checkTime = (timeLeft) => {
  if (
    timeLeft?.seconds === 0 &&
    timeLeft?.minutes === 0 &&
    timeLeft?.hours === 0
  )
    return false;
  return true;
};

function CountDownClock({
  timeLeft,
  nextGame,
  color,
  impactAvailable,
  impactMessage,
}) {
  const impactTextColor = useColorModeValue("gray.600", "gray.300");
  return (
    <Stack spacing={3} align="center" p={{ base: 2 }}>
      <Center w="full" px={{ base: 3, sm: 4 }}>
        <Box
          w={"full"}
          maxW={{ base: "full", sm: "480px" }}
          bg={useColorModeValue(`${color}.200`, "gray.800")}
          boxShadow={"2xl"}
          rounded={{ base: "xl", md: "2xl" }}
          overflow={"hidden"}
        >
          <Stack
            textAlign={"center"}
            p={{ base: 3, md: 4 }}
            color={useColorModeValue("gray.800", "white")}
            align={"center"}
            spacing={4}
          >
            <Text
              fontSize={{ base: "xs", sm: "sm" }}
              fontWeight={500}
              bg={useColorModeValue(`${color}.50`, `${color}.900`)}
              px={{ base: 3, md: 4 }}
              py={2}
              rounded="full"
              color={`${color}.500`}
            >
              No. {nextGame?.gameNumber} :{" "}
              {`${nextGame?.team1.fullName} vs ${nextGame?.team2.fullName}`}
            </Text>
            {checkTime(timeLeft) && (
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={{ base: "stretch", sm: "center" }}
                justify={"center"}
                spacing={{ base: 3, sm: 5 }}
                w="full"
              >
                <TimeBlock label="hours" value={timeLeft.hours} />
                <TimeBlock label="minutes" value={timeLeft.minutes} />
                <TimeBlock label="seconds" value={timeLeft.seconds} />
              </Stack>
            )}
          </Stack>
        </Box>
      </Center>
      {!impactAvailable && (
        <Tag size="sm" colorScheme="gray" variant="subtle" px={3} py={1}>
          <Text fontSize="xs" color={impactTextColor}>
            {impactMessage || "Impact window is closed"}
          </Text>
        </Tag>
      )}
    </Stack>
  );
}

const TimeBlock = ({ label, value }) => {
  const displayValue = value ?? 0;
  const padded = displayValue < 10 ? `0${displayValue}` : displayValue;
  return (
    <VStack
      spacing={0}
      p={{ base: 2, sm: 0 }}
      flex={1}
      minW={{ base: "full", sm: "auto" }}
    >
      <Text fontSize={{ base: "3xl", sm: "4xl" }} fontWeight={700}>
        {padded}
      </Text>
      <Text fontSize="md" fontWeight={500} textTransform="capitalize">
        {label}
      </Text>
    </VStack>
  );
};
