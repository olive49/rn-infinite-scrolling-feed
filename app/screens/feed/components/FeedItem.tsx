import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { memo, useCallback, useState } from "react";
import { FeedItemProps, Post } from "@/app/interface";

const FeedItem = ({
  user,
  comment,
  likes,
  replies,
  date,
  handleOnLike,
}: FeedItemProps) => {
  const [showComments, setShowComments] = useState(false);
  const commentsDisabled: boolean = replies.length === 0;

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const renderItem = useCallback(({ item }: {item: Post}) => {
    return <Text style={styles.commentText}>{item.comment}</Text>
  }, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View style={styles.separator} />;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.body}>{user}</Text>
      <Text style={styles.body}>{new Date(date).toLocaleString()}</Text>
      <Text style={styles.body}>{comment}</Text>
      <Text style={styles.body}>{likes} likes</Text>
      <Text style={styles.body}>{replies.length} comments</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleOnLike}>
          <Text style={styles.btnText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={commentsDisabled}
          onPress={toggleComments}
          style={commentsDisabled && styles.hideContainer}
        >
          <Text style={styles.btnText}>
            {showComments ? "Hide Comments" : "View Comments"}
          </Text>
        </TouchableOpacity>
      </View>
      {showComments && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments</Text>
          <FlatList
            data={replies}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={itemSeparatorComponent}
            renderItem={renderItem}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
  },
  hideContainer: {
    opacity: 0,
  },
  body: {
    fontSize: 20,
    paddingVertical: 2,
  },
  btnText: {
    color: "blue",
    fontSize: 18,
  },
  commentsContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    paddingVertical: 5,
  },
  separator: {
    borderWidth: 1,
    marginVertical: 10,
    borderColor: "#ccc",
  },
});

export default memo(FeedItem);
