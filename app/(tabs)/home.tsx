import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";

export default function HomePage() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <SearchBar
          mode="pressable"
          onPress={() => router.push("/(tabs)/reserve?autoFocus=true")}
        />

        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          Book restaurants, beauty, barbers & more — fast & easy ✨
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
    gap: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E9AAF",
    textAlign: "center",
    maxWidth: 300,
  },
});
