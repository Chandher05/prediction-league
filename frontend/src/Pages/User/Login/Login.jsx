import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";
import { useHistory } from "react-router";

import { signInWithGoogle } from "../../../Firebase/config";

export default function GoogleLogin() {
  const history = useHistory();

  const signIn = async () => {
    await signInWithGoogle();
    history.push('/')
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
            IPL 2022
          </Text>
        </Heading>
        <Button
          px={6}
          colorScheme={"red"}
          bg={"orange.400"}
          _hover={{ bg: "orange.500" }}
          onClick={signIn}
          size="lg"
        >
          Login With Google
        </Button>
      </Stack>
    </Container>
  );
}
