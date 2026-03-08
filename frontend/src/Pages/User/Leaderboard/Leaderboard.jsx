import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import { ApiError, apiRequest } from "../../../api/client";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function buildLeaderboardImage(rows, lastCompletedGame) {
  const columns = [
    { key: "position", label: "#", width: 80 },
    { key: "username", label: "Name", width: 320 },
    { key: "score", label: "Score", width: 250 },
    { key: "freeHitsRemaining", label: "FH", width: 120 },
    { key: "impactRemaining", label: "IMP", width: 120 },
    { key: "leavesRemaining", label: "L", width: 120 },
  ];

  const width = 1080;
  const topPadding = 230;
  const rowHeight = 56;
  const tableHeaderHeight = 56;
  const bottomPadding = 50;
  const height =
    topPadding + tableHeaderHeight + rows.length * rowHeight + bottomPadding;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = Math.max(height, 420);
  const ctx = canvas.getContext("2d");

  const bgGradient = ctx.createLinearGradient(0, 0, width, canvas.height);
  bgGradient.addColorStop(0, "#f8fbff");
  bgGradient.addColorStop(1, "#eef4ff");
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, canvas.height);

  ctx.fillStyle = "#1e3a8a";
  ctx.font = "bold 54px Arial";
  ctx.fillText("Prediction League T20", 56, 86);

  ctx.fillStyle = "#2563eb";
  ctx.font = "bold 36px Arial";
  ctx.fillText("Leaderboard Snapshot after Match " + lastCompletedGame, 56, 132);

  ctx.fillStyle = "#64748b";
  ctx.font = "24px Arial";
  const generatedOn = new Date().toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  ctx.fillText(`Generated on ${generatedOn} (IST)`, 56, 170);

  const tableX = 56;
  const tableY = 198;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  ctx.fillStyle = "#ffffff";
  drawRoundedRect(
    ctx,
    tableX,
    tableY - 2,
    tableWidth,
    tableHeaderHeight + rows.length * rowHeight + 4,
    18
  );
  ctx.fill();
  ctx.strokeStyle = "#cbd5e1";
  ctx.stroke();

  ctx.fillStyle = "#dbeafe";
  drawRoundedRect(ctx, tableX, tableY, tableWidth, tableHeaderHeight, 14);
  ctx.fill();

  let currentX = tableX;
  ctx.fillStyle = "#1e40af";
  ctx.font = "bold 24px Arial";
  columns.forEach((col) => {
    ctx.fillText(col.label, currentX + 16, tableY + 36);
    currentX += col.width;
  });

  rows.forEach((row, index) => {
    const y = tableY + tableHeaderHeight + index * rowHeight;
    const isEven = index % 2 === 0;
    ctx.fillStyle = row.isAdmin ? "#fef9c3" : isEven ? "#ffffff" : "#f8fafc";
    ctx.fillRect(tableX + 1, y, tableWidth - 2, rowHeight);

    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(tableX, y);
    ctx.lineTo(tableX + tableWidth, y);
    ctx.stroke();

    const values = [
      row.position,
      row.username || "-",
      Number(row.score || 0).toFixed(7),
      row.freeHitsRemaining,
      row.impactRemaining,
      row.leavesRemaining,
    ];

    let cellX = tableX;
    ctx.fillStyle = "#0f172a";
    ctx.font = "22px Arial";
    values.forEach((value, valueIndex) => {
      const text = String(value ?? "-");
      const limit = valueIndex === 1 ? 20 : valueIndex === 2 ? 12 : 8;
      const trimmed =
        text.length > limit ? `${text.slice(0, Math.max(limit - 1, 1))}...` : text;
      if (valueIndex === 0 && Number(value) <= 3) {
        const medal = Number(value) === 1 ? "🥇" : Number(value) === 2 ? "🥈" : "🥉";
        ctx.fillText(medal, cellX + 12, y + 36);
        ctx.fillText(trimmed, cellX + 44, y + 36);
      } else {
        ctx.fillText(trimmed, cellX + 16, y + 36);
      }
      cellX += columns[valueIndex].width;
    });
  });

  ctx.fillStyle = "#64748b";
  ctx.font = "18px Arial";
  ctx.fillText("prediction-league", 56, canvas.height - 18);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function Leaderboard() {
  const history = useHistory();
  const toast = useToast();

  const [games, setGames] = useState([]);
  const [completedGames, setCompletedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStrategies, setShowStrategies] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const cardBg = useColorModeValue("white", "gray.900");
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const tableHeadBg = useColorModeValue("gray.100", "gray.700");
  const adminRowBg = useColorModeValue("yellow.50", "yellow.900");

  const getLeaderboard = useCallback(() => {
    setIsLoading(true);
    apiRequest("/prediction/leaderboard")
      .then((data) => setGames(data))
      .catch((error) => {
        toast({
          title: "Could not load leaderboard",
          description:
            error instanceof ApiError ? error.message : "Please try again.",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  const getGames = async () => {
    setIsLoading(true);
    try {
      const completedGames = await apiRequest("/game/completed");
      let allTeamsFromResponse = new Set(["Show all"]);

      for (var game of completedGames) {
        allTeamsFromResponse.add(game.team1.fullName);
        allTeamsFromResponse.add(game.team2.fullName);
      }
      setCompletedGames(completedGames);
    } catch (error) {
      toast({
        title: "Could not load past games",
        description:
          error instanceof ApiError ? error.message : "Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeaderboard();
    getGames();
  }, [getLeaderboard]);

  const visibleRows = useMemo(
    () => games.filter((row) => (showStrategies ? true : !row.isAdmin)),
    [games, showStrategies]
  );

  const getLastCompletedGame = useMemo(() => {
    if (!completedGames || completedGames.length === 0) return null;
    let last = null;
    for (const game of completedGames) {
      if (game?.winner?.fullName) {
        if (!last || (game.gameNumber || 0) > (last.gameNumber || 0)) {
          last = game;
        }
      }
    }
    if (!last) return null;
    const num = last.gameNumber;
    const teamA = last.team1?.shortName || last.team1?.fullName || "-";
    const teamB = last.team2?.shortName || last.team2?.fullName || "-";
    return `${num} (${teamA} vs ${teamB})`;
  }, [completedGames]);

  const topPlayer = visibleRows[0];
  const avgScore =
    visibleRows.length > 0
      ? (
          visibleRows.reduce((sum, row) => sum + Number(row.score || 0), 0) /
          visibleRows.length
        ).toFixed(2)
      : "0.00";

  const handleShareImage = async () => {
    if (visibleRows.length === 0) return;
    setIsSharing(true);
    try {
      const blob = await buildLeaderboardImage(visibleRows, getLastCompletedGame);
      if (!blob) throw new Error("Could not create image");
      const file = new File([blob], "leaderboard.png", { type: "image/png" });
      const shareText = "Prediction League leaderboard update";

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Prediction League Leaderboard",
          text: shareText,
          files: [file],
        });
        return;
      }

      downloadBlob(blob, "leaderboard.png");
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          `${shareText} - sharing the image now`
        )}`,
        "_blank"
      );
      toast({
        title: "Image downloaded",
        description: "Upload the downloaded image in your WhatsApp group.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadImage = async () => {
    if (visibleRows.length === 0) return;
    try {
      const blob = await buildLeaderboardImage(visibleRows, getLastCompletedGame);
      if (!blob) throw new Error("Could not create image");
      downloadBlob(blob, "leaderboard.png");
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again.",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg={pageBg}>
      <Container maxW="6xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
        <Stack spacing={8}>
          <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack spacing={3}>
              <Button
                colorScheme="brand"
                borderRadius="10px"
                size="sm"
                variant="outline"
                onClick={() => history.push("/")}
              >
                <ArrowBackIcon></ArrowBackIcon>
              </Button>
              <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
                Leaderboard
              </Heading>
            </HStack>
            <HStack>
              {/* <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={() => setShowStrategies(!showStrategies)}
              >
                {showStrategies ? "Hide Strategies" : "Show Strategies"}
              </Button> */}
              <Button
                size="sm"
                colorScheme="green"
                onClick={handleShareImage}
                isLoading={isSharing}
              >
                Share as Image
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                onClick={handleDownloadImage}
                isDisabled={visibleRows.length === 0}
              >
                Download Image
              </Button>
            </HStack>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            <Stat
              bg={cardBg}
              p={4}
              borderRadius="xl"
              boxShadow="md"
            >
              <StatLabel>Players</StatLabel>
              <StatNumber>{visibleRows.length}</StatNumber>
            </Stat>
            <Stat
              bg={cardBg}
              p={4}
              borderRadius="xl"
              boxShadow="md"
            >
              <StatLabel>Top Player</StatLabel>
              <StatNumber fontSize="xl">{topPlayer?.username || "-"}</StatNumber>
            </Stat>
            <Stat
              bg={cardBg}
              p={4}
              borderRadius="xl"
              boxShadow="md"
            >
              <StatLabel>Average Score</StatLabel>
              <StatNumber>{avgScore}</StatNumber>
            </Stat>
          </SimpleGrid>

          <TableContainer
            bg={cardBg}
            borderRadius="xl"
            boxShadow="md"
            overflowX="auto"
          >
            <Table size="md" variant="simple">
              <Thead bg={tableHeadBg}>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Score</Th>
                  <Th>FH</Th>
                  <Th>IMP</Th>
                  <Th>L</Th>
                </Tr>
              </Thead>
              <Tbody>
                {visibleRows.map((row) => (
                  <Tr
                    key={`${row.position}-${row.username}`}
                    bg={
                      row.isAdmin ? adminRowBg : "transparent"
                    }
                  >
                    <Td fontWeight="semibold">{row.position}</Td>
                    <Td>
                      <HStack spacing={2}>
                        <Text>{row.username}</Text>
                        {row.isAdmin && <Tag size="sm">Strategy</Tag>}
                      </HStack>
                    </Td>
                    <Td>{Number(row.score || 0).toFixed(7)}</Td>
                    <Td>{row.freeHitsRemaining}</Td>
                    <Td>{row.impactRemaining}</Td>
                    <Td>{row.leavesRemaining}</Td>
                  </Tr>
                ))}
                {!isLoading && visibleRows.length === 0 && (
                  <Tr>
                    <Td colSpan={6}>No leaderboard data available</Td>
                  </Tr>
                )}
                {isLoading && (
                  <Tr>
                    <Td colSpan={6}>Loading leaderboard...</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </Box>
  );
}

export default Leaderboard;
