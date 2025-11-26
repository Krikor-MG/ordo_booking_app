import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  // Soft, calm, modern palette
  const ACTIVE = "#4CC9F0";    // Soft sky blue
  const INACTIVE = "#8E9AAF";  // Gentle grey-blue

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: 1.5,
          letterSpacing: 0.2,
        },

        tabBarStyle: {
          backgroundColor: "#FFFFFF",

          // ⭐ Smaller + pushed lower
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom + 2,
          paddingTop: 2,

          // ⭐ Soft border
          borderTopWidth: 0.6,
          borderTopColor: "#E6E9F0",

          // ⭐ Clean, no floating
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="reserve"
        options={{
          title: "Reserve",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="status"
        options={{
          title: "Status",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
