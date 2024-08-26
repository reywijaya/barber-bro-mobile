import {SafeAreaProvider} from "react-native-safe-area-context";
import {NavigationContainer} from "@react-navigation/native";
import AppNavigator from "./app/AppNavigator";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {reducers} from "./app/store";

const store = createStore(reducers)

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