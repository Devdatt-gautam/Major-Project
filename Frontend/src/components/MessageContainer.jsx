import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/conversationsAtom";
import { useEffect, useRef, useState } from "react";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();

  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMesssages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { socket } = useSocket();
  const messageEndRef = useRef(null);
  useEffect(() => {
    socket?.on("newMessage", (message) => {
      if (selectedConversation._id == message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) => {
        const updated = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updated;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        if (selectedConversation.mock) {
          setMessages([]);
          return;
        }
        const res = await fetch(
          `https://antiprofanitybackend.onrender.com/api/messages/${selectedConversation.userId}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.error) {
          return showToast("Error", data.error, "error");
        }
        // console.log(data);
        setMessages(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoadingMesssages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <Flex
      flex={70}
      bg={useColorModeValue("gray.200", "gray.dark")}
      flexDirection={"column"}
      borderRadius={"md"}
      p={2}
    >
      {/* message header */}
      <Flex w="full" h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
        <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
          {selectedConversation.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      {/* messages */}
      <Flex
        flexDir={"column"}
        gap={4}
        my={4}
        px={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>

              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}
        {messages?.map((message) => (
          <Flex
            key={message._id}
            direction={"column"}
            ref={
              messages.length - 1 == messages.indexOf(message)
                ? messageEndRef
                : null
            }
          >
            <Message
              message={message}
              ownMessage={currentUser._id === message.sender}
            />
          </Flex>
        ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;
