import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router";

import { signInWithGoogle } from "../../../Firebase/config";

export default function GoogleLogin() {
  const history = useHistory();
  const location = useLocation();

  const signIn = async () => {
    await signInWithGoogle();
    if (location.state?.from) {
      history.push(location.state.from);
    } else {
      history.push("/");
    }
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
          <Text as={"span"} color={"blue.400"}>
            IPL 2022
          </Text>
        </Heading>
        <Button
          px={6}
          colorScheme={"red"}
          bg={"blue.400"}
          _hover={{ bg: "blue.500" }}
          onClick={signIn}
          size="lg"
        >
          Login With Google
        </Button>
      </Stack>
    </Container>
  );
}
