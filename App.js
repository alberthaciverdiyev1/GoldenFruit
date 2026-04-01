import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import {NavigationContainer} from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#f47008',
        secondary: '#f2f2f2',
    },
};

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <DrawerNavigator />
            </NavigationContainer>
        </PaperProvider>
    );
}