import { Box, Heading, Text } from "@chakra-ui/react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { UtilizationPoint } from "@/types/types";

interface VenueUtilizationLineChartProps {
  utilizationTimeline: UtilizationPoint[];
}

export default function VenueUtilizationLineChart({
  utilizationTimeline,
}: VenueUtilizationLineChartProps) {
  if (utilizationTimeline.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
        <Heading as="h3" fontSize="xl" mb={2}>
          Overall Venue Utilization
        </Heading>

        <Text color="gray.600">
          There is no utilization data for the selected time range.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
      <Heading as="h3" fontSize="xl" mb={2}>
        Overall Venue Utilization
      </Heading>

      <Text color="gray.600" mb={5}>
        This chart shows the percentage of your venues being utilized at
        each point in time.
      </Text>

      <Box width="100%" height="360px">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={utilizationTimeline}
            margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(date: string) => date.slice(5)}
              angle={-15}
              textAnchor="end"
              height={60}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value: number) => `${value}%`}
            />

            <Tooltip
              labelFormatter={(label) => `Date: ${String(label)}`}
              formatter={(value) => [
                `${String(value)}%`,
                "Venue utilization",
              ]}
            />

            <Line
              type="monotone"
              dataKey="utilizationPercentage"
              name="Venue utilization"
              stroke="#7a051d"
              strokeWidth={3}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}