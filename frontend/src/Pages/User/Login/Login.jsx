import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  HStack,
  Tag,
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
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const mutedText = useColorModeValue("gray.600", "gray.300");

  const signIn = async () => {
    await signInWithGoogle();
    if (location.state?.from) {
      history.push(location.state.from);
    } else {
      history.push("/");
    }
  };

  return (
    <Box minH="100vh" bg={pageBg} position="relative" overflow="hidden">
      <Container
        maxW="2xl"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 6, md: 10 }}
      >
        <Stack
          textAlign="center"
          align="center"
          spacing={{ base: 6, md: 8 }}
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="3xl"
          boxShadow="2xl"
          p={{ base: 8, md: 12 }}
          position="relative"
          zIndex={1}
        >
          <Tag size="lg" colorScheme="brand" variant="subtle">
            Welcome Back
          </Tag>
          <Heading
            fontWeight={700}
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            lineHeight="110%"
          >
            PREDICTION LEAGUE{" "}
            <Text as="span" color={accentColor}>
              T20 2026
            </Text>
          </Heading>
          <Text color={mutedText} fontSize={{ base: "md", md: "lg" }} maxW="lg">
            Sign in to submit your picks, track your rank, and join the season race.
          </Text>
          <Button
            px={8}
            w={{ base: "full", sm: "auto" }}
            colorScheme="brand"
            bg={buttonBg}
            _hover={{ bg: buttonHover }}
            onClick={signIn}
            size="lg"
          >
            Continue with Google
          </Button>
          <HStack spacing={2} color={mutedText} fontSize="sm">
            <Text>Quick</Text>
            <Text>•</Text>
            <Text>Secure</Text>
            <Text>•</Text>
            <Text>One-click login</Text>
          </HStack>
        </Stack>
      </Container>
      <Box
        opacity={{ base: 0.07, md: 0.14 }}
        position="absolute"
        zIndex={0}
        inset={{ base: "auto -40px -120px", md: "auto -40px -170px" }}
        pointerEvents="none"
      >
        <Illustration />
      </Box>
    </Box>
  );
}
