export interface Post {
  id: number;
  user: string;
  comment: string;
  likes: number;
  date: string;
  replies: Post[];
}

export interface Feed {
  totalCount: number;
  posts: Post[];
}

export interface FeedItemProps {
  user: string;
  comment: string;
  likes: number;
  replies: Post[];
  date: string;
  handleOnLike: () => void;
}