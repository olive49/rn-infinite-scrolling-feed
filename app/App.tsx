import Feed from "./screens/feed/Feed";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <Feed/>
    </SafeAreaProvider>
  );
}
