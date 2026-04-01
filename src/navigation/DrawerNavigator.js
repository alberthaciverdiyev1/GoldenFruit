import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Colors } from '../constants/Colors';
import { useWindowDimensions } from 'react-native';

import CustomerScreen from '../screens/Customers/CustomerList';
import EmployeeScreen from '../screens/Employees/EmployeeList';
import ProductScreen from '../screens/Products/ProductList';
import CustomerStack from "./CustomerStack";
import ProductStack from "./ProductStack";
// import SaleScreen from '../screens/Sales/SaleList';
// import PurchaseScreen from '../screens/Purchases/PurchaseList';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    const dimensions = useWindowDimensions();

    const isLargeScreen = dimensions.width >= 768;

    return (
        <Drawer.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: '#fff',
                drawerActiveTintColor: Colors.primary,
                drawerActiveBackgroundColor: '#FFF5EE',
                drawerInactiveTintColor: '#333',
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerStyle: {
                    width: 240,
                    backgroundColor: '#fff',
                    borderRightWidth: 1,
                    borderRightColor: '#eee',
                },
            }}
        >
            <Drawer.Screen name="Müştərilər" component={CustomerStack} />
            <Drawer.Screen name="İşçilər" component={EmployeeScreen} />
            <Drawer.Screen name="Məhsullar" component={ProductStack} />
        </Drawer.Navigator>
    );
}