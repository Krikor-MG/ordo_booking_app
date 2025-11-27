import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import countryData from "./countryData";

interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

interface Props {
  onSelect: (country: Country) => void;
  selected: Country;
}

export default function NumberPicker({ onSelect, selected }: Props) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = countryData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search)
  );

  return (
    <>
      {/* Main button */}
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{selected.flag}</Text>
        <Ionicons name="chevron-down" size={18} color="#1C1C1E" />
      </TouchableOpacity>

      {/* HALF-SCREEN MODAL */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            {/* Close modal */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={26} color="#1C1C1E" />
            </TouchableOpacity>

            {/* SEARCH BAR WITH CLEAR BUTTON */}
            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={20} color="#8A8E94" />

              <TextInput
                style={styles.searchInput}
                placeholder="Search country"
                placeholderTextColor="#8A8E94"
                value={search}
                onChangeText={setSearch}
              />

              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={20} color="#8A8E94" />
                </TouchableOpacity>
              )}
            </View>

            {/* Country List */}
            <FlatList
              data={filtered}
              keyExtractor={(c) => c.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.flag}>{item.flag}</Text>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.code}>{item.dial_code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  picker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  flag: {
    fontSize: 22,
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sheet: {
    height: "50%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },

  closeBtn: {
    position: "absolute",
    top: 25,
    right: 20,
    zIndex: 10,
  },

  /* Search container */
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3F4",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ECECEC",
  },

  name: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#1C1C1E",
  },

  code: {
    fontSize: 16,
    color: "#00C4CC",
    fontWeight: "600",
  },
});
