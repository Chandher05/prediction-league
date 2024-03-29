import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";

function ViewPredictions({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [predictions, setPredictions] = useState([]);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    if (!gameId || !isOpen) return;
    fetch(`${process.env.REACT_APP_API_BE}/prediction/sorted/game/${gameId}`, {
      headers: {
        Authorization: `Bearer ${authId}`,
      },
    }).then(async (response) => {
      if (response.ok) setPredictions(await response.json());
    });
  }, [gameId, isOpen, authId]);

  return (
    <>
      <Button onClick={onOpen} size="sm">
        View
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Predictions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table colorScheme="teal" size="sm">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>Team</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Thead>
              {predictions && predictions.length > 0 ? (
                <Tbody>
                  {predictions.map((record, index) => {
                    return (
                      <Tr
                        key={record.index}
                        bg={record.prediction.predictedTeam.colorCode}
                        textColor="white"
                      >
                        <Td>{record.username}</Td>
                        <Td>{record.prediction.predictedTeam.fullName}</Td>
                        <Td>{record.prediction.confidence}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              ) : (
                <Tbody>
                  <Tr>
                    <Td>-</Td>
                    <Td>-</Td>
                    <Td>-</Td>
                  </Tr>
                </Tbody>
              )}
            </Table>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ViewPredictions;
