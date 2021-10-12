import { Heading, VStack, HStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  ModalHeader, 
  ModalFooter,
  FormLabel,
  FormControl,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";

function Games() {
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="justify-center">
        <Heading size="2xl">Games</Heading>
      <AddGameModal></AddGameModal>
      </HStack>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th isNumeric>Game Number</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            <Th>Start Time</Th>
            <Th>Winner</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td isNumeric>25.4</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th isNumeric>Game Number</Th>
            <Th>Team 1</Th>
            <Th>Team 2</Th>
            <Th>Start Time</Th>
            <Th>Winner</Th>
            <Th>Actions</Th>
          </Tr>
        </Tfoot>
      </Table>
    </VStack>
  );
}

export default Games;

function AddGameModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Add Game</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Game Number</FormLabel>
              <Input placeholder="No." />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Team 1</FormLabel>
              <Input placeholder="RCB" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Team 2</FormLabel>
              <Input placeholder="DC" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Start Time</FormLabel>
              <Input type="datetime-local" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
