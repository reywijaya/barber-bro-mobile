import {SafeAreaProvider} from "react-native-safe-area-context";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./app/AppNavigator";
import {Provider} from "react-redux";

import store from "./app/store";
import { AlertNotificationRoot } from "react-native-alert-notification";



export default function App() {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <AlertNotificationRoot>
                        <AppNavigator/>
                    </AlertNotificationRoot>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}