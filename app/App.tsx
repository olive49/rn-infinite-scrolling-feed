import { SafeAreaProvider } from "react-native-safe-area-context";
import Feed from "./screens/feed/Feed";

export default function App() {
  return (
    <SafeAreaProvider testID="app">
      <Feed/>
    </SafeAreaProvider>
  );
}
