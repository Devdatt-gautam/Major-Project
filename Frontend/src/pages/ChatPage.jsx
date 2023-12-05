import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  useColorModeValue,
  SkeletonCircle,
  Skeleton,
} from "@chakra-ui/react";
// import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "./../components/MessageContainer";

const ChatPage = () => {
  return (
    <Box
      position={"absolute"}
      left={"50%"}
      transform={"translateX(-50%) "}
      p={4}
      width={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          flexDirection={"column"}
          gap={2}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for a user" />
              <Button size="sm">
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {false &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex flexDirection={"column"} w="full" gap={3}>
                  <Skeleton h="10px" w="80px" />
                  <Skeleton h="8px" w="90%" />
                </Flex>
              </Flex>
            ))}
          <Conversation />
          <Conversation />
          <Conversation />
        </Flex>

        {/* <Flex
          flex={70}
          flexDir={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          p={2}
          height={"400px"}
          borderRadius={"md"}
        >
          <GiConversation size={100} />
          <Text>Select a conversation to start messaging</Text>
        </Flex> */}
        <MessageContainer />
      </Flex>
    </Box>
  );
};

export default ChatPage;
