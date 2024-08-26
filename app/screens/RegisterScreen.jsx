import { useMemo, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RadioGroup from "react-native-radio-buttons-group";
import axiosInstance from "../service/axios";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGender, setSelectedGender] = useState(null);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!name || !gender || !phone || !address || !email || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    if (!/^\d{10,13}$/.test(phone)) {
      Alert.alert("Error", "Phone number must be between 10 and 13 digits.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long, start with a capital letter, and contain at least one number."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const data = {
      name,
      gender,
      phone,
      address,
      email,
      password,
    };

    try {
      const response = await axiosInstance.post("/users", data);
      console.log(response.data);
      Alert.alert("Success", "Registration Successful!");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error.message);
      Alert.alert("Error", "Failed to register. Please try again.");
    }
  };

  const radioButtons = useMemo(
    () => [
      {
        id: "male",
        label: "Male",
        value: "male",
        color: "#2196F3",
        selectedColor: "#2196F3",
        unselectedColor: "#1B1A17",
        labelStyle: { color: "white" },
      },
      {
        id: "female",
        label: "Female",
        value: "female",
        color: "#FF69B4",
        selectedColor: "#FF69B4",
        unselectedColor: "#1B1A17",
        labelStyle: { color: "white" },
      },
    ],
    []
  );

  const handleGenderChange = (id) => {
    setSelectedGender(id);
    setGender(radioButtons.find((item) => item.id === id).value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Register</Text>
          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={(text) => setName(text)}
              style={styles.input}
            />
            <Text style={styles.label}>Gender</Text>
            <RadioGroup
              layout="row"
              radioButtons={radioButtons}
              onPress={handleGenderChange}
              selectedId={selectedGender}
              containerStyle={styles.radioGroup}
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={(text) => setPhone(text)}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Address</Text>
            <TextInput
              placeholder="Address"
              placeholderTextColor="#aaa"
              value={address}
              onChangeText={(text) => setAddress(text)}
              style={styles.input}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
              keyboardType="email-address"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              style={styles.input}
            />
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1A17",
  },
  scrollView: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    marginVertical: 24,
    textAlign: "center",
    color: "white",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "white",
  },
  input: {
    height: 40,
    borderColor: "#444",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "white",
    backgroundColor: "#333",
  },
  radioGroup: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});


