import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useCallback } from "react";
import { Post } from "@/app/interface";
import FeedItem from "./FeedItem";
import useLoadPosts from "@/app/hooks/useLoadPosts";
import PostStore from "@/app/stores/post/PostStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Feed = observer(() => {
  const { list, onEndReached, emptyListText, loadingMore, onRefresh } = useLoadPosts();

  const renderItem = useCallback(({ item }: { item: Post }) => {
    const onLike = () => handleOnLike(item.id);
    const onComment = () => handleOnComment(item.user, item.comment, item.replies);

    return (
      <FeedItem
        user={item.user}
        comment={item.comment}
        likes={item.likes}
        replies={item.replies}
        handleOnLike={onLike}
        handleOnComment={onComment}
      />
    );
  }, []);

  const handleOnLike = useCallback((id: number) => {
    PostStore.updateLikes(id);
  }, []);

  const handleOnComment = useCallback((user: string, comment: string, replies: Post[]) => {
    console.log("user", user);
  }, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={toJS(list)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={10}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={PostStore.refreshing}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={<Text>{emptyListText}</Text>}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" /> : <View />
        }
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  separator: {
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default Feed;
