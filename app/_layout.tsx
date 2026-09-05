import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1e293b' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: '#f8fafc' },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="cv/create" options={{ title: 'Create New CV', headerBackTitle: 'Back' }} />
        <Stack.Screen name="cv/[id]/personal" options={{ title: 'Personal Information' }} />
        <Stack.Screen name="cv/[id]/education" options={{ title: 'Education History' }} />
        <Stack.Screen name="cv/[id]/experience" options={{ title: 'Work Experience' }} />
        <Stack.Screen name="cv/[id]/skills" options={{ title: 'Skills & Expertise' }} />
        <Stack.Screen name="cv/[id]/projects" options={{ title: 'Key Projects' }} />
        <Stack.Screen name="cv/[id]/certifications" options={{ title: 'Certifications' }} />
        <Stack.Screen name="cv/[id]/preview" options={{ title: 'A4 Preview & PDF Export' }} />
        <Stack.Screen name="admin/index" options={{ title: 'Admin Control Center' }} />
      </Stack>
    </>
  );
}
