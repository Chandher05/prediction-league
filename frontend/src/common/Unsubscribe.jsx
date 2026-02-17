import { Center, VStack, Heading, useToast, Button } from "@chakra-ui/react";
import { apiRequest } from "../api/client";

import React, { useEffect } from "react";

function Unsubscribe() {
  const toast = useToast();
  // const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    apiRequest("/users/unsubscribe", {
      method: "PUT",
    })
      .then(() => {
        toast({
          title: "Unsubscribed",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((e) => {
        toast({
          title: "Error occured while unsubscribing",
          description:
            "Please try again or contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  }, [toast]);

  const resubscribe = () => {
    apiRequest("/users/resubscribe", {
      method: "PUT",
    })
      .then(() => {
        toast({
          title: "Resubscribed",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((e) => {
        toast({
          title: "Error occured while resubscribing",
          description:
            "Please try again or contact us for help if the issue persists.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <Center>
      <VStack>
        <Heading p="25">Unsubscribed by mistake?</Heading>
        <Button p="25" onClick={() => resubscribe()}>
          Resubscribe
        </Button>
      </VStack>
    </Center>
  );
}

export default Unsubscribe;
