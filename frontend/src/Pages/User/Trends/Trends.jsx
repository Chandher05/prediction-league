import {
  Spinner,
  Center,
  Box,
  Text,
  HStack,
  Button,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router";

function Trends() {
  const history = useHistory();
  const [graphData, setGraphData] = useState({});
  const [loaded, setLoaded] = useState(false);

  function getRandomColor() {

    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  const getLeaderboard = () => {
    fetch(process.env.REACT_APP_API + "/prediction/graph").then(
      async (response) => {
        if (response.ok) {
          const res = await response.json();
          const datasets = [];
          for (let key in res.userScores) {
            let randomCol = getRandomColor();
            datasets.push({
              label: res.userScores[key].username,
              data: res.userScores[key].scores,
              pointBorderColor: randomCol,
              pointBackgroundColor: randomCol,
              backgroundColor: randomCol,
              borderColor: randomCol,
            });
          }
          console.log(datasets);
          setGraphData({
            labels: res.gameNumbers,
            datasets: datasets,
          });
          setLoaded(true);
        }
      }
    );
  };
  const options = {
    plugins: {
      tooltip: {
        mode: "nearest",
        intersect: true,
      },
    },
    scales: {
      y: {
        position: "left",
        reverse: true,
      },
    },
  };
  useEffect(() => {
    getLeaderboard();
  }, []);

  return loaded ? (
    <Box p="5"
    w="100%"
    justify={"center"}
    >
      <HStack spacing={3} alignItems="justify-center" >
        <Button
          colorScheme="orange"
          borderRadius="10px"
          size="sm"
          onClick={() => history.push("/")}
        >
          <ArrowBackIcon></ArrowBackIcon>
        </Button>
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
          Trends
        </Heading>
      </HStack>
      <Text fontSize="2xl" color="orange.600">
        {" "}
        Best to be viewed on bigger screens.
      </Text>
      <Line data={graphData} options={options} />
    </Box>
  ) : (
    <Center h="100vh">
      <Spinner thickness="4px" color="orange.500" size="xl" />
    </Center>
  );
}

export default Trends;
