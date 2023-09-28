import {
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Center,
  SimpleGrid,
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
    <Container maxW={"full"}>
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
          className="neon"
        >
          ICC WORLD CUP 2023 <br />
          <Text as={"span"} color={"blue.500"} py={{ base: 20 }}>
            PREDICTION LEAGUE
          </Text>
        </Heading>
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

        <>
          <Center>
            <Countdown></Countdown>
          </Center>
          <SimpleGrid columns={[1, 5]} spacingY={3} spacingX={3}>
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
              colorScheme={"blue"}
              onClick={() => navTo("halloffame")}
            >
              Hall of Fame
            </Button>
          </SimpleGrid>
          <Button
            rounded={"full"}
            px={6}
            colorScheme={"red"}
            onClick={() => {
              logout();
              history.push("/login");
            }}
          >
            Log out
          </Button>
        </>

        <Center w={"full"}>
          <Illustration
          // height={{ sm: "5srem", lg: "10rem" }}÷
          // mt={{ base: 0, sm: 0 }}
          />
        </Center>
      </Stack>
    </Container>
  );
}
