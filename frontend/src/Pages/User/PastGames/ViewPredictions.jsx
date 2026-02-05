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
import { useToast } from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useStoreState } from "easy-peasy";
import { useEffect, useState } from "react";
import { apiRequest } from "../../../api/client";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function buildPredictionsImage(predictions) {
  const width = 1080;
  const rowHeight = 52;
  const tableHeaderHeight = 54;
  const top = 170;
  const bottom = 40;
  const height = Math.max(top + tableHeaderHeight + predictions.length * rowHeight + bottom, 360);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#1e40af";
  ctx.font = "bold 48px Arial";
  ctx.fillText("Past Game Predictions", 56, 82);
  ctx.fillStyle = "#64748b";
  ctx.font = "24px Arial";
  ctx.fillText(`Generated on ${new Date().toLocaleString()}`, 56, 120);

  const tableX = 56;
  const tableY = 146;
  const columns = [
    { label: "Name", width: 420 },
    { label: "Team", width: 380 },
    { label: "Prediction", width: 220 },
  ];
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  ctx.fillStyle = "#dbeafe";
  ctx.fillRect(tableX, tableY, tableWidth, tableHeaderHeight);
  ctx.strokeStyle = "#bfdbfe";
  ctx.strokeRect(tableX, tableY, tableWidth, tableHeaderHeight + predictions.length * rowHeight);

  let x = tableX;
  ctx.fillStyle = "#1e3a8a";
  ctx.font = "bold 24px Arial";
  columns.forEach((c) => {
    ctx.fillText(c.label, x + 16, tableY + 35);
    x += c.width;
  });

  predictions.forEach((p, index) => {
    const y = tableY + tableHeaderHeight + index * rowHeight;
    ctx.fillStyle = index % 2 === 0 ? "#ffffff" : "#f8fafc";
    ctx.fillRect(tableX, y, tableWidth, rowHeight);
    ctx.strokeStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(tableX, y);
    ctx.lineTo(tableX + tableWidth, y);
    ctx.stroke();

    const vals = [
      p.username || "-",
      p.prediction?.predictedTeam?.fullName || "-",
      `${p.prediction?.confidence || "-"}${p.prediction?.isImpact ? " - IMP" : ""}`,
    ];

    let cx = tableX;
    ctx.fillStyle = "#0f172a";
    ctx.font = "22px Arial";
    vals.forEach((v, i) => {
      const txt = String(v);
      const limit = i === 0 ? 24 : 20;
      const trimmed = txt.length > limit ? `${txt.slice(0, limit - 1)}...` : txt;
      ctx.fillText(trimmed, cx + 16, y + 34);
      cx += columns[i].width;
    });
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

function ViewPredictions({ gameId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [predictions, setPredictions] = useState([]);
  const [isSharing, setIsSharing] = useState(false);
  const authId = useStoreState((state) => state.authId);

  useEffect(() => {
    if (!gameId || !isOpen) return;
    apiRequest(`/prediction/sorted/game/${gameId}`)
      .then((data) => setPredictions(data))
      .catch(() => setPredictions([]));
  }, [gameId, isOpen, authId]);

  const sharePredictions = async () => {
    if (!predictions.length) return;
    setIsSharing(true);
    try {
      const blob = await buildPredictionsImage(predictions);
      if (!blob) throw new Error("image generation failed");
      const file = new File([blob], `past-game-${gameId}-predictions.png`, {
        type: "image/png",
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "Past Game Predictions",
          text: "Prediction League - past game predictions",
          files: [file],
        });
      } else {
        downloadBlob(file, `past-game-${gameId}-predictions.png`);
        window.open(
          `https://wa.me/?text=${encodeURIComponent(
            "Prediction League past game predictions"
          )}`,
          "_blank"
        );
        toast({
          title: "Image downloaded",
          description: "Upload it in your WhatsApp group.",
          status: "info",
          duration: 2500,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Please try again.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setIsSharing(false);
    }
  };

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
                        <Td>{`${record.prediction.confidence}${record.prediction.isImpact ? " - IMP" : ""}`}</Td>
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
            <Button
              variant="outline"
              mr={3}
              onClick={sharePredictions}
              isLoading={isSharing}
              isDisabled={!predictions.length}
            >
              Share as Image
            </Button>
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
