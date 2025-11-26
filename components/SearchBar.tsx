import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  mode: "pressable" | "input";
  onPress?: () => void;
  value?: string;
  onChange?: (t: string) => void;
};

const SearchBar = forwardRef<TextInput, Props>(
  ({ mode, onPress, value, onChange }, ref) => {
    
    const innerRef = useRef<TextInput>(null);

    // ⭐ EXPOSE THE REAL TEXTINPUT TO THE PARENT
    useImperativeHandle(ref, () => innerRef.current as TextInput);

    // --- Pressable fake bar (HOME) ---
    if (mode === "pressable") {
      return (
        <Pressable style={styles.container} onPress={onPress}>
          <Ionicons name="search" size={20} color="#8E9AAF" />
          <Text style={styles.placeholder}>Search services...</Text>
        </Pressable>
      );
    }

    // --- Real input bar (RESERVE) ---
    return (
      <View style={styles.container}>
        <Ionicons name="search" size={20} color="#8E9AAF" />
        <TextInput
          ref={innerRef}
          style={styles.input}
          placeholder="Search services..."
          placeholderTextColor="#8E9AAF"
          value={value}
          onChangeText={onChange}
        />
      </View>
    );
  }
);

export default React.memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F2F4F7",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6E9F0",
  },
  placeholder: {
    fontSize: 15,
    color: "#8E9AAF",
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1C1C1E",
  },
});
