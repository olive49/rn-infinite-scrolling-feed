import { observer } from "mobx-react-lite";
import { View, Text, FlatList, SafeAreaView, Alert, ActivityIndicator } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import PostStore
 from "@/app/stores/post/PostStore";
import { Post } from "@/app/interface";

const Feed = () => {
    const [list, setList] = useState<Post[]>([]);
    const [emptyListText, setEmptyListText] = useState<string>("Check back soon!");
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const renderItem = useCallback(({ item }: { item: Post }) => {
    return (
      <View>
        <Text>{item.user}</Text>
        <Text>{item.comment}</Text>
        <Text>{item.likes}</Text>
      </View>
    );
  }, [])

  const onEndReached = useCallback(() => {
    console.log("END REACHED");
    PostStore.loadMorePosts();
  }, [])

  const itemSeparatorComponent = useCallback(() => {
    return <View style={{ borderWidth: 1, marginVertical: 10 }} />;
  }, []);

  useEffect(() => { 
    const fetchPosts = async () => {
      try {
        await PostStore.fetchPosts();
        setList(PostStore.posts);
      } catch (error: any) {
        setEmptyListText(`${error.message}, please try again later`);
      }
    }

    fetchPosts();
  }, [])


  useEffect(() => {
    setLoadingMore(PostStore.loading)
  }, [PostStore.loading])

  useEffect(() => {
    setList(PostStore.posts);
  }, [PostStore.posts.length])

  return (
    <SafeAreaView>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={<Text>{emptyListText}</Text>}
        ListFooterComponent={loadingMore ? <ActivityIndicator size='small' /> : <View/>}
      />
    </SafeAreaView>
  );
};

export default observer(Feed);
