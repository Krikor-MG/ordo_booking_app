import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/lib/Authcontext";
import { supabase } from "../src/lib/supabase";

export default function ProfileSettingsPage() {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Notification settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [newArrivals, setNewArrivals] = useState(false);

  // Privacy settings
  const [shareData, setShareData] = useState(false);

  useEffect(() => {
    loadProfileSettings();
  }, []);

  async function loadProfileSettings() {
    setLoading(true);
    
    if (!user?.profile) {
      setLoading(false);
      return;
    }

    const profile = user.profile;
    
    // Load profile data
    setFullName(profile.full_name || "");
    setEmail(profile.email || "");
    setDateOfBirth(profile.date_of_birth || "");
    setGender(profile.gender || "");
     await updateUserProfile(user?.profile.id);
    // Set initial date for picker
    if (profile.date_of_birth) {
      const parsedDate = new Date(profile.date_of_birth);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }

    // Load notification settings
    setPushNotifications(profile.push_notifications ?? true);
    setEmailNotifications(profile.email_notifications ?? true);
    setSmsNotifications(profile.sms_notifications ?? false);
    setOrderUpdates(profile.order_updates ?? true);
    setPromotions(profile.promotions ?? true);
    setNewArrivals(profile.new_arrivals ?? false);

    // Load privacy settings
    setShareData(profile.share_data ?? false);

    setLoading(false);
  }

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      // Format date as YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      setDateOfBirth(formattedDate);
    }
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Select date";
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  async function saveSettings() {
    setSaving(true);

    try {
      const { error } = await supabase
        .from('Costumer_profiles_ORDO')
        .update({
          full_name: fullName,
          email: email,
          date_of_birth: dateOfBirth,
          gender: gender,
          push_notifications: pushNotifications,
          email_notifications: emailNotifications,
          sms_notifications: smsNotifications,
          order_updates: orderUpdates,
          promotions: promotions,
          new_arrivals: newArrivals,
          share_data: shareData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.profile.id);

      if (error) throw error;

      // Fetch and update the user profile in context
      await updateUserProfile(user?.profile.id);

      Alert.alert("Success", "Settings saved successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  // Rest of the component remains the same...
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00C4CC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PERSONAL INFORMATION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.phoneDisplay}>{user?.profile?.full_phone}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <Pressable onPress={openDatePicker} style={styles.datePickerButton}>
              <Text style={[styles.datePickerText, !dateOfBirth && styles.datePickerPlaceholder]}>
                {formatDisplayDate(dateOfBirth)}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#00C4CC" />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )}
            {Platform.OS === 'ios' && showDatePicker && (
              <Pressable 
                style={styles.datePickerDoneBtn} 
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerDoneText}>Done</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              {["Male", "Female"].map((option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.genderBtn,
                    gender === option && styles.genderBtnActive,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === option && styles.genderTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* NOTIFICATION SETTINGS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notifications</Text>
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Push Notifications"
            description="Receive notifications on your device"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="Email Notifications"
            description="Receive updates via email"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="SMS Notifications"
            description="Receive text messages"
            value={smsNotifications}
            onValueChange={setSmsNotifications}
          />
        </View>

        {/* NOTIFICATION PREFERENCES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Order Updates"
            description="Get notified about your order status"
            value={orderUpdates}
            onValueChange={setOrderUpdates}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="Promotions & Offers"
            description="Receive special deals and discounts"
            value={promotions}
            onValueChange={setPromotions}
          />

          <View style={styles.divider} />

          <ToggleRow
            label="New Arrivals"
            description="Be the first to know about new products"
            value={newArrivals}
            onValueChange={setNewArrivals}
          />
        </View>

        {/* PRIVACY SETTINGS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Privacy</Text>
        </View>

        <View style={styles.card}>
          <ToggleRow
            label="Share Usage Data"
            description="Help us improve by sharing usage data"
            value={shareData}
            onValueChange={setShareData}
          />
        </View>

        {/* SAVE BUTTON */}
        <Pressable
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({ label, description, value, onValueChange }: any) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#D1D5DB", true: "#00C4CC" }}
        thumbColor="#fff"
        ios_backgroundColor="#D1D5DB"
      />
    </View>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backBtn: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  inputGroup: {
    padding: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },

  input: {
    fontSize: 16,
    color: "#1C1C1E",
    paddingVertical: 8,
  },

  phoneDisplay: {
    fontSize: 16,
    color: "#9CA3AF",
    paddingVertical: 8,
  },

  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  datePickerText: {
    fontSize: 16,
    color: "#1C1C1E",
  },

  datePickerPlaceholder: {
    color: "#999",
  },

  datePickerDoneBtn: {
    alignSelf: "flex-end",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#00C4CC",
    borderRadius: 8,
  },

  datePickerDoneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  genderContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
  },

  genderBtnActive: {
    backgroundColor: "#00C4CC",
    borderColor: "#00C4CC",
  },

  genderText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  genderTextActive: {
    color: "#fff",
  },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  toggleLeft: {
    flex: 1,
    marginRight: 12,
  },

  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 2,
  },

  toggleDescription: {
    fontSize: 13,
    color: "#6B7280",
  },

  saveBtn: {
    backgroundColor: "#00C4CC",
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#00C4CC",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  saveBtnDisabled: {
    opacity: 0.6,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});