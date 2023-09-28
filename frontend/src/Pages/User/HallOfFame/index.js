import { Heading, VStack, HStack, Flex } from "@chakra-ui/layout";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import FameCard from "./FameCard";

function HallOfFame() {
  const history = useHistory();
  const getWinners = [
    {
      winners: ["🥇Prajwal Prasad", "🥈Barath C", "🥉Jayasurya P"],
      year: "2023",
      event: "IPL",
    },
    {
      winners: ["🥇Sujith R", "🥈Chandher Shekar", "🥉Abhishek Gupta"],
      year: "2023",
      event: "WPL",
    },
    {
      winners: ["🥇KAUSHAL DONGRE", "🥈Jayasurya Pinaki", "🥉Barath C"],
      year: "2022",
      event: "IPL",
    },
    {
      winners: ["🥇Sujith", "🥈Abhishek Gupta", "🥉Barath C"],
      year: "2021",
      event: "T20 World Cup",
    },
    {
      winners: ["🥇Abhishek Gupta"],
      year: "2021",
      event: "IPL",
    },
  ];
  return (
    <Flex minH={"100vh"} justify={"center"}>
      <VStack w="full" h="full" p={4} spacing={10} bg={"blue.200"}>
        <HStack spacing={3} alignItems="justify-center">
          <Button
            color="blue.300"
            borderRadius="10px"
            borderColor={"blue.100"}
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Hall Of Fame
          </Heading>
        </HStack>
        {getWinners.map(({ winners, year, event }) => {
          return (
            <FameCard winners={winners} year={year} event={event}></FameCard>
          );
        })}
      </VStack>
    </Flex>
  );
}

export default HallOfFame;
