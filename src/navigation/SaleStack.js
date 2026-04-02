import {createStackNavigator} from "@react-navigation/stack";
import SalesList from "../screens/Sales/SalesList";
import SaleForm from "../screens/Sales/SaleForm";
import SaleDetails from "../screens/Sales/SaleDetails";
import React from "react";

const Stack = createStackNavigator();

export default function SaleStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen name="SalesList" component={SalesList} />
            <Stack.Screen name="SaleForm" component={SaleForm} />
            <Stack.Screen name="SaleDetails" component={SaleDetails} />
        </Stack.Navigator>
    );
}