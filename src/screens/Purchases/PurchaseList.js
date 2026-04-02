import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, DataTable, IconButton, Searchbar, Button } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { PurchaseService } from '../../services/PurchaseService'; // Bunu bir azdan yaradacağıq

export default function PurchaseList({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [purchases, setPurchases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const data = await PurchaseService.getPurchases(searchQuery);
            setPurchases(data);
        } catch (error) {
            console.error("Alış siyahısı yüklənmədi:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPurchases(); }, [searchQuery]);

    return (
        <View style={styles.container}>
            <FlatList
                data={purchases}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={() => (
                    <Surface style={styles.header} elevation={2}>
                        <View style={styles.headerActionRow}>
                            <Searchbar
                                placeholder="Tədarükçü və ya Faktura №..."
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                                elevation={0}
                            />
                            <Button
                                mode="contained"
                                icon="truck-delivery"
                                onPress={() => navigation.navigate('PurchaseForm')}
                                style={styles.addBtn}
                            >
                                Yeni Alış
                            </Button>
                        </View>

                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title style={{ flex: 1.5 }} textStyle={styles.headerText}>Tarix / №</DataTable.Title>
                            <DataTable.Title style={{ flex: 2 }} textStyle={styles.headerText}>Tədarükçü</DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1.2 }} textStyle={styles.headerText}>Məbləğ</DataTable.Title>
                            <DataTable.Title style={{ flex: 1.2, justifyContent: 'center' }} textStyle={styles.headerText}>Status</DataTable.Title>
                            <DataTable.Title style={{ flex: 0.6 }}></DataTable.Title>
                        </DataTable.Header>
                    </Surface>
                )}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => (
                    <Surface style={styles.rowCard} elevation={1}>
                        <DataTable.Row style={styles.row} onPress={() => navigation.navigate('PurchaseDetails', { purchaseId: item.id })}>
                            <DataTable.Cell style={{ flex: 1.5 }}>
                                <View>
                                    <Text style={styles.dateText}>{item.date}</Text>
                                    <Text style={styles.docNo}>#{item.docNo}</Text>
                                </View>
                            </DataTable.Cell>

                            <DataTable.Cell style={{ flex: 2 }}>
                                <Text style={styles.supplierName} numberOfLines={1}>{item.supplierName}</Text>
                            </DataTable.Cell>

                            <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                <Text style={styles.amountText}>{item.totalAmount.toFixed(2)} AZN</Text>
                            </DataTable.Cell>

                            <DataTable.Cell style={{ flex: 1.2, justifyContent: 'center' }}>
                                <View style={[
                                    styles.statusBadge,
                                    { backgroundColor: item.status === 'Tamamlandı' ? '#dcfce7' : '#e2e8f0' }
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        { color: item.status === 'Tamamlandı' ? '#16a34a' : '#475569' }
                                    ]}>
                                        {item.status}
                                    </Text>
                                </View>
                            </DataTable.Cell>

                            <DataTable.Cell style={{ flex: 0.6, justifyContent: 'flex-end' }}>
                                <IconButton
                                    icon="pencil-outline"
                                    size={20}
                                    onPress={() => navigation.navigate('PurchaseForm', { purchaseId: item.id })}
                                />
                            </DataTable.Cell>
                        </DataTable.Row>
                    </Surface>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    header: { backgroundColor: 'white' },
    headerActionRow: { flexDirection: 'row', padding: 12, alignItems: 'center', gap: 10 },
    searchBar: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, height: 45 },
    addBtn: { backgroundColor: '#0f172a', borderRadius: 8 }, // Alış üçün daha tünd tonda bir rəng (Navy)
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
        backgroundColor: 'white'
    },
    row: { height: 75 },
    dateText: { fontSize: 13, fontWeight: '600', color: '#334155' },
    docNo: { fontSize: 11, color: '#94a3b8' },
    supplierName: { fontWeight: '700', fontSize: 14, color: '#1e293b' },
    amountText: { fontWeight: 'bold', fontSize: 14, color: '#0f172a' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
});