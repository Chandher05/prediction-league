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
      winner: "Abhishek Gupta",
      year: "2020",
      event: "IPL 2020",
    },
    {
      winner: "Jayasurya P",
      year: "2021",
      event: "World Cup 2020",
    },
    {
      winner: "Sujith KM",
      year: "2022",
      event: "WPL 2020",
    },
  ];
  return (
    <Flex
      minH={"100vh"}
      justify={"center"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <VStack w="full" h="full" p={4} spacing={10}>
        <HStack spacing={3} alignItems="justify-center">
          <Button
            color="blue.300"
            borderRadius="10px"
            size="sm"
            onClick={() => history.push("/")}
          >
            <ArrowBackIcon></ArrowBackIcon>
          </Button>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Hall Of Fame
          </Heading>
        </HStack>
        {getWinners.map(({ winner, year, event }) => {
          return (
            <FameCard winner={winner} year={year} event={event}></FameCard>
          );
        })}
      </VStack>
    </Flex>
  );
}

export default HallOfFame;
