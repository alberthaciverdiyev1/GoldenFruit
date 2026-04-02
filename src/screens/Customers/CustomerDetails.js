import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { Surface, Text, DataTable, IconButton, Button, SegmentedButtons, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker'; // Quraşdırılmalıdır
import { Colors } from '../../constants/Colors';
import { CustomerService } from '../../services/CustomerService';

const { width } = Dimensions.get('window');

export default function CustomerDetails({ route, navigation }) {
    const { customer = {} } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [filterType, setFilterType] = useState('All');

    // Tarixlər artıq Date obyekti olaraq saxlanılır
    const [startDate, setStartDate] = useState(new Date(2026, 2, 1)); // 1 Mart 2026
    const [endDate, setEndDate] = useState(new Date(2026, 2, 31));   // 31 Mart 2026

    // Picker görünürlük state-ləri
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // API üçün tarixi formatlayan funksiya (YYYY-MM-DD)
    const formatDate = (date) => date.toISOString().split('T')[0];

    const fetchData = async () => {
        if (!customer.id) return;
        setLoading(true);
        try {
            const res = await CustomerService.getDetails(
                customer.id,
                formatDate(startDate),
                formatDate(endDate),
                filterType
            );
            setData(res);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filterType, startDate, endDate]);

    const onStartChange = (event, selectedDate) => {
        setShowStartPicker(false);
        if (selectedDate) setStartDate(selectedDate);
    };

    const onEndChange = (event, selectedDate) => {
        setShowEndPicker(false);
        if (selectedDate) setEndDate(selectedDate);
    };

    if (loading && !data) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.customerName}>{customer.name} {customer.surname}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* KPI Section */}
                <View style={width < 768 ? styles.kpiColumn : styles.kpiRow}>
                    <StatCard title="Ümumi Satiş" value={`${data?.totalSales} AZN`} color="#10b981" icon="trending-up" />
                    <StatCard title="Ümumi Aliş" value={`${data?.totalPurchases} AZN`} color="#ef4444" icon="trending-down" />
                    <StatCard title="Cari Balans" value={`${data?.balance} AZN`} color={Colors.primary} icon="wallet" subtitle={`Tarix: ${data?.lastUpdate}`} />
                </View>

                {/* Filters & Date Pickers */}
                <Surface style={styles.filterCard} elevation={1}>
                    <Text style={styles.sectionTitle}>Filtrləmə və Tarix</Text>

                    <SegmentedButtons
                        value={filterType}
                        onValueChange={setFilterType}
                        buttons={[
                            { value: 'All', label: 'Hamısı' },
                            { value: 'Sale', label: 'Satışlar' },
                            { value: 'Purchase', label: 'Alışlar' },
                        ]}
                        style={styles.segmented}
                    />

                    <View style={styles.datePickerContainer}>
                        <TextInput
                            label="Başlanğıc"
                            value={formatDate(startDate)}
                            mode="outlined"
                            style={styles.dateInput}
                            editable={false}
                            right={<TextInput.Icon icon="calendar" onPress={() => setShowStartPicker(true)} />}
                            onTouchStart={() => setShowStartPicker(true)}
                        />
                        <TextInput
                            label="Bitmə"
                            value={formatDate(endDate)}
                            mode="outlined"
                            style={styles.dateInput}
                            editable={false}
                            right={<TextInput.Icon icon="calendar" onPress={() => setShowEndPicker(true)} />}
                            onTouchStart={() => setShowEndPicker(true)}
                        />
                    </View>

                    {/* Date Picker Modals */}
                    {showStartPicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onStartChange}
                        />
                    )}
                    {showEndPicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={onEndChange}
                        />
                    )}
                </Surface>

                {/* Transactions Table */}
                {/* Transactions Table */}
                <Surface style={styles.tableCard}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        <View style={{ width: width < 1024 ? 900 : width - 280, maxWidth: 1400 }}>
                            <DataTable>
                                <DataTable.Header style={styles.tableHeader}>
                                    <DataTable.Title style={{ flex: 1.2 }}>Tarix</DataTable.Title>
                                    <DataTable.Title style={{ flex: 1 }}>Növ</DataTable.Title>
                                    <DataTable.Title style={{ flex: 3 }}>Qeyd / Detallar</DataTable.Title>
                                    <DataTable.Title numeric style={{ flex: 1.5 }}>Məbləğ</DataTable.Title>
                                    <DataTable.Title numeric style={{ flex: 1.2 }}>Əməliyyat</DataTable.Title>
                                </DataTable.Header>

                                {loading ? (
                                    <View style={{ padding: 50, alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator size="large" color={Colors.primary} />
                                        <Text style={{ marginTop: 10, color: '#64748b' }}>Məlumatlar yenilənir...</Text>
                                    </View>
                                ) : (
                                    data?.transactions.map((t) => (
                                        <DataTable.Row key={t.id} style={styles.row}>
                                            <DataTable.Cell style={{ flex: 1.2 }}>{t.date}</DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 1 }}>
                                                <Text style={{ color: t.type === 'Sale' ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                                    {t.type === 'Sale' ? 'Satış' : 'Alış'}
                                                </Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell style={{ flex: 3 }}>{t.note}</DataTable.Cell>
                                            <DataTable.Cell numeric style={{ flex: 1.5 }}>
                                                <Text style={styles.amountText}>{t.amount.toFixed(2)} AZN</Text>
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric style={{ flex: 1.2 }}>
                                                <Button
                                                    mode="contained-tonal"
                                                    onPress={() => navigation.navigate('TransactionDetail', { id: t.id })}
                                                    contentStyle={{ height: 35 }}
                                                    labelStyle={{ fontSize: 11 }}
                                                >
                                                    Bax
                                                </Button>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    ))
                                )}

                                {/* Data boşdursa və loading deyilsə mesaj göstər */}
                                {!loading && data?.transactions.length === 0 && (
                                    <View style={{ padding: 20, alignItems: 'center' }}>
                                        <Text>Bu tarixlərdə əməliyyat tapılmadı.</Text>
                                    </View>
                                )}
                            </DataTable>
                        </View>
                    </ScrollView>
                </Surface>
            </ScrollView>
        </View>
    );
}

