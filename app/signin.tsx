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

export default function SignInPage() {
  const [selectedCountry, setSelectedCountry] = useState(
    countryData.find((c) => c.code === "LB") || countryData[0]
  );
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [errors, setErrors] = useState({ phone: "", password: "" });

  // PHONE LENGTH LIMITS FOR ARAB COUNTRIES
  const PHONE_LENGTHS: Record<string, number> = {
    LB: 8,
    SA: 9,
    AE: 9,
    JO: 9,
    QA: 8,
    KW: 8,
    BH: 8,
    OM: 8,
    IQ: 10,
    EG: 10,
    MA: 9,
    TN: 8,
    DZ: 9,
  };

  const maxLength = PHONE_LENGTHS[selectedCountry?.code] ?? 10;

  // PASSWORD RULES
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

  // SIGN IN FUNCTION
  const handleSignIn = async () => {
    let newErrors = { phone: "", password: "" };

    if (phone.length < maxLength)
      newErrors.phone = `Phone number must be ${maxLength} digits`;

    if (!passwordIsValid)
      newErrors.password = "Invalid password";

    setErrors(newErrors);

    if (newErrors.phone || newErrors.password) return;

    const fullPhone = `${selectedCountry.dial_code}${phone}`;

    // 1️⃣ SIGN IN USING SUPABASE
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        phone: fullPhone,
        password: password,
      });

    if (authError) {
      setErrors((prev) => ({
        ...prev,
        password: authError.message,
      }));
      return;
    }

    const userId = authData.user.id;

    // 2️⃣ FETCH PROFILE
    const { data: profile, error: profileError } = await supabase
      .from("Customer_profiles_ORDO")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.log("PROFILE FETCH ERROR:", profileError.message);
      return;
    }

    console.log("SIGNED-IN PROFILE:", profile);

    router.push("/home");
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.screen}>
          {/* CLOSE BUTTON */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
            <Ionicons name="close" size={26} color="#1C1C1E" />
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.headerTop}>
            <View style={styles.logoBadge}>
              <Ionicons name="location-outline" size={46} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Sign in using your phone number to continue
          </Text>

          {/* PHONE ROW */}
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
              placeholder=""
              placeholderTextColor="transparent"
            />
          </View>

          {errors.phone ? (
            <Text style={styles.error}>{errors.phone}</Text>
          ) : null}

          {/* PASSWORD */}
          <View
            style={[
              styles.passwordRow,
              { borderColor: errors.password ? "#FF6F61" : "#D0D3D5" },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#8A8E94" />
            <TextInput
              style={styles.passwordInput}
              secureTextEntry={!passwordVisible}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#8A8E94"
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

              <View style={{ marginTop: 6, marginLeft: 6 }}>
                <Text style={[styles.req, passwordRules.length && styles.reqOK]}>
                  • Minimum 6 characters
                </Text>
                <Text style={[styles.req, passwordRules.upper && styles.reqOK]}>
                  • One uppercase letter
                </Text>
                <Text style={[styles.req, passwordRules.lower && styles.reqOK]}>
                  • One lowercase letter
                </Text>
                <Text style={[styles.req, passwordRules.number && styles.reqOK]}>
                  • One number
                </Text>
              </View>
            </>
          ) : null}

          <TouchableOpacity style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Forget password?</Text>
          </TouchableOpacity>

          {/* SIGN IN BUTTON */}
          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* DIVIDER */}
          <View className="flex-row items-center mt-6">
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          {/* BOTTOM BUTTONS */}
          <View style={styles.twoButtons}>
            <TouchableOpacity style={styles.outlineBtn}>
              <Ionicons name="headset-outline" size={22} color="#00C4CC" />
              <Text style={styles.outlineText}>
                Contact Our{"\n"}Help Center
              </Text>
            </TouchableOpacity>

           <TouchableOpacity
  style={styles.outlineBtn}
  onPress={() => router.push("/signup")}
>
  <Ionicons name="person-add-outline" size={22} color="#00C4CC" />
  <Text style={styles.outlineText}>
    Create an{"\n"}Account
  </Text>
</TouchableOpacity>

          </View>
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

  closeBtn: {
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
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#8A8E94",
  },

  phoneRow: {
    marginTop: 30,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    gap: 10,
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

  passwordRow: {
    marginTop: 16,
    backgroundColor: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: "#1C1C1E",
  },

  error: {
    color: "#FF6F61",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 6,
  },

  req: {
    color: "#8A8E94",
    fontSize: 13,
    marginTop: 2,
  },

  reqOK: {
    color: "#00C4CC",
    fontWeight: "600",
  },

  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: 6,
  },

  forgotText: {
    color: "#00C4CC",
    fontSize: 15,
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
    fontWeight: "600",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D3D5",
  },

  orText: {
    marginHorizontal: 10,
    color: "#8A8E94",
    fontSize: 14,
  },

  twoButtons: {
    flexDirection: "row",
    marginTop: 26,
    justifyContent: "space-between",
  },

  outlineBtn: {
    width: "48%",
    borderWidth: 2,
    borderColor: "#00C4CC",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  outlineText: {
    textAlign: "center",
    fontSize: 14,
    color: "#1C1C1E",
    lineHeight: 18,
  },
});
