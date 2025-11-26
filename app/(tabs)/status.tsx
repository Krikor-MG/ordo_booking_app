import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StatusPage() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.title}>Status</Text>
        <Text style={styles.subtitle}>Track your bookings & progress.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "700", color: "#1C1C1E" },
  subtitle: { fontSize: 16, color: "#8A8E94", marginTop: 6 },
});
