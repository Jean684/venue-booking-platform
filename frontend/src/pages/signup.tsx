import { useState } from "react";
import { useRouter } from "next/router";
import { Select, useToast } from "@chakra-ui/react";
import { Box, Input, Button, FormControl, FormLabel, VStack, Text, Heading } from "@chakra-ui/react";

type UserRole = "vendor" | "hirer";

const SignUp = () => {
    const router = useRouter();
    const toast = useToast();

    // const [firstName, setFirstName] = useState("");
    // const [lastName, setLastName] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("hirer");
    const [phone, setPhone] = useState("");


    const validatePassword = (password: string) => {
        const hasMinLength = password.length >= 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            hasMinLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasSpecialChar
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {

        if (!fullName || !email || !password || !confirmPassword || !phone) {
            toast({
                title: "Missing fields",
                description: "Please fill in all the fields.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!email.includes("@")) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Passwords do not match",
                description: "Please ensure your passwords match.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (!validatePassword(password)) {
            toast({
                title: "Invalid password",
                description: "Password must be at least 6 characters long and contain uppercase, lowercase, and special characters.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        if (phone.length > 12) {
            toast({
                title: "Invalid phone number",
                description: "Phone number cannot exceed 12 characters.",
                status: "warning",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const newUser = {
            name: fullName,
            email,
            password,
            role,
            phone,
        };

        try {
            const response = await fetch("http://localhost:3001/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();
            //debugging logs
            console.log("Response from server:", data);

            if (!response.ok) {
                toast({
                    title: "Error creating account",
                    description: data.message || "Please check your details and try again.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,                
                });
                return;
            }

            toast({
                title: "Account created",
                description: "Your account has been created successfully. Please sign in.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });

            setTimeout(() => {
                router.push("/signin");
            }, 2000);

        } catch (error) {
            toast({
                title: "Network error",
                description: "Unable to connect to the server. Please try again later.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }

        //later, replace with actual API call
        //await.axios.post("/api/signup", newUser)

        // For now, we will just store the new user in localStorage
    //     const users = JSON.parse(localStorage.getItem("users") || "[]");
    //     const existingUsers = users.find((u: any) => u.email === email);


    //     if (existingUsers) {
    //       toast({
    //         title: "Account already exists.",
    //         description: "An account with this email already exists.",
    //         status: "error",
    //         duration: 5000,
    //         isClosable: true,
    //       });
    //       return;
    //     }

    //     const userToSave = {
    //       name: `${firstName} ${lastName}`,
    //       email,
    //       password,
    //       role,
    //       dateJoined: new Date().toISOString(),
    //     };

    //     localStorage.setItem("users", JSON.stringify([...users, userToSave]));

    //     toast({
    //       title: "Account created.",
    //       description: "Your account has been created successfully.",
    //       status: "success",
    //       duration: 5000,
    //       isClosable: true,
    //     });

    //     // Redirect to sign in page after successful sign up - change whole local storage set up to backend API call later
    //     router.push("/signin");
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
      <Box bg="white" p={8} borderRadius="lg" boxShadow="md" width="100%" maxW="760px">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="lg">Create Your VenueHub Account</Heading>
            <Text mt={2} color="gray.600" fontSize="sm" marginTop={2}>
              Join our community and start exploring amazing venues!
            </Text>
          </Box>

          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            <FormControl mb={4}>
                <FormLabel>Full Name</FormLabel>
                <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Account Type</FormLabel>
                <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="hirer">Hirer</option>
                <option value="vendor">Vendor</option>
                </Select>
            </FormControl>

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
                placeholder="Create your password"
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                Must include uppercase, lowercase, special character, and at least 6 characters.
                </Text>
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                />
            </FormControl>
          </Box>

          <Button
            color="white"
            bg="#b6465f"
            _activeLink={{ bg: "#7a051d", color: "white" }}
            _hover={{ bg: "#7a051d", color: "white" }}
            mt={4}
            width="100%"
            onClick={handleSubmit}
          >
            Sign Up
          </Button>

          <Text textAlign="center" fontSize="sm">
              Already have an account?{" "}
              <Text
                as="span"
                color="red.500"
                fontWeight="medium"
                cursor="pointer"
                onClick={() => router.push("/signin")}
              >
                Sign In
            </Text>
        </Text>
       </VStack>
      </Box>
    </Box>
  );
};

export default SignUp;