import {
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router";

import { signInWithGoogle } from "../../../Firebase/config";
import { Illustration } from "../Home/Illustration";

export default function GoogleLogin() {
  const history = useHistory();
  const location = useLocation();
  const accentColor = useColorModeValue("brand.600", "brand.200");
  const buttonBg = useColorModeValue("brand.600", "brand.300");
  const buttonHover = useColorModeValue("brand.500", "brand.200");

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
          <Text as={"span"} color={accentColor}>
            IPL 2024
          </Text>
        </Heading>
        <Button
          px={6}
          colorScheme="brand"
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          onClick={signIn}
          size="lg"
        >
          Login With Google
        </Button>
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
