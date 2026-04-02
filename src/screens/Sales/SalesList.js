import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {Surface, Text, DataTable, IconButton, Searchbar, Button, Chip, Tooltip} from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { SalesService } from '../../services/SaleService'; // SalesService yaratmalısan

export default function SalesList({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [sales, setSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSales = async () => {
        setLoading(true);
        try {
            // Axtarış və ya filtrasiya ilə satışları gətiririk
            const data = await SalesService.getSales(searchQuery);
            setSales(data);
        } catch (error) {
            console.error("Satışlar yüklənərkən xata:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSales(); }, [searchQuery]);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'ödenilib': return { bg: '#dcfce7', text: '#10b981' };
            case 'gözləyir': return { bg: '#fef9c3', text: '#ca8a04' };
            case 'borc': return { bg: '#fee2e2', text: '#ef4444' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={sales}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <Surface style={styles.header} elevation={2}>
                        <View style={styles.headerActionRow}>
                            <Searchbar
                                placeholder="Müştəri və ya Sənəd №..."
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                                elevation={0}
                            />
                            <Button
                                mode="contained"
                                icon="cart-plus"
                                onPress={() => navigation.navigate('SaleForm')}
                                style={styles.addBtn}
                            >
                                Satış
                            </Button>
                        </View>

                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={{ flex: 1.5 }} textStyle={styles.headerText}>Tarix / №</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>Müştəri</DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1.2 }} textStyle={styles.headerText}>Məbləğ</DataTable.Title>
                            <DataTable.Title style={{ flex: 1.2, justifyContent: 'center' }} textStyle={styles.headerText}>Status</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.6 }}></DataTable.Title>
                        </DataTable.Header>
                    </Surface>
                )}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                        <Surface style={styles.rowCard} elevation={1}>
                            <DataTable.Row style={styles.row} onPress={() => navigation.navigate('SaleDetails', { saleId: item.id })}>
                                <DataTable.Cell style={{ flex: 1.5 }}>
                                    <View>
                                        <Text style={styles.dateText}>{item.date}</Text>
                                        <Text style={styles.docNo}>#{item.docNo}</Text>
                                    </View>
                                </DataTable.Cell>

                                <DataTable.Cell style={{ flex: 2 }}>
                                    <Text style={styles.customerName} numberOfLines={1}>{item.customerName}</Text>
                                </DataTable.Cell>

                                <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                    <Text style={styles.amountText}>{item.totalAmount.toFixed(2)} AZN</Text>
                                </DataTable.Cell>

                                <DataTable.Cell style={{ flex: 1.2, justifyContent: 'center' }}>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </DataTable.Cell>

                                <DataTable.Cell style={{ flex: 0.6, justifyContent: 'flex-end' }}>
                                    <Tooltip title="Detallara bax">
                                        <IconButton
                                            icon="eye"
                                            iconColor={Colors.primary} // Senin turuncu tonun
                                            size={23}
                                            mode="contained-tonal" // Hafif arka plan rengi ekler, daha şık durur
                                            onPress={() => navigation.navigate('SaleDetails', { saleId: item.id })}
                                            style={{ margin: 0 }}
                                        />
                                    </Tooltip>
                                </DataTable.Cell>
                            </DataTable.Row>
                        </Surface>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    header: { backgroundColor: 'white' },
    headerActionRow: { flexDirection: 'row', padding: 12, alignItems: 'center', gap: 10 },
    searchBar: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, height: 45 },
    addBtn: { backgroundColor: Colors.primary, borderRadius: 8 },
    tableHeader: {
        backgroundColor: '#f8fafc',
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0'
    },
    headerText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1e293b',
        textTransform: 'uppercase',
    },
    rowCard: {
        marginBottom: 8,
        marginHorizontal: 12,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    row: { height: 75, paddingVertical: 8 },
    dateText: { fontSize: 13, fontWeight: '600', color: '#334155' },
    docNo: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
    customerName: { fontWeight: '700', fontSize: 14, color: '#1e293b' },
    amountText: { fontWeight: 'bold', fontSize: 14, color: Colors.primary },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
});