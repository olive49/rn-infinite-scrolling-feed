import { makeAutoObservable, runInAction } from "mobx";
import { Post, Feed } from "../../interface";
import posts from "../../mocks/posts.json";

class PostStore {
  posts: Post[];
  loading: boolean;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  constructor() {
    this.posts = [];
    this.loading = false;
    this.currentPage = 0;
    this.totalCount = 0;
    this.pageSize = 5;
    makeAutoObservable(this);
  }

  async fetchPosts(): Promise<void> {
    // Simulating network request. For real-world applications, would use axios + react query
    // https://github.com/TanStack/query
    this.setLoading(true);
    try {
      const fetchPromise = new Promise<Feed>((resolve, reject) => {
        setTimeout(() => {
          const success = true;
          if (success) {
            const startIndex = this.currentPage * this.pageSize;
            console.log("startIndex", startIndex, "pageSize", this.pageSize)
            const endIndex = startIndex + this.pageSize;
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
      this.setLoading(true);
      try {
        await this.fetchPosts();
      } catch (error: any) {
        throw error;
      } finally {
        this.setLoading(false);
      }
    }
  }

  async likePost() {}

  async commentPost() {}

  private setLoading(loading: boolean): void {
    this.loading = loading;
  }
}

export default new PostStore();
