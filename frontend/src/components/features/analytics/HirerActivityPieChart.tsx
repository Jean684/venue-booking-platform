import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { HirerTally } from "@/types/types";

interface HirerActivityPieChartProps {
  hirerActivity: HirerTally[];
  mostActiveHirer: HirerTally | null;
  leastActiveHirer: HirerTally | null;
}

const CHART_COLORS = [
  "#7a051d",
  "#b6465f",
  "#d97791",
  "#6b7280",
  "#9f1239",
  "#be123c",
];

export default function HirerActivityPieChart({
  hirerActivity,
  mostActiveHirer,
  leastActiveHirer,
}: HirerActivityPieChartProps) {
  if (hirerActivity.length === 0) {
    return (
      <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
        <Heading as="h3" fontSize="xl" mb={2}>
          Active Hirers
        </Heading>

        <Text color="gray.600">
          There are no active hirers for the selected time range.
        </Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" p={6} boxShadow="sm">
      <Heading as="h3" fontSize="xl" mb={2}>
        Active Hirers
      </Heading>

      <Text color="gray.600" mb={5}>
        Compare each hirer&apos;s share of accepted bookings.
      </Text>

      <Flex gap={8} direction={{ base: "column", lg: "row" }}>
        <Box width={{ base: "100%", lg: "65%" }} height="360px">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hirerActivity}
                dataKey="tally"
                nameKey="hirerName"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={({ name, value }) =>
                  `${name}: ${value}`
                }
              >
                {hirerActivity.map((hirer, index) => (
                  <Cell
                    key={hirer.hirerId}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box flex="1">
          <Box
            bg="#f3f3f3"
            borderRadius="md"
            p={4}
            mb={4}
          >
            <Text fontWeight="bold" color="#7a051d">
              Most Active Hirer
            </Text>

            <Text mt={2}>
              {mostActiveHirer
                ? `${mostActiveHirer.hirerName}: ${mostActiveHirer.tally} accepted bookings`
                : "No active hirers"}
            </Text>
          </Box>

          <Box
            bg="#f3f3f3"
            borderRadius="md"
            p={4}
          >
            <Text fontWeight="bold" color="#7a051d">
              Least Active Hirer
            </Text>

            <Text mt={2}>
              {leastActiveHirer
                ? `${leastActiveHirer.hirerName}: ${leastActiveHirer.tally} accepted bookings`
                : "No active hirers"}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}