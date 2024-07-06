import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { memo } from "react";

interface FeedItemProps {
  user: string;
  comment: string;
  likes: number;
  replies: any[];
  handleOnLike: () => void;
  handleOnComment: () => void;
}

const FeedItem = ({ user, comment, likes, replies, handleOnLike, handleOnComment }: FeedItemProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>{user}</Text>
      <Text style={styles.body}>{comment}</Text>
      <Text style={styles.body}>{likes} likes</Text>
      <Text style={styles.body}>{replies.length} comments</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={handleOnLike}><Text style={styles.btnText}>Like</Text></TouchableOpacity>
        <TouchableOpacity onPress={handleOnComment} style={replies.length === 0 && styles.hideContainer}><Text style={styles.btnText}>View Comments</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10
  },
  hideContainer: {
    opacity: 0
  },
  body: {
    fontSize: 20,
    paddingVertical: 2
  },
  btnText: {
    color: "blue",
    fontSize: 18
  }
});

export default memo(FeedItem);