const StatCard = ({ title, value, color, icon, subtitle }) => (
    <Surface style={[styles.statCard, { borderLeftColor: color }]} elevation={2}>
        <View style={styles.statHeader}>
            <Text style={styles.statTitle}>{title}</Text>
            <IconButton icon={icon} iconColor={color} size={24} style={{ margin: 0 }} />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </Surface>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: 'white' },
    customerName: { fontSize: 22, fontWeight: 'bold',display:"flex",justifyContent:"center",alignItems: 'center' },
    customerSubtitle: { fontSize: 13, color: '#64748b' },
    scrollContent: { padding: 16, alignItems: 'center' },
    kpiRow: { flexDirection: 'row', gap: 16, marginBottom: 20, width: '100%', maxWidth: 1400 },
    kpiColumn: { flexDirection: 'column', gap: 12, marginBottom: 20, width: '100%' },
    statCard: { flex: 1, padding: 20, backgroundColor: 'white', borderRadius: 12, borderLeftWidth: 6 },
    statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statTitle: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
    statValue: { fontSize: 24, fontWeight: '800' },
    statSubtitle: { fontSize: 10, color: '#94a3b8' },
    filterCard: { padding: 20, borderRadius: 12, backgroundColor: 'white', marginBottom: 20, width: '100%', maxWidth: 1400 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    datePickerContainer: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    dateInput: { flex: 1, backgroundColor: 'white', height: 50 },
    segmented: { marginTop: 5, marginBottom: 20 },
    tableCard: { borderRadius: 12, backgroundColor: 'white', overflow: 'hidden', width: '100%', maxWidth: 1400 },
    tableHeader: { backgroundColor: '#f8fafc' },
    row: { height: 60, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    amountText: { fontWeight: 'bold', fontSize: 14 }
});