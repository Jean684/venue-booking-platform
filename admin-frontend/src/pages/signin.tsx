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
import { userService } from "@/services/api";

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
      const response = await userService.login(email, password)
      const user = response.user;
      if (!user) {
        toast({
          title: "Sign in failed",
          description: "Please check your email and password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log(user)
      toast({
        title: "Sign in successful",
        description: `Welcome ${user.name || user.email}`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      if (user.role === "admin") {
        router.push("/admin/dashboard");
      }
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
            <Heading size="lg">Welcome Back to Admin Dashboard!</Heading>
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
        </VStack>
      </Box>
    </Box>
  );
};

export default SignIn;