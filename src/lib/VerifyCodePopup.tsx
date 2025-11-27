import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

interface VerifyCodeProps {
  visible: boolean;
  phone: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VerifyCodePopup({
  visible,
  phone,
  onClose,
  onSuccess,
}: VerifyCodeProps) {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");

  // Countdown timer
  useEffect(() => {
    if (!visible) return;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const verifyCode = async () => {
    setError("");

    const res = await fetch("https://YOUR-SERVER/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    }).then((r) => r.json());

    if (!res.success) {
      setError(res.error);
      return;
    }

    onSuccess();
  };

  const resendCode = async () => {
    setTimer(60);

    await fetch("https://YOUR-SERVER/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
  };

  return (
    <Modal isVisible={visible} onBackdropPress={onClose}>
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700" }}>
          Enter Verification Code
        </Text>

        <Text style={{ marginTop: 10, color: "#8A8E94" }}>
          A 6-digit code was sent to {phone}
        </Text>

        <TextInput
          style={{
            marginTop: 20,
            borderWidth: 1,
            borderColor: "#D0D3D5",
            padding: 14,
            borderRadius: 14,
            fontSize: 20,
            textAlign: "center",
            letterSpacing: 6,
          }}
          maxLength={6}
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />

        {error ? (
          <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={{
            backgroundColor: "#00C4CC",
            padding: 14,
            marginTop: 20,
            borderRadius: 14,
          }}
          onPress={verifyCode}
        >
          <Text style={{ color: "#fff", textAlign: "center", fontSize: 18 }}>
            Verify
          </Text>
        </TouchableOpacity>

        {timer > 0 ? (
          <Text
            style={{
              marginTop: 10,
              textAlign: "center",
              color: "#8A8E94",
            }}
          >
            Resend code in {timer}s
          </Text>
        ) : (
          <TouchableOpacity onPress={resendCode}>
            <Text
              style={{
                textAlign: "center",
                marginTop: 10,
                color: "#00C4CC",
                fontWeight: "600",
              }}
            >
              Resend Code
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
}
