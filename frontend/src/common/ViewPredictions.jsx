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
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/table";
import { useEffect, useState } from "react";

function ViewPredictions({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!gameId || !isOpen) return;
    fetch(`http://localhost:8000/prediction/game/${gameId}`).then(
      async (response) => {
        if (response.ok) setPredictions(await response.json());
      }
    );
  }, [gameId, isOpen]);

  return (
    <>
      <Button onClick={onOpen}>View</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Predictions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>user id</Th>
                  <Th>username</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Thead>
              <Tbody>
                {predictions.map((record) => {
                  return (
                    <Tr>
                      <Td>{record.userId}</Td>
                      <Td>{record.username}</Td>
                      <Td>
                        {" "}
                        {record.prediction.map((rec) => (
                          <p>{`${rec.predictedTeam} - ${rec.confidence} - ${
                            rec.isConsidered ? "Yes" : "No"
                          }`}</p>
                        ))}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>user id</Th>
                  <Th>username</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Tfoot>
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
