import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerList from '../screens/Customers/CustomerList';
import CustomerForm from '../screens/Customers/CustomerForm';
import { Colors } from '../constants/Colors';
import CustomerDetails from "../screens/Customers/CustomerDetails";

const Stack = createStackNavigator();

export default function CustomerStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen name="CustomerList" component={CustomerList} />
            <Stack.Screen name="CustomerForm" component={CustomerForm} />
            <Stack.Screen name="CustomerDetails" component={CustomerDetails} />
        </Stack.Navigator>
    );
}