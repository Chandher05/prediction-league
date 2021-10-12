import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Container, GridItem, Heading, SimpleGrid, VStack } from "@chakra-ui/layout";
import { useHistory } from "react-router";

function Login() {
  const history = useHistory();
  const loginAdminConsole = () => {
    history.push('/admin/Users')
  }
  return (
    <Container>
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <VStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Admin Login</Heading>
      </VStack>
      <SimpleGrid columns={1}  rowGap={6} w="full">
        <GridItem colSpan={1}>
          <FormControl>
            <FormLabel>Magic Word</FormLabel>
            <Input placeholder="*******" />
          </FormControl>
        </GridItem>
        <GridItem colSpan={1}>
          <Button variant="solid" size="lg" w="full" colorScheme="teal" onClick={loginAdminConsole}>
            Login
          </Button>
        </GridItem>
      </SimpleGrid>
    </VStack>
    </Container>
  );
}

export default Login;
