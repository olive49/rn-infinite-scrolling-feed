import { useCallback, useEffect, useState } from "react";
import PostStore from "../stores/post/PostStore";

interface UseLoadPostsReturn {
  onEndReached: () => void;
  emptyListText: string;
  onRefresh: () => void;
}

const useLoadPosts = (): UseLoadPostsReturn => {
  const [emptyListText, setEmptyListText] =
    useState<string>("Check back soon!");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await PostStore.fetchPosts();
      } catch (error: any) {
        setEmptyListText(`${error.message}, please try again later`);
      }
    };

    fetchPosts();
  }, []);

  const onEndReached = useCallback(() => {
    PostStore.loadMorePosts();
  }, []);

  const onRefresh = useCallback(() => {
    const refreshAsync = async () => {
      try {
        await PostStore.refresh();
      } catch (error: any) {
        setEmptyListText(`${error.message}, please try again later`);
      }
    };

    refreshAsync();
  }, []);

  return { onEndReached, emptyListText, onRefresh };
};

export default useLoadPosts;
