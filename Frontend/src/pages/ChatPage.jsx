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
import { GiConversation } from "react-icons/gi";
import Conversation from "../components/Conversation";
import MessageContainer from "./../components/MessageContainer";
import useShowToast from "./../../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "./../../atoms/conversationsAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

const ChatPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  // const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const { Socket, onlineUsers } = useSocket();
  const showToast = useShowToast();
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/");
        const data = await res.json();
        if (data.error) {
          return showToast("Error", data.error, "error");
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        return showToast("Error", searchedUser.error, "error");
      }
      // sending message to own
      if (searchedUser._id === currentUser._id) {
        showToast("Error", "Cannot message yourself", "error");
      }
      //already in conversation
      if (
        conversations.find(
          (conversation) =>
            conversation.participants[0]._id === searchedUser._id
        )
      ) {
        setSelectedConversation({
          _id: conversations.find(
            (conversation) =>
              conversation.participants[0]._id === searchedUser._id
          )._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return;
      }
      console.log(searchedUser, "hello");
      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
            _id: searchedUser._id,
          },
        ],
      };
      setConversations((prevconv) => [...prevconv, mockConversation]);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setSearchingUser(false);
    }
  };

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
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a user"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <Button
                size="sm"
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
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
          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
                isOnline={onlineUsers.includes(
                  conversation.participants[0]._id
                )}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
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
          </Flex>
        )}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
