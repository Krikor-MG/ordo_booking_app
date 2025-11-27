import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountPage() {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(40)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade + slide-in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Row Press Animation
  const usePressAnimation = () => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
        speed: 20,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }).start();
    };

    return { scale, onPressIn, onPressOut };
  };

  interface RowProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap; // strict ionicon name
  onPress?: () => void;
}

const Row = ({ label, icon, onPress }: RowProps) => {
  const { scale, onPressIn, onPressOut } = usePressAnimation();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.row}
      >
        <View style={styles.rowLeft}>
          <Ionicons name={icon} size={22} color="#1C1C1E" />
          <Text style={styles.rowText}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8A8E94" />
      </Pressable>
    </Animated.View>
  );
};

  return (
    <Animated.View
      style={[styles.screen, { opacity: fadeAnim, transform: [{ translateY: slideUp }] }]}
    >
      <SafeAreaView style={{ flex: 1 }}>

        {/* Guest Card */}
        <Animated.View style={[styles.guestCard]}>
          <Animated.View
            style={[
              styles.guestBadge,
              {
                transform: [{ scale: pulse }],
              },
            ]}
          >
            <Ionicons
              name="person-circle-outline"
              size={34}
              color="#1C1C1E"
            />
          </Animated.View>

          <View>
            <Text style={styles.guestText}>Guest</Text>
            <Text style={styles.guestHint}>Sign in for full features</Text>
          </View>
        </Animated.View>

        {/* Table List */}
        <View style={styles.table}>

          <Row label="About" icon="information-circle-outline" onPress={() => {}} />

          <View style={styles.divider} />

          <Row label="Contact Us" icon="chatbubbles-outline" onPress={() => {}} />

          <View style={styles.divider} />

          <Row
            label="Login"
            icon="log-in-outline"
            onPress={() => router.push("/signin")}
          />

        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 16,
  },

  /* Guest Card */
  guestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },

  guestBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,

    // subtle glow
    shadowColor: "#00C4CC",
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  guestText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  guestHint: {
    fontSize: 13,
    color: "#8A8E94",
    marginTop: 2,
  },

  /* Table List */
  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  rowText: {
    fontSize: 16,
    color: "#1C1C1E",
  },

  divider: {
    height: 1,
    backgroundColor: "#E6E7EB",
    marginLeft: 20,
  },
});
