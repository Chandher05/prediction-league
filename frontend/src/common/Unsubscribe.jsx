import { Center, VStack, Heading, useToast, Button } from "@chakra-ui/react";
import { useStoreState } from "easy-peasy";

import React, { useEffect } from "react";

function Unsubscribe() {
  const authId = useStoreState((state) => state.authId);
  const toast = useToast();
  // const [nextGame, setNextGame] = useState(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_BE + "/users/unsubscribe", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authId}`,
      },
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
  }, [authId, toast]);

  const resubscribe = () => {
    fetch(process.env.REACT_APP_API_BE + "/users/resubscribe", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authId}`,
      },
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
