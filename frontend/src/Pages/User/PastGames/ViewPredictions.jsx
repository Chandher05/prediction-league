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
                  <Th>name</Th>
                  <Th>Team</Th>
                  <Th>Prediction</Th>
                </Tr>
              </Thead>
              {
                predictions && predictions.length > 0?
                <Tbody>
                  {
                    predictions.map((record) => {

                      return record.prediction.map((rec) => {

                        if (rec.isConsidered) {
                          return (
                            <Tr>
                              <Td>{record.username}</Td>
                              <Td>{rec.predictedTeam}</Td>
                              <Td>{rec.confidence}</Td>
                            </Tr>
                          )
                        }
                        else {
                          return ""
                        }
                    })
                  })
                  }
                </Tbody>:
                <Tbody>
                  <Tr>
                    <Td>-</Td>
                    <Td>-</Td>
                    <Td>-</Td>
                  </Tr>
                </Tbody>
              }
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
