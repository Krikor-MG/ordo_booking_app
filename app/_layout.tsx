import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync("#FFFFFF");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <>
      <StatusBar translucent={false} style="dark" backgroundColor="#FFFFFF" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
