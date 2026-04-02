import {createStackNavigator} from "@react-navigation/stack";
import PurchaseList from "../screens/Purchases/PurchaseList";
import PurchaseForm from "../screens/Purchases/PurchaseForm";
import PurchaseDetails from "../screens/Purchases/PurchaseDetails";
import React from "react";

const Stack = createStackNavigator();

export default function PurchaseStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen name="PurchasesList" component={PurchaseList} />
            <Stack.Screen name="PurchaseForm" component={PurchaseForm} />
            <Stack.Screen name="PurchaseDetails" component={PurchaseDetails} />
        </Stack.Navigator>
    );
}