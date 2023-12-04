import { Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Button } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useSetRecoilState } from "recoil";

import useShowToast from "../../hooks/useShowToast";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "applicatio/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link as={RouterLink} to="/">
          <AiFillHome size={24} />
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
        w={6}
      />
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button size={"xs"} onClick={handleLogout}>
            <Link as={RouterLink} to="/">
              <FiLogOut size={20} />
            </Link>
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
