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
import { VenueTally } from "@/types/types";

interface VenueHirerTalliesBarChartProps {
  venueTallies: VenueTally[];
}

const CHART_COLORS = [
  "#7a051d",
  "#b6465f",
  "#d97791",
  "#6b7280",
  "#9f1239",
  "#be123c",
];

export default function VenueHirerTalliesBarChart({
  venueTallies,
}: VenueHirerTalliesBarChartProps) {
  const hirers = useMemo(() => {
    const hirerMap = new Map<string, string>();

    venueTallies.forEach((venue) => {
      venue.hirers.forEach((hirer: { hirerId: string; hirerName: string; }) => {
        hirerMap.set(hirer.hirerId, hirer.hirerName);
      });
    });

    return Array.from(hirerMap.entries()).map(([hirerId, hirerName]) => ({
      hirerId,
      hirerName,
    }));
  }, [venueTallies]);

  const chartData = useMemo(() => {
    return venueTallies.map((venue) => {
      const venueData: Record<string, string | number> = {
        venueName: venue.venueName,
      };

      hirers.forEach((hirer) => {
        venueData[hirer.hirerId] = 0;
      });

      venue.hirers.forEach((hirer) => {
        venueData[hirer.hirerId] = hirer.tally;
      });

      return venueData;
    });
  }, [venueTallies, hirers]);

  if (hirers.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
        <Heading as="h3" fontSize="xl" mb={2}>
          Accepted Bookings by Venue and Hirer
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
        Accepted Bookings by Venue and Hirer
      </Heading>

      <Text color="gray.600" mb={5}>
        Compare how many accepted bookings each hirer has made across your
        venues.
      </Text>

      <Box width="100%" height="360px">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="venueName"
              interval={0}
              angle={-15}
              textAnchor="end"
              height={65}
            />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Legend />

            {hirers.map((hirer, index) => (
              <Bar
                key={hirer.hirerId}
                dataKey={hirer.hirerId}
                name={hirer.hirerName}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}