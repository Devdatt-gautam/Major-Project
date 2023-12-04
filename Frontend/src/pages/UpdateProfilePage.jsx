import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom";
import usePreviewImg from "../../hooks/usePreviewImg";
import useShowToast from "../../hooks/useShowToast";
const UpdateProfilePage = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const fileRef = useRef(null);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();
  const [input, setInput] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });
  const [updating, setUpdating] = useState(false);
  // console.log(user);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) {
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ ...input, profilePic: imgUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(JSON.parse(localStorage.getItem("user-threads")));
      console.log(data);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"} my={6}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="John Doe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInput({ ...input, name: e.target.value })}
              value={input.name}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="johndoe"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInput({ ...input, username: e.target.value })}
              value={input.username}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              onChange={(e) => setInput({ ...input, email: e.target.value })}
              value={input.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              value={input.bio}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              onChange={(e) => setInput({ ...input, password: e.target.value })}
              value={input.password}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;
