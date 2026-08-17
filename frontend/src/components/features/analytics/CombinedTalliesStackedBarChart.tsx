import { useMemo } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CombinedTally } from "@/types/types";

interface CombinedTalliesStackedBarChartProps {
  combinedTallies: CombinedTally[];
}

const CHART_COLORS = [
  "#7a051d",
  "#b6465f",
  "#d97791",
  "#6b7280",
  "#9f1239",
  "#be123c",
];

export default function CombinedTalliesStackedBarChart({
  combinedTallies,
}: CombinedTalliesStackedBarChartProps) {
  const venues = useMemo(() => {
    const venueMap = new Map<string, string>();

    combinedTallies.forEach((item) => {
      venueMap.set(item.venueId, item.venueName);
    });

    return Array.from(venueMap.entries()).map(([venueId, venueName]) => ({
      venueId,
      venueName,
    }));
  }, [combinedTallies]);

  const chartData = useMemo(() => {
    const hirerMap = new Map<
      string,
      Record<string, string | number>
    >();

    combinedTallies.forEach((item) => {
      if (!hirerMap.has(item.hirerId)) {
        const newHirer: Record<string, string | number> = {
          hirerName: item.hirerName,
        };

        venues.forEach((venue) => {
          newHirer[venue.venueId] = 0;
        });

        hirerMap.set(item.hirerId, newHirer);
      }

      const hirer = hirerMap.get(item.hirerId);

      if (hirer) {
        hirer[item.venueId] = item.tally;
      }
    });

    return Array.from(hirerMap.values());
  }, [combinedTallies, venues]);

  if (combinedTallies.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
        <Heading as="h3" fontSize="xl" mb={2}>
          Combined Accepted Bookings by Hirer
        </Heading>

        <Text color="gray.600">
          There are no accepted bookings for the selected time range.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
      <Heading as="h3" fontSize="xl" mb={2}>
        Combined Accepted Bookings by Hirer
      </Heading>

      <Text color="gray.600" mb={5}>
        View each hirer&apos;s total accepted bookings, divided by venue.
      </Text>

      <Box width="100%" height="360px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="hirerName" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Legend />

            {venues.map((venue, index) => (
              <Bar
                key={venue.venueId}
                dataKey={venue.venueId}
                name={venue.venueName}
                stackId="accepted-bookings"
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}