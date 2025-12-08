import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import NumberPicker from "../src/lib/NumberPicker";
import countryData from "../src/lib/countryData";
import { supabase } from "../src/lib/supabase";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.code === "LB") || countryData[0]
  );
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    otp: "",
  });

  const validateFullName = (name: string) => {
    if (!name.trim()) return "Full name is required";
    const parts = name.trim().split(" ");
    if (parts.length < 2) return "Enter first and last name";
    if (name.length < 6) return "Name is too short";
    if (/\d/.test(name)) return "Name cannot contain numbers";
    return "";
  };

  const PHONE_LENGTHS: Record<string, number> = {
    LB: 8, SA: 9, AE: 9, JO: 9, QA: 8, KW: 8,
    BH: 8, OM: 8, IQ: 10, EG: 10, MA: 9,
    TN: 8, DZ: 9,
  };

  const maxLength = PHONE_LENGTHS[selectedCountry?.code] ?? 10;

  const handleSendOTP = async () => {
    let newErrors = {
      fullName: "",
      phone: "",
      otp: "",
    };

    newErrors.fullName = validateFullName(fullName);

    if (phone.length < maxLength)
      newErrors.phone = `Phone number must be ${maxLength} digits`;

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v !== "")) return;

    setLoading(true);

    const fullPhone = `${selectedCountry.dial_code}${phone}`;

    try {
      console.log("Sending OTP to:", fullPhone);
      
      const { data, error } = await supabase.functions.invoke("send-otp", {
        body: { phone: fullPhone },
      });

      if (error) {
        console.error("Send OTP error:", error);
        setErrors((prev) => ({ ...prev, phone: error.message || "Failed to send OTP" }));
        Alert.alert("Error", error.message || "Failed to send OTP");
        return;
      }

      if (!data?.success) {
        const errorMsg = data?.error || "Failed to send OTP";
        console.error("Send OTP failed:", errorMsg);
        setErrors((prev) => ({ ...prev, phone: errorMsg }));
        Alert.alert("Error", errorMsg);
        return;
      }

      console.log("OTP sent successfully");
      setOtpSent(true);
      Alert.alert("Success", "OTP sent to your phone number");
    } catch (err) {
      console.error("Send OTP exception:", err);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }));
      return;
    }

    setLoading(true);

    const fullPhone = `${selectedCountry.dial_code}${phone}`;

    try {
      console.log("Verifying OTP...");

      // Call verify-otp Edge Function with full name
      const { data, error } = await supabase.functions.invoke("verify-otp", {
        body: {
          phone: fullPhone,
          otp: otp,
          isSignup: true,
          fullName: fullName,
          // dial_code: selectedCountry?.dial_code,
          countryCode: selectedCountry,
        },
      });

      if (error) {
        console.error("Verify OTP error:", error);
        setErrors((prev) => ({ ...prev, otp: error.message || "Failed to verify OTP" }));
        Alert.alert("Error", error.message || "Failed to verify OTP");
        return;
      }

      if (!data?.success) {
        const errorMsg = data?.error || "Invalid OTP";
        console.error("Verify failed:", errorMsg);
        setErrors((prev) => ({ ...prev, otp: errorMsg }));
        Alert.alert("Error", errorMsg);
        return;
      }

      console.log("OTP verified successfully:", data);

      const user = data.user;
      if (!user) {
        Alert.alert("Error", "User not found");
        return;
      }

      // Check if profile already exists
      const { data: existingProfile, error: profileError } = await supabase
        .from("Costumer_profiles_ORDO")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile check error:", profileError);
      }

      // Create profile if it doesn't exist
      // if (!existingProfile) {
      //   console.log("Creating user profile...");
        
      //   const { error: insertError } = await supabase
      //     .from("Costumer_profiles_ORDO")
      //     .insert({
      //       user_id: user.id,
      //       full_name: fullName,
      //       country_code: selectedCountry.code,
      //       dial_code: selectedCountry.dial_code,
      //       phone: phone,
      //       full_phone: fullPhone,
      //     });

      //   if (insertError) {
      //     console.error("Profile creation error:", insertError);
      //     Alert.alert("Error", "Account created but profile setup failed. Please contact support.");
      //     return;
      //   }

      //   console.log("✅ Profile created successfully!");
      // } else {
      //   console.log("Profile already exists");
      // }

      // Success! Navigate to home
      Alert.alert("Success", "Account created successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (err) {
      console.error("Verification exception:", err);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.screen}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (otpSent) {
                setOtpSent(false);
                setOtp("");
              } else {
                router.back();
              }
            }}
          >
            <Ionicons name="arrow-back" size={26} color="#1C1C1E" />
          </TouchableOpacity>

          <View style={styles.headerTop}>
            <View style={styles.logoBadge}>
              <Ionicons name="happy-outline" size={48} color="#FFF" />
            </View>
          </View>

          <Text style={styles.title}>
            {otpSent ? "Verify OTP" : "Create New Account"}
          </Text>

          {!otpSent ? (
            <>
              {/* FULL NAME */}
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={20} color="#8A8E94" />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#8A8E94"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName ? (
                <Text style={styles.error}>{errors.fullName}</Text>
              ) : null}

              {/* PHONE */}
              <View style={styles.phoneRow}>
                <NumberPicker
                  selected={selectedCountry}
                  onSelect={(country) => {
                    setSelectedCountry(country);
                    setPhone("");
                  }}
                />

                <Text style={styles.dialCode}>{selectedCountry?.dial_code}</Text>

                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={(t) => {
                    if (t.length <= maxLength) setPhone(t);
                  }}
                  keyboardType="number-pad"
                  placeholder="Phone Number"
                  placeholderTextColor="#8A8E94"
                />
              </View>
              {errors.phone ? <Text style={styles.error}>{errors.phone}</Text> : null}

              {/* SEND OTP BUTTON */}
              <TouchableOpacity
                style={[styles.signInBtn, loading && styles.btnDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
              >
                <Text style={styles.signInText}>
                  {loading ? "Sending..." : "Send OTP"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OTP INPUT */}
              <Text style={styles.otpInfo}>
                Enter the 6-digit code sent to {selectedCountry.dial_code}
                {phone}
              </Text>

              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={20} color="#8A8E94" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter OTP"
                  placeholderTextColor="#8A8E94"
                  value={otp}
                  onChangeText={(text) => {
                    const cleaned = text //.replace(/[^0-9]/g, "");
                    if (cleaned.length <= 6) {
                      setOtp(cleaned);
                    }
                  }}
                  keyboardType="default"
                  maxLength={6}
                  autoFocus
                />
              </View>
              {errors.otp ? <Text style={styles.error}>{errors.otp}</Text> : null}

              {/* VERIFY BUTTON */}
              <TouchableOpacity
                style={[styles.signInBtn, loading && styles.btnDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
              >
                <Text style={styles.signInText}>
                  {loading ? "Verifying..." : "Verify & Sign Up"}
                </Text>
              </TouchableOpacity>

              {/* RESEND OTP */}
              <TouchableOpacity
                onPress={handleSendOTP}
                disabled={loading}
                style={styles.resendBtn}
              >
                <Text style={styles.resendText}>
                  Didn't receive code?{" "}
                  <Text style={{ fontWeight: "700" }}>Resend</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* LOGIN LINK */}
          {!otpSent && (
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.bottomText}>
                Already have an account?{" "}
                <Text style={{ color: "#00C4CC", fontWeight: "700" }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    padding: 20,
  },

  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 50,
  },

  headerTop: {
    height: 150,
    backgroundColor: "#00C4CC",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 60,
  },

  logoBadge: {
    width: 90,
    height: 90,
    backgroundColor: "#00959C",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: -45,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 20,
  },

  inputRow: {
    marginTop: 12,
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#D0D3D5",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },

  phoneRow: {
    marginTop: 14,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#D0D3D5",
  },

  dialCode: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "600",
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
  },

  error: {
    color: "#FF6F61",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 6,
  },

  otpInfo: {
    fontSize: 15,
    color: "#6C7278",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
  },

  signInBtn: {
    backgroundColor: "#00C4CC",
    borderRadius: 14,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },

  btnDisabled: {
    opacity: 0.6,
  },

  signInText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  resendBtn: {
    marginTop: 16,
    alignItems: "center",
  },

  resendText: {
    fontSize: 15,
    color: "#00C4CC",
  },

  bottomText: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 15,
    color: "#1C1C1E",
  },
});