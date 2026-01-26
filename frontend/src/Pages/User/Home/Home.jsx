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
import { useEffect } from "react";
import { useStoreState } from "easy-peasy";
import { useStoreActions } from "easy-peasy";

import { useState } from "react";

export default function Home() {
  const [impact, setImpact] = useState(false);
  const authId = useStoreState((state) => state.authId);
  const reset = useStoreActions((actions) => actions.reset);
  const history = useHistory();
  const navTo = (route) => {
    history.push(`/${route}`);
  };

  useEffect(() => {
    console.log("calling impact------------");
    fetch(`${process.env.REACT_APP_API_BE}/game/impact/active`, {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log("Impact is on");
          setImpact(true);
        }
      })
      .catch((err) => {
        console.log("error fetching....");
        console.log(err);
      });
  }, [authId]);

  function handleLogout() {
    reset();
    logout(history);
  }

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
          T20 World Cup {new Date().getFullYear()} <br />
          <Text as={"span"} color={"red.600"} py={{ base: 20 }}>
            PREDICTION LEAGUE
          </Text>
        </Heading>
        <Button
          rounded={"8"}
          minWidth={"180px"}
          px={6}
          colorScheme={"blue"}
          bg={"blue.800"}
          _hover={{ bg: "blue.500" }}
          onClick={() => navTo("predict")}
          size="lg"
        >
          Predict Now
        </Button>
        {impact && (
          <Button
            rounded={"8"}
            minWidth={"180px"}
            px={6}
            colorScheme={"blue"}
            bg={"green.500"}
            _hover={{ bg: "green.300" }}
            onClick={() => navTo("impact")}
            size="lg"
          >
            Impact
          </Button>
        )}

        <>
          <Center>
            <Countdown></Countdown>
          </Center>
          <SimpleGrid columns={"1"} spacingY={3} spacingX={3}>
            <Button
              rounded={"8"}
              colorScheme={"blue"}
              px={6}
              onClick={() => navTo("leaderboard")}
            >
              Leaderboard
            </Button>
            <Button
              rounded={"8"}
              colorScheme={"blue"}
              px={6}
              onClick={() => navTo("predictions")}
            >
              Your Predictions
            </Button>
            <Button
              rounded={"8"}
              px={6}
              colorScheme={"blue"}
              onClick={() => navTo("PastGames")}
            >
              All Games
            </Button>
            {/* <Button
               rounded={"8"}
              px={6}
              colorScheme={"blue"}
              onClick={() => navTo("trends")}
            >
              Trends
            </Button> */}
            <Button
              rounded={"8"}
              px={6}
              colorScheme={"blue"}
              onClick={() => navTo("halloffame")}
            >
              Hall of Fame
            </Button>
          </SimpleGrid>
          <Button
            rounded={"8"}
            px={6}
            colorScheme={"red"}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </>

        <Center
          opacity={0.5}
          position={"fixed"}
          zIndex={-1}
          w={"full"}

          // w={"full"}
          // h={"full"}
        >
          <Illustration
          // height={{ sm: "5srem", lg: "10rem" }}÷
          // mt={{ base: 0, sm: 0 }}
          />
        </Center>
      </Stack>
    </Container>
  );
}
