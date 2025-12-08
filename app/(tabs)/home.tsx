import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchBar from "../../components/SearchBar";

const CATEGORIES = [
  { id: "all", name: "All", image: require("../../assets/icons/all.png") },
  { id: "restaurants", name: "Restaurants", image: require("../../assets/icons/restaurants.png") },
  { id: "beauty", name: "Beauty", image: require("../../assets/icons/beauty.png") },
  { id: "hotels", name: "Hotels", image: require("../../assets/icons/hotels.png") },
  { id: "cars", name: "Cars", image: require("../../assets/icons/cars.png") },
  { id: "events", name: "Events", image: require("../../assets/icons/events.png") },
  { id: "wellness", name: "Wellness", image: require("../../assets/icons/wellness.png") },
  { id: "activities", name: "Activities", image: require("../../assets/icons/activities.png") },
];

export default function HomePage() {
  const [active, setActive] = useState("all");

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        {/* BIG CHUNK HEADER */}
        <View style={styles.bigHeader}>
          <SearchBar
            mode="pressable"
            onPress={() => router.push("/(tabs)/reserve")}
          />
        </View>

        {/* 4×4 GRID */}
        <View style={styles.grid}>
          {CATEGORIES.map((item) => (
            <CategoryBox
              key={item.id}
              item={item}
              active={active}
              setActive={setActive}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

function CategoryBox({ item, active, setActive }: any) {
  const isActive = active === item.id;

  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value) }],
  }));

  return (
    <View style={styles.boxWrapper}>
      <Animated.View style={[styles.box, isActive && styles.boxActive, animated]}>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => {
            setActive(item.id);

            scale.value = 0.85;
            setTimeout(() => (scale.value = 1.12), 90);
            setTimeout(() => (scale.value = 1), 180);
          }}
          style={styles.boxContent}
        >
          <Image source={item.image} style={styles.iconImage} />
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.label}>{item.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F9FC" },

  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },

  /** ███ BIG HEADER BLOCK ███ */
  bigHeader: {
    width: "100%",
    height: 120,
    backgroundColor: "#7B61FF",
    paddingHorizontal: "6%",
    paddingTop: 0,
    justifyContent: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 40,
    marginBottom: 25,
  },

  /** GRID 4×4 */
  grid: {
    width: "92%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  boxWrapper: {
    width: "22%",
    marginVertical: 13,
    alignItems: "center",
  },

  box: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  boxActive: {
    borderWidth: 2,
    borderColor: "#00C4CC",
    backgroundColor: "#00C4CC18",
  },

  boxContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  iconImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },

  label: {
    marginTop: 6,
    fontSize: 11,
    color: "#1C1C1E",
    fontWeight: "500",
    textAlign: "center",
  },
});
