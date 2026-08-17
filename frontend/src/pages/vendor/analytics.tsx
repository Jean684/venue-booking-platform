import { useEffect, useState } from "react";
import { Box, Grid, GridItem, Heading, Select, Spinner, Text } from "@chakra-ui/react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import { analyticsService } from "@/services/api";
import { AnalyticsRange, User, VendorAnalytics } from "@/types/types";
import VenueHirerTalliesBarChart from "@/components/features/analytics/VenueHirerTalliesBarChart";
import CombinedTalliesStackedBarChart from "@/components/features/analytics/CombinedTalliesStackedBarChart";
import HirerActivityPieChart from "@/components/features/analytics/HirerActivityPieChart";
import VenueUtilizationLineChart from "@/components/features/analytics/VenueUtilizationLineChart";

export default function VendorAnalyticsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [range, setRange] = useState<AnalyticsRange>("all-time");
    const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");

        if (!storedUser) {
        setError("You must be logged in to view analytics.");
        setLoading(false);
        return;
        }

        const parsedUser: User = JSON.parse(storedUser);

        if (parsedUser.role !== "vendor") {
        setError("Only vendors can view analytics.");
        setLoading(false);
        return;
        }

        setUser(parsedUser);
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await analyticsService.getVendorAnalytics(
            user.id,
            range
            );

            setAnalytics(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setError("Unable to load analytics.");
        } finally {
            setLoading(false);
        }
        };

        fetchAnalytics();
    }, [user, range]);

    return (
        <>
        <Header />

        <Grid templateColumns="repeat(8, 1fr)">
            <Sidebar />

            <GridItem colSpan={7} bg="#f3f3f3" minH="100vh" p={6}>
            <Heading as="h2" fontSize="5xl" color="#7a051d">
                Vendor Analytics
            </Heading>

            <Box mt={6} maxW="280px">
                <Text mb={2} fontWeight="semibold">
                Show analytics for
                </Text>

                <Select
                value={range}
                onChange={(event) =>
                    setRange(event.target.value as AnalyticsRange)
                }
                bg="white"
                >
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="all-time">All Time</option>
                </Select>
            </Box>

            {loading && (
                <Box mt={8}>
                <Spinner />
                </Box>
            )}

            {!loading && error && (
                <Text mt={8} color="red.500">
                {error}
                </Text>
            )}

            {!loading && analytics && (
                <Box mt={8}>
                    <Text fontSize="lg">
                        Venues owned: {analytics.venueCount}
                    </Text>

                    <Text fontSize="lg">
                        Accepted bookings: {analytics.acceptedBookingCount}
                    </Text>
                    
                    <Box mt={8}>
                        <VenueHirerTalliesBarChart
                            venueTallies={analytics.venueTallies}
                        />
                    </Box>

                    <Box mt={8}>
                        <CombinedTalliesStackedBarChart
                            combinedTallies={analytics.combinedTallies}
                        />
                    </Box>

                    <Box mt={8}>
                        <HirerActivityPieChart
                            hirerActivity={analytics.hirerActivity}
                            mostActiveHirer={analytics.mostActiveHirer}
                            leastActiveHirer={analytics.leastActiveHirer}
                        />
                    </Box>

                    <Box mt={8}>
                        <VenueUtilizationLineChart
                            utilizationTimeline={analytics.utilizationTimeline}
                        />
                    </Box>

                </Box>
            )}
            </GridItem>
        </Grid>
        </>
    );
}