import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useWindowDimensions, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

import EmployeeScreen from '../screens/Employees/EmployeeList';
import CustomerStack from "./CustomerStack";
import ProductStack from "./ProductStack";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// --- 1. MOBİL ÜÇÜN BOTTOM TAB NAVIGATOR ---
function MobileTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 5,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f1f5f9'
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500' }
            }}
        >
            <Tab.Screen
                name="Müştərilər"
                component={CustomerStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="İşçilər"
                component={EmployeeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="badge-account" color={color} size={size} />
                    )
                }}
            />
            <Tab.Screen
                name="Məhsullar"
                component={ProductStack}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="package-variant" color={color} size={size} />
                    )
                }}
            />
        </Tab.Navigator>
    );
}

export default function DrawerNavigator() {
    const dimensions = useWindowDimensions();
    const isLargeScreen = dimensions.width >= 768;
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: Colors.primary,
                drawerActiveBackgroundColor: '#FFF5EE',
                drawerInactiveTintColor: '#333',
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerStyle: isLargeScreen ? {
                    width: 240,
                    backgroundColor: '#fff',
                    borderRightWidth: 1,
                    borderRightColor: '#eee',
                } : { width: 0 },
            }}
        >
            <Drawer.Screen
                name="MainContent"
                // Əgər böyük ekrandırsa Stack-ləri birbaşa göstər, mobildirsə Tab-ı göstər
                component={isLargeScreen ? CustomerStack : MobileTabs}
                options={{
                    drawerLabel: 'Müştərilər',
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={size} />
                    )
                }}
            />

            {/* Desktop Drawer-də digər düymələr */}
            {isLargeScreen && (
                <>
                    <Drawer.Screen
                        name="İşçilər"
                        component={EmployeeScreen}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="badge-account" color={color} size={size} />
                            )
                        }}
                    />
                    <Drawer.Screen
                        name="Məhsullar"
                        component={ProductStack}
                        options={{
                            drawerIcon: ({ color, size }) => (
                                <MaterialCommunityIcons name="package-variant" color={color} size={size} />
                            )
                        }}
                    />
                </>
            )}
        </Drawer.Navigator>
    );
}