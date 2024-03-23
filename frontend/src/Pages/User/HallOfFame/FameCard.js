import {
  Center,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export default function FameCard({ event, winners, year }) {
  return (
    <Center>
      <Stack
        borderWidth="1px"
        borderRadius="2xl"
        w={{ sm: "100%", md: "540px" }}
        height={{ sm: "476px", md: "20rem" }}
        direction={{ base: "column", md: "row" }}
        bg={"blue.500"}
        boxShadow={"2xl"}
        padding={4}
      >
        {/* <Flex flex={1} bg="blue.200">
          <Image
            objectFit="cover"
            boxSize="100%"
            src={
              "https://images.unsplash.com/photo-1520810627419-35e362c5dc07?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ"
            }
          />
        </Flex> */}
        <Stack
          flex={1}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg={"white"}
          margin={10}
          borderRadius={"2xl"}
        >
          {winners.map((winner) => {
            return (
              <Heading fontSize={"2xl"} fontFamily={"body"} bg={"white"}>
                {winner}
              </Heading>
            );
          })}

          <Text
            textAlign={"center"}
            color={useColorModeValue("gray.700", "gray.400")}
            px={3}
            fontSize={"lg"}
            fontWeight={"xl"}
          >
            {event}
          </Text>
          <Text fontWeight={600} color={"gray.500"} size="sm" mb={4}>
            {year}
          </Text>
        </Stack>
      </Stack>
    </Center>
  );
}
