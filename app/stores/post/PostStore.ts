import { makeAutoObservable, runInAction, autorun, observable } from "mobx";
import { Post, Feed } from "../../interface";
import posts from "../../mocks/posts.json";

class PostStore {
  posts: Post[];
  loading: boolean;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  refreshing: boolean;
  constructor() {
    this.posts = observable.array([]);
    this.loading = false;
    this.currentPage = 0;
    this.totalCount = 0;
    this.pageSize = 5;
    this.refreshing = false;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async fetchPosts(refresh: boolean = false): Promise<void> {
    // Simulating network request with pagination
    // For real-world applications, would use axios + react query, probably currentPage would be passed as a parameter
    if (this.loading) {
      return;
    }
    try {
      this.setLoading(true);
      const fetchPromise = new Promise<Feed>((resolve, reject) => {
        setTimeout(() => {
          const success = true;
          if (success) {
            if (refresh) {
              runInAction(() => {
                this.currentPage = 0;
                this.posts = [];
              });
            }
            const startIndex: number = this.currentPage * this.pageSize;
            const endIndex: number = startIndex + this.pageSize;
            const pagePosts: Feed = {
              posts: posts.slice(startIndex, endIndex),
              totalCount: posts.length,
            };
            resolve(pagePosts);
          } else {
            reject(new Error("Error fetching posts"));
          }
        }, 2000);
      });

      const fetchPosts: Feed  = await fetchPromise;
      runInAction(() => {
        this.posts = [...this.posts, ...fetchPosts.posts];
        this.totalCount = fetchPosts.totalCount;
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
    if (
      this.posts.length < this.totalCount &&
      !this.loading &&
      !this.refreshing
    ) {
      await this.fetchPosts();
    }
  }

  // Because the data is not syncing to the server, refresh does not work as expected yet
  // It will reset the posts to the initial state
  // In a real-world application, this would be a call to the server to get the latest posts
  async refresh(): Promise<void> {
    if (this.refreshing) {
      return;
    }
    this.setRefreshing(true);
    try {
      await this.fetchPosts(true);
    } catch (error) {
      throw new Error("Failed to refresh posts");
    } finally {
      this.setRefreshing(false);
    }
  }

  updateLikes(postId: number): void {
    const postToUpdate = this.posts.find((post) => post.id === postId);
    if (postToUpdate) {
      postToUpdate.likes += 1;
    }
  }

  setRefreshing(isRefreshing: boolean): void {
    this.refreshing = isRefreshing;
  }

  private setLoading(loading: boolean): void {
    this.loading = loading;
  }
}

export default new PostStore();
