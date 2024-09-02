import {SafeAreaProvider} from "react-native-safe-area-context";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./app/AppNavigator";
import {Provider} from "react-redux";

import store from "./app/store";



export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <AppNavigator/>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}