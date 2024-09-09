import { ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AboutScreen = ({ navigation }) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-col items-center justify-center min-h-screen">
          <Image
            source={require("../../assets/lazy.png")}
            style={{ width: 200, height: 200 }}
          />
          <Text className="text-zinc-900 text-lg font-bold text-center">
            Oops.. Under construction!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutScreen;
