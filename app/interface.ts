export interface Post {
  id: number;
  user: string;
  comment: string;
  likes: number;
  replies: Post[];
}

export interface Feed {
  totalCount: number;
  posts: Post[];
}
