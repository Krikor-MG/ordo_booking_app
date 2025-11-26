import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../../components/SearchBar";

export default function ReservePage() {
  const { autoFocus } = useLocalSearchParams();
  const [query, setQuery] = useState("");

  const inputRef = useRef<TextInput>(null);

  // ⭐ FOCUS EVERY TIME THE SCREEN IS ACTIVE
  useFocusEffect(
    useCallback(() => {
      if (autoFocus === "true") {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 120);
      }
    }, [autoFocus])
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <SearchBar
          mode="input"
          value={query}
          onChange={setQuery}
          ref={inputRef}
        />

        <Text style={styles.title}>Reserve</Text>
        <Text style={styles.subtitle}>Find services near you...</Text>

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
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  subtitle: {
    fontSize: 15,
    color: "#8E9AAF",
  },
});
