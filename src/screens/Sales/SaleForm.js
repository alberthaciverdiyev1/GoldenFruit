import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, Text, TextInput, Button, IconButton, DataTable, Card, ActivityIndicator } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { SalesService } from '../../services/SaleService';

export default function SaleForm({ route, navigation }) {
    // Əgər route.params.saleId varsa 'Edit', yoxdursa 'Add' rejimidir
    const saleId = route.params?.saleId;
    const isEditing = !!saleId;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [customerName, setCustomerName] = useState('');
    const [status, setStatus] = useState('Gözləyir');
    const [items, setItems] = useState([]);

    // Edit rejimidirsa mövcud məlumatları çək
    useEffect(() => {
        if (isEditing) {
            const fetchSale = async () => {
                try {
                    const sale = await SalesService.getSaleById(saleId);
                    if (sale) {
                        setCustomerName(sale.customerName);
                        setStatus(sale.status);
                        setItems(sale.items || []);
                    }
                } catch (error) {
                    Alert.alert("Xəta", "Məlumat gətirilərkən xəta baş verdi.");
                } finally {
                    setFetching(false);
                }
            };
            fetchSale();
        }
    }, [saleId]);

    const addNewItem = () => {
        setItems([...items, { name: '', quantity: '1', price: '0' }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) =>
            sum + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0)), 0
        );
    };

    const handleSave = async () => {
        if (!customerName || items.length === 0) {
            Alert.alert("Xəta", "Müştəri və ən azı bir məhsul daxil edin.");
            return;
        }

        setLoading(true);
        try {
            const saleData = {
                customerName,
                status,
                items: items.map(i => ({
                    ...i,
                    quantity: parseFloat(i.quantity),
                    price: parseFloat(i.price)
                })),
                totalAmount: calculateTotal(),
            };

            if (isEditing) {
                await SalesService.updateSale(saleId, saleData);
            } else {
                await SalesService.createSale(saleData);
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert("Xəta", "Yadda saxlayarkən problem yarandı.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>;

    return (
        <View style={styles.container}>
            {/* Header Bölməsi */}
            <Surface style={styles.header} elevation={1}>
                <View style={styles.headerRow}>
                    <IconButton icon="close" onPress={() => navigation.goBack()} />
                    <Text style={styles.headerTitle}>
                        {isEditing ? `Satışı Redaktə Et (#${saleId})` : "Yeni Satış"}
                    </Text>
                </View>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    style={styles.saveBtn}
                    contentStyle={{ paddingHorizontal: 10 }}
                >
                    {isEditing ? "Yenilə" : "Yadda Saxla"}
                </Button>
            </Surface>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Müştəri və Status Kartı */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.inputGroup}>
                            <TextInput
                                label="Müştəri Adı"
                                value={customerName}
                                onChangeText={setCustomerName}
                                mode="outlined"
                                style={[styles.input, { flex: 2 }]}
                                activeOutlineColor={Colors.primary}
                            />
                            {isEditing && (
                                <TextInput
                                    label="Status"
                                    value={status}
                                    onChangeText={setStatus}
                                    mode="outlined"
                                    style={[styles.input, { flex: 1, marginLeft: 10 }]}
                                    activeOutlineColor={Colors.primary}
                                />
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {/* Məhsul Cədvəli */}
                <Surface style={styles.itemsCard} elevation={1}>
                    <View style={styles.tableHeaderRow}>
                        <Text style={styles.tableTitle}>Satılan Məhsullar</Text>
                        <Button
                            icon="plus-circle"
                            onPress={addNewItem}
                            textColor={Colors.primary}
                        >
                            Sətir Əlavə Et
                        </Button>
                    </View>

                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={{ flex: 3 }}>Məhsul</DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1.2 }}>Miqdar</DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1.2 }}>Qiymət</DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 0.5 }}></DataTable.Title>
                        </DataTable.Header>

                        {items.map((item, index) => (
                            <DataTable.Row key={index} style={styles.tableRow}>
                                <DataTable.Cell style={{ flex: 3 }}>
                                    <TextInput
                                        value={item.name}
                                        onChangeText={(v) => updateItem(index, 'name', v)}
                                        placeholder="Məhsul adı..."
                                        dense
                                        underlineColor="transparent"
                                        style={styles.tableInput}
                                    />
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                    <TextInput
                                        value={String(item.quantity)}
                                        keyboardType="numeric"
                                        onChangeText={(v) => updateItem(index, 'quantity', v)}
                                        dense
                                        style={styles.tableInput}
                                    />
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                    <TextInput
                                        value={String(item.price)}
                                        keyboardType="numeric"
                                        onChangeText={(v) => updateItem(index, 'price', v)}
                                        dense
                                        style={styles.tableInput}
                                    />
                                </DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 0.5 }}>
                                    <IconButton
                                        icon="trash-can-outline"
                                        iconColor="#ef4444"
                                        size={18}
                                        onPress={() => removeItem(index)}
                                    />
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </Surface>

                {/* Toplam Hesab Paneli */}
                <Surface style={styles.totalPanel} elevation={3}>
                    <View>
                        <Text style={styles.totalLabel}>Toplam Ödəniş</Text>
                        <Text style={styles.totalValue}>{calculateTotal().toFixed(2)} AZN</Text>
                    </View>
                    <IconButton icon="calculator" iconColor="white" size={30} />
                </Surface>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0'
    },
    headerRow: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginLeft: 5 },
    saveBtn: { backgroundColor: Colors.primary, borderRadius: 10 },
    scrollContent: { padding: 16 },
    card: { marginBottom: 16, backgroundColor: 'white', borderRadius: 12, elevation: 1 },
    inputGroup: { flexDirection: 'row', alignItems: 'center' },
    input: { backgroundColor: 'white' },
    itemsCard: { backgroundColor: 'white', borderRadius: 12, paddingBottom: 10, overflow: 'hidden' },
    tableHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f1f5f9'
    },
    tableTitle: { fontSize: 15, fontWeight: 'bold', color: '#334155' },
    tableHeader: { borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    tableRow: { height: 65 },
    tableInput: { backgroundColor: 'transparent', height: 45, fontSize: 13, width: '100%' },
    totalPanel: {
        marginTop: 24,
        padding: 24,
        borderRadius: 15,
        backgroundColor: '#1e293b', // Modern tünd göy tonu
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalLabel: { color: '#94a3b8', fontSize: 14, fontWeight: '500' },
    totalValue: { color: 'white', fontSize: 28, fontWeight: 'bold' }
});