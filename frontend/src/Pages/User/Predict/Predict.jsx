import React, { useEffect, useState } from "react";
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Select,
	Stack,
	useColorModeValue,
	useToast,
	HStack,
	Image,
	Text,
	Box
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useStoreState } from "easy-peasy";

export default function Predict() {
	const history = useHistory();
	const toast = useToast();
	let { id } = useParams();

	const [games, setGames] = useState([]);
	const [showConfidence, setConfidence] = useState(true);
	const [selected, setSelected] = useState({});
	const [predictedTeamId, setPredictedTeamId] = useState({});
	const { register, handleSubmit } = useForm();
	const authId = useStoreState((state) => state.authId);
	const userName = useStoreState((state) => state.userName);
	const photoURL = useStoreState((state) => state.photoURL);

	useEffect(() => {
		const getGames = () => {

			if (id) {
				fetch(process.env.REACT_APP_API + `/game/id/${id}`, {
					headers: {
						Authorization: `Bearer ${authId}`,
					},
				}).then(async (response) => {
					if (response.ok) {
						const res = await response.json();
						setGames([res]);
						if (res) setSelected(res);
					}
				});
			} else {
				fetch(process.env.REACT_APP_API + "/game/scheduled", {
					headers: {
						Authorization: `Bearer ${authId}`,
					},
				}).then(async (response) => {
					if (response.ok) {
						const games = await response.json();
						setGames(games);
						if (games[0]) setSelected(games[0]);
					}
				});
			}
		};
		getGames();
	}, [id, authId]);
	const onSubmit = (data) => {
		data["gameId"] = selected?.gameId;
		data["predictedTeamId"] = selected ? predictedTeamId : "";
		data["confidence"] = showConfidence ? data["confidence"] : "L"
		fetch(process.env.REACT_APP_API + "/prediction/new", {
			method: "POST", // or 'PUT'
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${authId}`,
			},
			body: JSON.stringify(data),
		})
			.then((response) => {
				if (response.ok) {
					return response;
				}
				throw response;
			})
			.then((data) => {
				toast({
					title: "You have predicted the future",
					description: "Hopefully it is the right future",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				history.push("/");
			})
			.catch((e) => {
				toast({
					title: "Something went wrong.",
					// Custom error message from server
					description:
						"Please try again or contact us for help if the issue persists.",
					status: "error",
					duration: 2000,
					isClosable: true,
				});
			});
	};
	const predictionForGame = (value) => {
		if (value === "Leave") {
			setConfidence(false);
			setPredictedTeamId(null);
		} else {
			setConfidence(true);
			setPredictedTeamId(value);
		}
	};

	const updateSelected = (game) => {

		if (game.gameId != selected.gameId) {
			setSelected(game)
			setConfidence(true);
			setPredictedTeamId(null);
		}

	}
	return (
		<Flex
			minH={"100vh"}
			align={"center"}
			justify={"center"}
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"md"}
				bg={useColorModeValue("white", "gray.700")}
				rounded={"xl"}
				boxShadow={"lg"}
				p={6}
				my={12}
			>
				<HStack>
					<Button
						colorScheme="blue"
						borderRadius="10px"
						size="sm"
						onClick={() => history.push("/")}
					>
						<ArrowBackIcon></ArrowBackIcon>
					</Button>
					<Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
						Enter your prediction
					</Heading>
				</HStack>

				<HStack justifyContent='center'>
					<Image boxSize='40px' borderRadius='full' src={photoURL} alt='Profile photo' />
					<Text fontSize='25px'>{userName}</Text>
				</HStack>

				<form onSubmit={handleSubmit(onSubmit)}>
					<HStack>
						{games.map((game, index) => {
							return (
								<Button bg={selected.gameId == game.gameId ? 'blue.500' : 'blue.200'} w='100%' p={4} color='white' onClick={() => updateSelected(game)}>
									Game {game.gameNumber} - {game.team1.shortName} v{" "}
									{game.team2.shortName}{" "}
								</Button>
							);
						})}
					</HStack>

					{
						selected.team1 && selected.team2 ?
							<HStack justifyContent='center'>
								<Image
									onClick={() => predictionForGame(selected.team1._id)}
									src={`${process.env.PUBLIC_URL}/Logo/${selected.team1.shortName}${selected.team1._id == predictedTeamId ? " - Selected" : ""}.png`}
									alt={selected.team1.shortName}
								/>

								<Image
									onClick={() => predictionForGame(selected.team2._id)}
									src={`${process.env.PUBLIC_URL}/Logo/${selected.team2.shortName}${selected.team2._id == predictedTeamId ? " - Selected" : ""}.png`}
									alt={selected.team2.shortName}
								/>

								<Image
									onClick={() => predictionForGame("Leave")}
									src={`${process.env.PUBLIC_URL}/Logo/Leave${showConfidence ? "" : " - Selected"}.png`}
									alt={selected.team2.shortName}
								/>
							</HStack> :
							null
					}



					{/* {showConfidence && ( */}
						<FormControl>
							<FormLabel>Confidence</FormLabel>
							<Input
								pattern="^(5[1-9]|[6-9][0-9]|100|FH|L)$"
								{...register("confidence")}
								disabled={!showConfidence}
								placeholder="51 - 100 or FH or L"
							/>
						</FormControl>
					{/* )} */}

					<Stack spacing={6} mt={5}>
						<Button
							bg={"blue.400"}
							color={"white"}
							_hover={{
								bg: "blue.500",
							}}
							type="submit"
						>
							Submit
						</Button>
					</Stack>
				</form>
			</Stack>
		</Flex>
	);
}
