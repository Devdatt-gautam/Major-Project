import { Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import useShowToast from "./../../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom";
const Homepage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
        console.log(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);
  return (
    <>
      {!loading && posts.length === 0 && <h1>Follow users to see the feed.</h1>}
      {loading && (
        <Flex justify="center">
          <Spinner size="xl" />
        </Flex>
      )}

      {posts.map((post) => {
        return <Post key={post._id} post={post} postedBy={post.postedBy} />;
      })}
    </>
  );
};

export default Homepage;
