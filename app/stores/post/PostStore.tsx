import { makeAutoObservable, runInAction, autorun, observable } from "mobx";
import { Post, Feed } from "../../interface";
import posts from "../../mocks/posts.json";

class PostStore {
  posts: Post[];
  loading: boolean;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  refreshing: boolean
  constructor() {
    this.posts = observable.array([]);
    this.loading = false;
    this.currentPage = 0;
    this.totalCount = 0;
    this.pageSize = 5;
    this.refreshing = false
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchPosts(): Promise<void> {
    // Simulating network request with pagination
    // For real-world applications, would use axios + react query, probably currentPage would be passed as a parameter, wouldn't need to slice the array
    if (this.loading) {
      return;
    }
    try {
      this.setLoading(true);
      const fetchPromise = new Promise<Feed>((resolve, reject) => {
        setTimeout(() => {
          const success = true;
          if (success) {
            const startIndex = this.currentPage * this.pageSize;
            console.log("startIndex", startIndex, "pageSize", this.pageSize);
            const endIndex = startIndex + this.pageSize;
            console.log("start index", startIndex, "end index", endIndex);
            const pagePosts = {
              posts: posts.slice(startIndex, endIndex),
              totalCount: posts.length,
            };
            resolve(pagePosts);
          } else {
            reject(new Error("Error fetching posts"));
          }
        }, 2000);
      });

      const fetchPosts = await fetchPromise;
      runInAction(() => {
        this.posts = [...this.posts, ...fetchPosts.posts];
        console.log("this.posts", this.posts);
        this.totalCount = fetchPosts.totalCount;
        console.log("total count", this.totalCount);
        this.currentPage += 1;
      });
    } catch (error: any) {
      // may have retry mechanism depending on the error
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async loadMorePosts(): Promise<void> {
    console.log("in load more posts");
    console.log(this.posts.length, this.totalCount);
    if (this.posts.length < this.totalCount && !this.loading) {
      await this.fetchPosts();
    }
  }

  async updateLikes(postId: number): Promise<void> {
    const postToUpdate = this.posts.find((post) => post.id === postId);
    if (postToUpdate) {
      postToUpdate.likes += 1;
    }
  }

  setIsRefreshing(isRefreshing: boolean): void {
    this.refreshing = isRefreshing;
  }

  async updateComment(postId: number) {}

  private setLoading(loading: boolean): void {
    this.loading = loading;
  }
}

export default new PostStore();
