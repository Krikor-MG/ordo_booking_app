import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
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

  const passwordRules = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const passwordIsValid =
    passwordRules.length &&
    passwordRules.upper &&
    passwordRules.lower &&
    passwordRules.number;

  const handleSignUp = async () => {
    let newErrors = {
      fullName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    newErrors.fullName = validateFullName(fullName);

    if (phone.length < maxLength)
      newErrors.phone = `Phone number must be ${maxLength} digits`;

    if (!passwordIsValid)
      newErrors.password = "Password is not valid";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.values(newErrors).some((v) => v !== "")) return;

    const fullPhone = `${selectedCountry.dial_code}${phone}`;

    const { data: authData, error: signupError } = await supabase.auth.signUp({
      phone: fullPhone,
      password: password,
    });

    if (signupError) {
      setErrors((prev) => ({ ...prev, password: signupError.message }));
      return;
    }

    const user = authData.user;
    if (!user) return;

    await supabase.from("Costumer_profiles_ORDO").insert({
      user_id: user.id,
      full_name: fullName,
      country_code: selectedCountry.code,
      dial_code: selectedCountry.dial_code,
      phone,
      full_phone: fullPhone,
    });

    router.push("/");
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.screen}>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#1C1C1E" />
          </TouchableOpacity>

          <View style={styles.headerTop}>
            <View style={styles.logoBadge}>
              <Ionicons name="happy-outline" size={48} color="#FFF" />
            </View>
          </View>

          <Text style={styles.title}>Create New Account</Text>

          {/* FULL NAME */}
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={20} color="#8A8E94" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#8A8E94"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          {errors.fullName ? <Text style={styles.error}>{errors.fullName}</Text> : null}

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

          {/* PASSWORD */}
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#8A8E94" />
            <TextInput
              style={styles.input}
              secureTextEntry={!passwordVisible}
              placeholder="Password"
              placeholderTextColor="#8A8E94"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#1C1C1E"
              />
            </TouchableOpacity>
          </View>

          {errors.password ? (
            <>
              <Text style={styles.error}>{errors.password}</Text>

              <View style={styles.reqGrid}>
                <View style={styles.reqColumn}>
                  <Text style={[styles.req, passwordRules.upper && styles.reqOK]}>
                    • Uppercase
                  </Text>
                  <Text style={[styles.req, passwordRules.number && styles.reqOK]}>
                    • Number
                  </Text>
                </View>

                <View style={styles.reqColumn}>
                  <Text style={[styles.req, passwordRules.lower && styles.reqOK]}>
                    • Lowercase
                  </Text>
                  <Text style={[styles.req, passwordRules.length && styles.reqOK]}>
                    • 6+ chars
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          {/* CONFIRM PASSWORD */}
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#8A8E94" />
            <TextInput
              style={styles.input}
              secureTextEntry={!passwordVisible2}
              placeholder="Confirm Password"
              placeholderTextColor="#8A8E94"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setPasswordVisible2(!passwordVisible2)}>
              <Ionicons
                name={passwordVisible2 ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#1C1C1E"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          ) : null}

          {/* REGISTER BUTTON */}
          <TouchableOpacity style={styles.signInBtn} onPress={handleSignUp}>
            <Text style={styles.signInText}>Register</Text>
          </TouchableOpacity>

          {/* LOGIN LINK */}
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.bottomText}>
              Already have an account?{" "}
              <Text style={{ color: "#00C4CC", fontWeight: "700" }}>Sign In</Text>
            </Text>
          </TouchableOpacity>

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

  reqGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingHorizontal: 6,
  },

  reqColumn: {
    width: "48%",
  },

  req: {
    color: "#8A8E94",
    fontSize: 13,
    marginTop: 2,
  },

  reqOK: {
    color: "#00C4CC",
    fontWeight: "700",
  },

  signInBtn: {
    backgroundColor: "#00C4CC",
    borderRadius: 14,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },

  signInText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  bottomText: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 15,
    color: "#1C1C1E",
  },
});
