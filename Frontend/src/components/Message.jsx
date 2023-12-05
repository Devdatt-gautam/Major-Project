import { Avatar, Flex, Text } from "@chakra-ui/react";

const Message = ({ ownMessage }) => {
  return (
    <>
      {ownMessage ? (
        <Flex alignSelf={"flex-end"} gap={2}>
          <Text maxW="350px" bg={"blue.400"} p={1} borderRadius="md">
            accusantium doloribus eius. Error, optio! Dolore quaerat quae,
            soluta totam ea officia unde praesentium consequu.
          </Text>
          <Avatar src="" w={7} h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src="" w={7} h={7} />
          <Text
            maxW="350px"
            bg={"gray.400"}
            p={1}
            color={"black"}
            borderRadius="md"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa est
            totam commodi itaque, mollitia accusantium doloribus eius. Error,
          </Text>
        </Flex>
      )}
    </>
  );
};

export default Message;
