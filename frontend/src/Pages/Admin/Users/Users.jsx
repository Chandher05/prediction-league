import { React } from "react";
import { Heading, HStack, VStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

function Users() {
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="flex-end">
        <Heading size="2xl">Users</Heading>
        <AddUserModal></AddUserModal>
      </HStack>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>User name</Th>
            <Th>Unique Code</Th>
            <Th>Active</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
            <Td>25.4</Td>
          </Tr>
        </Tbody>
        <Tfoot>
          <Tr>
            <Th>User name</Th>
            <Th>Unique Code</Th>
            <Th>Active</Th>
          </Tr>
        </Tfoot>
      </Table>
    </VStack>
  );
}

export default Users;

function AddUserModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Add User</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input placeholder="Username" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Unique Code</FormLabel>
              <Input placeholder="444444" />
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
