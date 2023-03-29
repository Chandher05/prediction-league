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

import { logout } from "../../../Firebase/config";

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
          <Text as={"span"} color={"blue.600"}>
            IPL 2023
          </Text>
        </Heading>
        <div>
          <Countdown ></Countdown>
        </div>
        <Button
          rounded={"full"}
          px={6}
          colorScheme={"blue"}
          bg={"blue.800"}
          _hover={{ bg: "blue.500" }}
          onClick={() => navTo("predict")}
          size="lg"
        >
          Predict Now
        </Button>
        <Stack spacing={6} direction={ "column" }>
          <Button
            rounded={"full"}
            colorScheme={"blue"}
            px={6}
            onClick={() => navTo("leaderboard")}
          >
            Leaderboard
          </Button>
          <Button
            rounded={"full"}
            colorScheme={"blue"}
            px={6}
            onClick={() => navTo("predictions")}
          >
            Your Predictions
          </Button>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            onClick={() => navTo("PastGames")}
          >
            All Games
          </Button>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"blue"}
            onClick={() => navTo("trends")}
          >
            Trends
          </Button>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"red"}
            onClick={() => {
              logout();
              history.push('/login')
            }}
          >
            Log out
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


