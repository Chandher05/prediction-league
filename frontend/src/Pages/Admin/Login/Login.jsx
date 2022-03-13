import { Button } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";

import { Flex, GridItem, Heading, SimpleGrid, VStack } from "@chakra-ui/layout";
import { useRef } from "react";
import { useHistory } from "react-router";

function Login({ handleAuth }) {
  const history = useHistory();
  const inputRef = useRef();

  const loginAdminConsole = () => {
    const adminPassword = inputRef.current.value;
    if (adminPassword === process.env.REACT_APP_ADMIN_PASSWORD) {
      handleAuth(true);
      history.push("/admin/Games");
    }
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack
        w="full"
        h="full"
        maxW="md"
        p={10}
        spacing={10}
        alignItems="flex-start"
      >
        <VStack spacing={3} alignItems="justify-center">
          <Heading size="2xl">Admin Login</Heading>
        </VStack>
        <SimpleGrid columns={1} rowGap={6} w="full">
          <GridItem colSpan={1}>
            <FormControl>
              <FormLabel>Magic Word</FormLabel>
              <Input ref={inputRef} placeholder="*******" />
            </FormControl>
          </GridItem>
          <GridItem colSpan={1}>
            <Button
              variant="solid"
              size="lg"
              w="full"
              colorScheme="teal"
              onClick={loginAdminConsole}
            >
              Login
            </Button>
          </GridItem>
        </SimpleGrid>
      </VStack>
    </Flex>
  );
}

export default Login;
