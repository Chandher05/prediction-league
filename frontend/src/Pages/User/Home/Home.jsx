import {
  Flex,
  Container,
  Heading,
  Stack,
  Text,
  Button,
} from "@chakra-ui/react";
import { useHistory } from "react-router";
import { Illustration } from "./Illustration";
import Countdown from "./Countdown";

export default function Home() {
  const history = useHistory();
  const navTo = (route) => {
    history.push(`/${route}`);
  };
 
  return (
    <Container maxW={"2xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 8 }}
        py={{ base: 20, md: 20 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "2xl", md: "4xl" }}
          lineHeight={"110%"}
        >
          PREDICTION LEAGUE{" "}
          <Text as={"span"} color={"orange.400"}>
            ICC WORLD CUP
          </Text>
        </Heading>
        <div>
          <Countdown ></Countdown>
        </div>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"orange"}
          bg={"orange.400"}
          _hover={{ bg: "orange.500" }}
          onClick={() => navTo("predict")}
          size="lg"
        >
          Predict Now
        </Button>
        <Stack spacing={6} direction={ "column" }>
          <Button
            rounded={"full"}
            colorScheme={"red"}
            px={6}
            onClick={() => navTo("leaderboard")}
          >
            Leaderboard
          </Button>
          <Button
            rounded={"full"}
            colorScheme={"red"}
            px={6}
            onClick={() => navTo("predictions")}
          >
            Your Predictions
          </Button>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"red"}
            onClick={() => navTo("PastGames")}
          >
            Completed Games
          </Button>
        </Stack>
        <Flex w={"full"}>
          <Illustration
            height={{ sm: "18rem", lg: "19rem" }}
            mt={{ base: 12, sm: 16 }}
          />
        </Flex>
      </Stack>
    </Container>
  );
}


