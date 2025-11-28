import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,Pressable,
} from "react-native";

interface OTPProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

export default function OTPPopup({ visible, onClose, onSubmit }: OTPProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Slide-up animation
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
      setCode(["", "", "", "", "", ""]);
    }
  }, [visible]);

  // Auto-submit on full code
  useEffect(() => {
    const joined = code.join("");
    if (joined.length === 6) {
      onSubmit(joined);
    }
  }, [code]);

  const handleDigit = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
    inputs.current[index + 1]?.focus();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable onPress={onClose} style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.center}
      >
        <Animated.View
          style={[
            styles.popup,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>We sent a 6-digit code to your phone</Text>

          {/* OTP INPUT */}
          <View style={styles.row}>
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => {inputs.current[i] = ref;}}
                style={styles.box}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(v) => handleDigit(v, i)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  center: {
    flex: 1,
    justifyContent: "flex-end",
  },

  popup: {
    backgroundColor: "#FFF",
    padding: 24,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: "#8A8E94",
    marginBottom: 22,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  box: {
    width: 46,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#F1F3F5",
    textAlign: "center",
    fontSize: 20,
    color: "#1C1C1E",
  },

  closeBtn: {
    marginTop: 10,
    alignSelf: "center",
  },

  closeText: {
    color: "#00C4CC",
    fontSize: 16,
    fontWeight: "600",
  },
});
