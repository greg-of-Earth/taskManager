import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/ThemeContext"; // use theme provider for dark/ light detection

export default function RootLayout() {
  
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false}}/>
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
