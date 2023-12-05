// import { Button } from "@chakra-ui/button";
import { Box, Container } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import ChatPage from "./pages/ChatPage";
import CreatePost from "./components/CreatePost";
function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Box position={"relative"}>
      <Container maxW="620px">
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <Homepage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
