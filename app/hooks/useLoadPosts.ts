import { useCallback, useEffect, useState } from "react";
import { Post } from "../interface";
import PostStore from "../stores/post/PostStore";

interface UseLoadPostsReturn {
  list: Post[];
  onEndReached: () => void;
  emptyListText: string;
  loadingMore: boolean;
  onRefresh: () => void;
}

const useLoadPosts = (): UseLoadPostsReturn => {
  const [list, setList] = useState<Post[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [emptyListText, setEmptyListText] =
    useState<string>("Check back soon!");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await PostStore.fetchPosts();
        setList(PostStore.posts);
      } catch (error: any) {
        setEmptyListText(`${error.message}, please try again later`);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    setLoadingMore(PostStore.loading);
  }, [PostStore.loading]);

  useEffect(() => {
    setList(PostStore.posts);
  }, [PostStore.posts]);

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

  return { list, onEndReached, emptyListText, loadingMore, onRefresh };
};

export default useLoadPosts;
