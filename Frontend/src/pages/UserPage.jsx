import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";

import { useParams } from "react-router-dom";
import useShowToast from "./../../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();
  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found</h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && <h1>User has no posts</h1>}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => {
        return <Post key={post._id} post={post} postedBy={post.postedBy} />;
      })}
    </>
  );
};

export default UserPage;
