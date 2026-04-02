import React, { useEffect, useState } from 'react';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const theme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#f47008',
        secondary: '#f2f2f2',
    },
};

export default function App() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    ...MaterialCommunityIcons.font,
                });
            } catch (e) {
                console.warn("Font yüklenirken hata oluştu:", e);
            } finally {
                setFontsLoaded(true);
            }
        }
        loadFonts();
    }, []);

    // Fontlar yüklenene kadar boş dön (ReferenceError'u engeller)
    if (!fontsLoaded) {
        return null;
    }

    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <DrawerNavigator />
            </NavigationContainer>
        </PaperProvider>
    );
}