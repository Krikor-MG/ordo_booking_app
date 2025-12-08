import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/lib/Authcontext";


export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  // const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const { signOut } = useAuth();

  console.log(user?.phone);
  console.log(user?.profile);
  console.log(user?.profile?.full_name);
  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);

    if (!user) {
      // no session → treat as guest
      setProfile(null);
      setLoading(false);
      return;
    }

    // load from your profile table

    setProfile(user.profile || null);
    setLoading(false);
  }

  async function logout() {
    signOut();
    setProfile(null);
    router.replace("/signin");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C4CC" />
      </View>
    );
  }

  const isLoggedIn = !!profile;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle-outline" size={55} color="#1C1C1E" />
          </View>

          <View>
            <Text style={styles.nameText}>
              {isLoggedIn ? profile.full_name : "Guest"}
            </Text>

            {isLoggedIn && (
              <Text style={styles.phoneText}>{profile.full_phone}</Text>
            )}
          </View>
        </View>

        {/* LOGGED-IN CONTENT */}
        {isLoggedIn ? (
          <>
            <Section>
              <Item label="Profile" icon="person-outline" />
              <Item label="Addresses" icon="location-outline" />
              <Item label="Payment Methods" icon="card-outline" />
              <Item label="Favorites" icon="heart-outline" />
            </Section>

            <Section>
              <Item label="About" icon="information-circle-outline" />
              <Item label="Contact Us" icon="chatbubbles-outline" />
            </Section>

            <Pressable style={styles.logoutBtn} onPress={logout}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#FF4D4D"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "#FF4D4D", fontSize: 16 }}>Logout</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* GUEST CONTENT */}

            <Section>
              <Item label="About" icon="information-circle-outline" />
              <Item label="Contact Us" icon="chatbubbles-outline" />
              {/* {!isAuthenticated && ( */}
                <Item
                  label="Login"
                  icon="log-in-outline"
                  onPress={() => router.push("/signin")}
                />
              {/* )} */}
            </Section>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ children }: any) {
  return <View style={styles.section}>{children}</View>;
}

function Item({ label, icon, onPress }: any) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color="#1C1C1E" />
        <Text style={styles.rowText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8A8E94" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  headerLeft: {
    marginRight: 16,
  },

  nameText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    zIndex: 1,
  },

  phoneText: {
    color: "#666",
    marginTop: 3,
    fontSize: 14,
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
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

  logoutBtn: {
    marginTop: 32,
    marginHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
});
