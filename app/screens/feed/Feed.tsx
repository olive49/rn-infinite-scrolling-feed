import { toJS } from "mobx";
import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Post } from "@/app/interface";
import FeedItem from "./components/FeedItem";
import useLoadPosts from "@/app/hooks/useLoadPosts";
import PostStore from "@/app/stores/post/PostStore";

const Feed = observer(() => {
  const { list, onEndReached, emptyListText, loadingMore, onRefresh } = useLoadPosts();

  // Wrapping renderItem in useCallback to avoid unneccessary re-renders of
  const renderItem = useCallback(({ item }: { item: Post }) => {
    //onLike is defined here to avoid inline function calling
    const onLike = () => handleOnLike(item.id);

    return (
      <FeedItem
        user={item.user}
        comment={item.comment}
        likes={item.likes}
        replies={item.replies}
        date={item.date}
        handleOnLike={onLike}
      />
    );
  }, []);

  const handleOnLike = useCallback((id: number) => {
    PostStore.updateLikes(id);
  }, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  // For optimization I'm using a FlatList with initialNumToRender set to 5 to limit the number or items rendered on the initial load
  // onEndReachedThreshold is set to 0.5 to load more posts when the user
  // scrolls halfway through the list. Helps in managing memory, improving performance while helping to limit the amount of time user waits for new items to load
  return (
    <SafeAreaView style={styles.container} testID="feed">
      <FlatList
        testID="flatList"
        data={toJS(list)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        initialNumToRender={5}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={PostStore.refreshing}
        ItemSeparatorComponent={itemSeparatorComponent}
        ListEmptyComponent={<Text>{emptyListText}</Text>}
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="small" testID="activityIndicator"/> : <View />
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
