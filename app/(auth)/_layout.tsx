import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="email" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="register" />
      <Stack.Screen name="location" />
    </Stack>
  );
} 