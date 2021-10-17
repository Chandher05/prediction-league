import React, {  useEffect, useState } from "react";
import { Heading, HStack, VStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
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
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";

function Users() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const getUsers = () => {
    fetch("http://declaregame.in:7500/users/all").then(async (response) => {
      if (response.ok) setUsers(await response.json());
    });
  };
  useEffect(() => {
    getUsers()
  },[]);


  const navToGame = () => {
    history.push('/admin/Games')
  } 
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="flex-end">
        <Heading size="2xl">Users</Heading>
        <AddUserModal></AddUserModal>
        <Button onClick={navToGame}>Games Table</Button>
      </HStack>

      <Table variant="striped" size="sm" colorScheme="teal">
        <Thead>
          <Tr>
            <Th >No.</Th>
            <Th>User name</Th>
            <Th>Unique Code</Th>
            <Th>Active</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((element, index) => {
            return (
              <Tr>
                <Td >{index + 1}</Td>
                <Td>{element.username}</Td>
                <Td>{element.uniqueCode}</Td>
                <Td>{element.isActive ? "Yes" : "No"}</Td>
                <Td>Actions</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default Users;

function AddUserModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => {
    fetch("http://declaregame.in:7500/users/add", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    onClose();
    reset();
  };
  
  return (
    <>
      <Button onClick={onOpen}>Add User</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create User</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input placeholder="Username" {...register("username")}/>
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Unique Code</FormLabel>
              <Input placeholder="444444" {...register("uniqueCode")}/>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} type="submit">
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
