import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/conversationsAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const showToast = useShowToast();
  const setConversation = useSetRecoilState(conversationsAtom);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) {
      return;
    }
    try {
      const res = await fetch(`/api/messages/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recepientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        return showToast("Error", data.error, "error");
      }

      setMessages((messages) => [...messages, data]);
      setConversation((prevConv) => {
        const updatedConv = prevConv.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConv;
      });
      setMessageText("");
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w="full"
          placeholder="Type a message"
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement>
          <IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
