# Getting Started

## Step 1: Clone the repository

```bash
git clone https://github.com/olive49/rn-infinite-scrolling-feed.git
cd rn-infinite-scrolling-feed
```

## Step 2: Install the dependencies

```bash
npm install
```

## Step 3: Launch the Application

Run the following command to start the app with Metro Bundler:

```bash
npm run start
```

Once started, you can:

Scan the QR code displayed in the terminal with the Expo Go app (Android) or the Camera app (iOS).
For web, open the URL displayed in the terminal (example: http://localhost:8081).

# Approach
This app leverages MobX for state management due to its simplicity, reactivity, performance, quick setup, and my recent experience with it, which minimizes the learning curve.

## State Management
The backbone of the state is maintained in the PostStore class, where each variable is marked as observable. This ensures a single source of truth throughout the application. The useLoadPosts custom hook handles most interactions with the PostStore. It is responsible for:

- Fetching the initial list of posts on mount.
- Handling events when the user reaches the end of the list.
- Refreshing the list when the user pulls to refresh.
- Displaying appropriate messages in case of an empty list or errors during fetching or refreshing.

## Optimization and Caching
To optimize performance, we fetch and cache five list items at a time by adding them to the observable array within the PostStore instance. This strategy ensures efficient use of resources and a smoother user experience.

## List Rendering
In the React Native FlatList, we initially render five items. The onEndReachedThreshold is set to 0.5, triggering onEndReached when the user scrolls halfway through the list. This approach prevents loading too many items at once and reduces the wait time for users before the next set of items is fetched and displayed.

## API Call Management
The PostStore maintains variables such as isLoading and isRefreshing to track API call statuses, ensuring that multiple calls are not made simultaneously.

By combining the power of MobX with strategic data fetching and caching, we ensure a responsive and efficient application that provides a seamless user experience.

<img src="https://github.com/olive49/rn-infinite-scrolling-feed/blob/main/demo.gif" width="300" height="500">
