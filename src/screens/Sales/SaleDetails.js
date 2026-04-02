import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, Text, Divider, DataTable, IconButton, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { SalesService } from '../../services/SaleService';

export default function SaleDetails({ route, navigation }) {
    const { saleId } = route.params;
    const [loading, setLoading] = useState(true);
    const [sale, setSale] = useState(null);

    const fetchSaleDetails = async () => {
        setLoading(true);
        try {
            const data = await SalesService.getSaleById(saleId);
            setSale(data);
        } catch (error) {
            Alert.alert("Xəta", "Məlumatlar yüklənərkən xata baş verdi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaleDetails(); }, [saleId]);

    if (loading) return <View style={styles.center}><ActivityIndicator color={Colors.primary} /></View>;
    if (!sale) return <View style={styles.center}><Text>Məlumat tapılmadı.</Text></View>;

    return (
        <ScrollView style={styles.container}>
            {/* Header: Sənəd № və Status */}
            <Surface style={styles.headerCard} elevation={1}>
                <View style={styles.rowBetween}>
                    <View>
                        <Text style={styles.docNo}>Sənəd #{sale.docNo}</Text>
                        <Text style={styles.dateText}>{sale.date}</Text>
                    </View>
                    <Chip
                        selectedColor={sale.status === 'Ödənilib' ? '#10b981' : '#f59e0b'}
                        style={[styles.statusChip, { backgroundColor: sale.status === 'Ödənilib' ? '#dcfce7' : '#fef3c7' }]}
                    >
                        {sale.status}
                    </Chip>
                </View>
            </Surface>

            <View style={styles.contentLayout}>
                {/* Sol Tərəf: Müştəri və Ödənış Məlumatları */}
                <View style={styles.leftColumn}>
                    <Surface style={styles.infoCard} elevation={1}>
                        <Text style={styles.sectionTitle}>Müştəri Məlumatı</Text>
                        <Divider style={styles.divider} />
                        <View style={styles.infoRow}>
                            <IconButton icon="account" size={20} />
                            <Text style={styles.infoLabel}>{sale.customerName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <IconButton icon="phone" size={20} />
                            <Text style={styles.infoLabel}>+994 (50) 123 45 67</Text>
                        </View>
                    </Surface>

                    <Surface style={[styles.infoCard, { marginTop: 15 }]} elevation={1}>
                        <Text style={styles.sectionTitle}>Xülasə</Text>
                        <Divider style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Məhsul sayı:</Text>
                            <Text style={styles.summaryValue}>{sale.itemsCount}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Toplam Məbləğ:</Text>
                            <Text style={styles.totalAmount}>{sale.totalAmount.toFixed(2)} AZN</Text>
                        </View>
                        <Button
                            mode="contained"
                            style={styles.printBtn}
                            icon="printer"
                            onPress={() => console.log("Çap edilir...")}
                        >
                            Çap Et (PDF)
                        </Button>
                    </Surface>
                </View>

                {/* Sağ Tərəf: Satılan Məhsullar Siyahısı */}
                <View style={styles.rightColumn}>
                    <Surface style={styles.tableCard} elevation={1}>
                        <DataTable>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title style={{ flex: 3 }}>Məhsul Adı</DataTable.Title>
                                <DataTable.Title numeric style={{ flex: 1 }}>Say/Çəki</DataTable.Title>
                                <DataTable.Title numeric style={{ flex: 1 }}>Qiymət</DataTable.Title>
                                <DataTable.Title numeric style={{ flex: 1.2 }}>Cəm</DataTable.Title>
                            </DataTable.Header>

                            {/* Qeyd: Real datada item-lar sale.items içində olmalıdır */}
                            {(sale.items || []).map((item, index) => (
                                <DataTable.Row key={index}>
                                    <DataTable.Cell style={{ flex: 3 }}>
                                        <Text style={styles.productName}>{item.name}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric style={{ flex: 1 }}>{item.quantity}</DataTable.Cell>
                                    <DataTable.Cell numeric style={{ flex: 1 }}>{item.price.toFixed(2)}</DataTable.Cell>
                                    <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                        <Text style={styles.rowTotal}>{(item.quantity * item.price).toFixed(2)} AZN</Text>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </Surface>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerCard: { padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    docNo: { fontSize: 22, fontWeight: 'bold', color: '#1e293b' },
    dateText: { fontSize: 14, color: '#64748b', marginTop: 4 },
    statusChip: { borderRadius: 8 },
    contentLayout: { padding: 15, flexDirection: 'row', flexWrap: 'wrap' },

    // Desktop üçün 2 sütunlu düzən
    leftColumn: { flex: 1, minWidth: 300, marginRight: 15 },
    rightColumn: { flex: 2, minWidth: 500 },

    infoCard: { padding: 15, borderRadius: 10, backgroundColor: 'white' },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginBottom: 10 },
    divider: { marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginLeft: -10 },
    infoLabel: { fontSize: 14, color: '#475569' },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { color: '#64748b', fontSize: 14 },
    summaryValue: { fontWeight: 'bold', color: '#1e293b' },
    totalAmount: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
    printBtn: { marginTop: 10, borderRadius: 8, backgroundColor: '#334155' },

    tableCard: { borderRadius: 10, backgroundColor: 'white', overflow: 'hidden' },
    tableHeader: { backgroundColor: '#f1f5f9' },
    productName: { fontSize: 13, color: '#1e293b', fontWeight: '500' },
    rowTotal: { fontWeight: 'bold', color: '#1e293b' }
});