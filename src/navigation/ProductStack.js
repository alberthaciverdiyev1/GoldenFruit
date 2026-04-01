import {createStackNavigator} from "@react-navigation/stack";
import ProductList from "../screens/Products/ProductList";
import ProductForm from "../screens/Products/ProductForm";
import ProductDetails from "../screens/Products/ProductDetails";
import React from "react";

const Stack = createStackNavigator();

export default function ProductStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true
            }}
        >
            <Stack.Screen name="ProductList" component={ProductList} />
            <Stack.Screen name="ProductForm" component={ProductForm} />
            <Stack.Screen name="ProductDetails" component={ProductDetails} />
        </Stack.Navigator>
    );
}