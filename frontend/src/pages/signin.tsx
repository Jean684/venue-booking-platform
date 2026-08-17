import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
  Heading,
  useToast,
} from "@chakra-ui/react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill in both email and password.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Sign in failed",
          description: data.message || "Please check your email and password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(data.user));

      toast({
        title: "Sign in successful",
        description: `Welcome ${data.user.name || data.user.email}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setTimeout(() => {
        if (data.user.role === "vendor") {
          router.push("/vendor/dashboard");
        } else if (data.user.role === "hirer") {
          router.push("/hirer");
        }
      }, 1000);
    } catch (error) {
      console.error("Sign in error:", error);

      toast({
        title: "Network error",
        description: "Unable to connect to the server. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage={
        "https://images.unsplash.com/photo-1554230561-b04b0394d4ef?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
      bgPos="center"
      bgRepeat="no-repeat"
      backgroundSize="cover"
    >
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md" width="100%" maxW="400px">
        <VStack spacing={6} align="center">
          <Box textAlign="center">
            <Heading size="lg">Welcome Back to VenueHub!</Heading>
          </Box>

          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>

          <Button
            color="white"
            bg="#b6465f"
            _activeLink={{ bg: "#7a051d", color: "white" }}
            _hover={{ bg: "#7a051d", color: "white" }}
            mt={4}
            width="100%"
            onClick={handleSubmit}
          >
            Sign In
          </Button>

          <Text textAlign="center" fontSize="sm">
            Don't have an account?{" "}
            <Text
              as="span"
              color="red.500"
              fontWeight="medium"
              cursor="pointer"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Text>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignIn;