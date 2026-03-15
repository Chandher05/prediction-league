import { Box, Container, Heading, VStack, HStack, Button, Select, FormControl, FormLabel, useToast, Checkbox, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Spinner, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { apiRequest } from "../../../api/client";
import DateTime from "luxon/src/datetime";

export default function CricAPI() {
  const [series, setSeries] = useState([]);
  const [selected, setSelected] = useState("");
  const toast = useToast();
  const history = useHistory();
  const [games, setGames] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState(new Set());
  const [loadingGames, setLoadingGames] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    apiRequest("/cricapi/series-id")
      .then((data) => {
        setSeries(data.series || []);
      })
      .catch(() => setSeries([]));
  }, []);

  // Derived values for select-all checkbox
  const selectableIds = games.filter((g) => !g.inDB).map((g) => g.matchId);
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedMatches.has(id));
  const someSelected = selectableIds.some((id) => selectedMatches.has(id));
  const isIndeterminate = someSelected && !allSelected;

  const handleSelectAll = (checked) => {
    const next = new Set(selectedMatches);
    if (checked) selectableIds.forEach((id) => next.add(id));
    else selectableIds.forEach((id) => next.delete(id));
    setSelectedMatches(next);
  };

  return (
    <Box minH="100vh">
      <Container maxW="4xl" py={8}>
        <VStack alignItems="flex-start" spacing={6}>
        
          <HStack spacing={4} w="full">
            <Heading size="lg">Cric API</Heading>
            <Button onClick={() => history.push('/admin/Games')}>Back to Games</Button>
          </HStack>
          <HStack spacing={2} flexWrap="wrap">
            <FormControl>
              <FormLabel>Series</FormLabel>
              <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select series</option>
                {series.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Series ID</FormLabel>
              <Input
                placeholder="Enter or edit series id"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
              />
            </FormControl>
          </HStack>
          <HStack spacing={2} flexWrap="wrap">
            <Button
              colorScheme="blue"
              isLoading={loadingGames}
              onClick={async () => {
                // get games for series
                if (!selected) {
                  toast({ title: 'Select a series first', status: 'warning', duration: 3000 });
                  return;
                }
                setLoadingGames(true);
                setGames([]);
                setSelectedMatches(new Set());
                try {
                  const data = await apiRequest(`/cricapi/get-games?seriesId=${selected}`);
                  const list = data.games || [];
                  setGames(list);
                  toast({ title: `Fetched ${list.length} games`, status: 'success', duration: 3000 });
                } catch (err) {
                  toast({ title: 'Failed to fetch games', status: 'error', duration: 4000 });
                } finally {
                  setLoadingGames(false);
                }
              }}
            >
              Get Games
            </Button>
            <Button
              colorScheme="teal"
              onClick={async () => {
                // validate teams (existing button)
                if (!selected) {
                  toast({ title: 'Select a series first', status: 'warning', duration: 3000 });
                  return;
                }
                try {
                  await apiRequest('/cricapi/validate-and-add', {
                    method: 'POST',
                    body: { seriesId: selected },
                  });
                  toast({ title: 'Validation successful', status: 'success', duration: 3000 });
                } catch (err) {
                  toast({ title: 'Validation failed', status: 'error', duration: 4000 });
                }
              }}
            >
              Validate and Add Teams
            </Button>
            {/* Add Selected Games button moved below table — shows when selections exist */}
          </HStack>
          {(loadingGames || adding) && (
            <Box mt={4} w="full" p={8} borderRadius="md" boxShadow="sm" textAlign="center">
              <Spinner size="lg" />
            </Box>
          )}

          {games.length > 0 && !loadingGames && !adding && (
            <Box mt={4} w="full" p={4} borderRadius="md" boxShadow="sm">
              <TableContainer mt={3}>
                <Table variant="simple" size="sm">
                  <Thead bg="gray.700">
                    <Tr>
                      <Th>
                        <Checkbox
                          isChecked={allSelected}
                          isIndeterminate={isIndeterminate}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          isDisabled={selectableIds.length === 0}
                        />
                      </Th>
                      <Th>No.</Th>
                      <Th>Team 1</Th>
                      <Th>Team 2</Th>
                      <Th>Start Time</Th>
                      <Th>In DB</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {games.map((g) => (
                      <Tr key={g.matchId}>
                        <Td>
                          <Checkbox
                            isChecked={selectedMatches.has(g.matchId)}
                            isDisabled={g.inDB}
                            onChange={(e) => {
                              const next = new Set(selectedMatches);
                              if (e.target.checked) next.add(g.matchId);
                              else next.delete(g.matchId);
                              setSelectedMatches(next);
                            }}
                          />
                        </Td>
                        <Td fontWeight="semibold">{g.gameNumber || "-"}</Td>
                        <Td>{g.team1}</Td>
                        <Td>{g.team2}</Td>
                        <Td>
                          {g.startTime
                            ? DateTime.fromISO(g.startTime, { zone: "utc" }).toLocal().toLocaleString(DateTime.DATETIME_SHORT)
                            : "-"}
                        </Td>
                        <Td>{g.inDB ? "Yes" : "No"}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              {selectedMatches.size > 0 && (
                <HStack mt={4} justify="flex-end">
                  <Button
                    colorScheme="green"
                    isLoading={adding}
                    onClick={async () => {
                      if (!selected) {
                        toast({ title: 'Select a series first', status: 'warning', duration: 3000 });
                        return;
                      }
                      const ids = Array.from(selectedMatches);
                      if (ids.length === 0) {
                        toast({ title: 'Select at least one game to add', status: 'warning', duration: 3000 });
                        return;
                      }
                      setAdding(true);
                      try {
                        await apiRequest('/cricapi/add-games', {
                          method: 'POST',
                          body: { seriesId: selected, matchIds: ids },
                        });
                        toast({ title: 'Add games succeeded', status: 'success', duration: 4000 });
                        setSelectedMatches(new Set());
                        // refresh games
                        try {
                          const refreshed = await apiRequest(`/cricapi/get-games?seriesId=${selected}`);
                          setGames(refreshed.games || []);
                        } catch (e) {}
                      } catch (err) {
                        toast({ title: 'Add games failed', status: 'error', duration: 5000 });
                      } finally {
                        setAdding(false);
                      }
                    }}
                  >
                    Add Selected Games
                  </Button>
                </HStack>
              )}
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
