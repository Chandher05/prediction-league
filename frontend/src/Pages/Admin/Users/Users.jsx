import React, { useCallback, useEffect, useState } from "react";
import { Heading, HStack, VStack } from "@chakra-ui/layout";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text
} from "@chakra-ui/react";
// import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router";
import { useStoreState } from "easy-peasy";

function Users() {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const authId = useStoreState((state) => state.authId);
  const getUsers = useCallback(() => {
    fetch(process.env.REACT_APP_API_BE + "/users/all", {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setUsers(await response.json());
    });
  }, [authId]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const navToGame = () => {
    history.push("/admin/Games");
  };
  return (
    <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
      <HStack spacing={3} alignItems="flex-end">
        <Heading size="2xl">Users</Heading>
        {/* <AddUserModal></AddUserModal> */}
        <Button onClick={navToGame}>Games Table</Button>
        <DisableImpact />
      </HStack>

      <Table variant="striped" size="sm" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Mongo ID</Th>
            <Th>User name</Th>
            <Th>Admin</Th>
            <Th>Active</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((element, index) => {
            return (
              <Tr key={index}>
                <Td>{index + 1}</Td>
                <Td>{element.mongoId}</Td>
                <Td>{element.username}</Td>
                <Td>{element.isAdmin ? "Yes" : "No"}</Td>
                <Td>{element.isActive ? "Yes" : "No"}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </VStack>
  );
}

export default Users;

// function AddUserModal() {
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const { register, handleSubmit, reset } = useForm();
//   const onSubmit = (data) => {
//     fetch(process.env.REACT_APP_API_BE + "/users/add", {
//       method: "POST", // or 'PUT'
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     onClose();
//     reset();
//   };

//   return (
//     <>
//       <Button onClick={onOpen}>Add User</Button>
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <ModalHeader>Create User</ModalHeader>
//             <ModalCloseButton />
//             <ModalBody pb={6}>
//               <FormControl>
//                 <FormLabel>Username</FormLabel>
//                 <Input placeholder="Username" {...register("username")} />
//               </FormControl>

//               <FormControl mt={4}>
//                 <FormLabel>Unique Code</FormLabel>
//                 <Input placeholder="444444" {...register("uniqueCode")} />
//               </FormControl>
//             </ModalBody>

//             <ModalFooter>
//               <Button colorScheme="blue" mr={3} type="submit">
//                 Create
//               </Button>
//               <Button onClick={onClose}>Cancel</Button>
//             </ModalFooter>
//           </form>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }




function DisableImpact() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const authId = useStoreState((state) => state.authId);

  const disableImpact = () => {
    fetch(`${process.env.REACT_APP_API_BE}/users/disable/impact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) {
        toast({
          title: "Impact Disabled",
          description: "Impact set to 0 for all users",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Impact not disabled",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      }
    });
  };
  return (
    <>
      <Button onClick={onOpen} colorScheme="red">Disable Impact Prediction</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="red">Disable Impact Prediction?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text fontSize="xl">
              Are you sure you want to disable impact prediction for all users?
            </Text>
            <Text color="red" fontSize="sm">
              Note: This is not reversible
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={disableImpact}>
              Disable
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
