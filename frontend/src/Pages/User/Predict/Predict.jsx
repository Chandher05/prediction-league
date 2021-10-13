import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

export default function Predict() {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Enter your prediction
        </Heading>
        <FormControl id="email" isRequired>
          <FormLabel>Game</FormLabel>
          <Select placeholder="Select option">
            <option value="Team 1">Team 1</option>
            <option value="Team 2">Team 2</option>
            <option value="Leave">Leave</option>
          </Select>
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Unique Code</FormLabel>
          <Input
            placeholder="111-111"
            _placeholder={{ color: "gray.500" }}
            type="text"
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Team</FormLabel>
          <Select placeholder="Select option">
            <option value="Team 1">Team 1</option>
            <option value="Team 2">Team 2</option>
            <option value="Leave">Leave</option>
          </Select>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Confidence</FormLabel>
          <Input type="number" />
        </FormControl>
        <Stack spacing={6}>
          <Button
            bg={"orange.400"}
            color={"white"}
            _hover={{
              bg: "orange.500",
            }}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
}
