import { Tabs } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileInvoice, faLayerGroup, faHome, faUser } from '@fortawesome/free-solid-svg-core';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0284c7',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0', height: 60, paddingBottom: 8, paddingTop: 6 },
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faHome} size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cvs"
        options={{
          title: 'My CVs',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faFileInvoice} size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faLayerGroup} size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesomeIcon icon={faUser} size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
