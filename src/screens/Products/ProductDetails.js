import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Surface, Text, IconButton, Button, Divider } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ProductService } from '../../services/ProductService'; // Service importu

const { width } = Dimensions.get('window');

export default function ProductDetails({ route, navigation }) {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProductDetails = async () => {
        setLoading(true);
        try {
            const data = await ProductService.getProductById(productId);
            setProduct(data);
        } catch (error) {
            console.error("Detalları yükləyərkən xəta:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProductDetails();
    }, [productId]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={{ marginTop: 10, color: '#64748b' }}>Yüklənir...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.centered}>
                <Text>Məhsul tapılmadı.</Text>
                <Button onPress={() => navigation.goBack()}>Geri qayıt</Button>
            </View>
        );
    }

    const profitPerUnit = product.sellingPrice - product.buyingPrice;
    const totalPotentialProfit = profitPerUnit * product.stock;
    const margin = ((profitPerUnit / product.buyingPrice) * 100).toFixed(1);

    return (
        <View style={styles.container}>
            <Surface style={styles.detailHeader} elevation={2}>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.detailName} numberOfLines={1}>{product.name}</Text>
                </View>
                <IconButton icon="refresh" onPress={loadProductDetails} />
            </Surface>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.statsGrid}>
                    <DetailCard title="Mövcud Stok" value={`${product.stock} ədəd`} icon="package-variant" color="#3b82f6" />
                    <DetailCard title="Vahid Çəki" value={`${product.weight} kg`} icon="weight-kilogram" color="#8b5cf6" />
                    <DetailCard title="Alış Qiyməti" value={`${product.buyingPrice.toFixed(2)} ₼`} icon="arrow-down-circle" color="#ef4444" />
                    <DetailCard title="Satış Qiyməti" value={`${product.sellingPrice.toFixed(2)} ₼`} icon="arrow-up-circle" color="#10b981" />
                </View>

                <Surface style={styles.analysisCard} elevation={1}>
                    <Text style={styles.analysisTitle}>Maliyyə Analizi</Text>
                    <Divider style={styles.divider} />

                    <View style={styles.analysisRow}>
                        <Text style={styles.label}>Vahid Mənfəət:</Text>
                        <Text style={[styles.profitText, { color: '#10b981' }]}>+{profitPerUnit.toFixed(2)} AZN</Text>
                    </View>

                    <View style={styles.analysisRow}>
                        <Text style={styles.label}>Mənfəət Marjası:</Text>
                        <Text style={[styles.profitText, { color: '#8b5cf6' }]}>%{margin}</Text>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.analysisRow}>
                        <Text style={styles.label}>Ümumi Potensial Qazanc:</Text>
                        <Text style={styles.totalProfitValue}>{totalPotentialProfit.toLocaleString()} AZN</Text>
                    </View>
                </Surface>

                <Button
                    mode="contained"
                    icon="pencil"
                    style={styles.editBtn}
                    onPress={() => console.log("Edit ID:", product.id)}
                >
                    Məlumatları Yenilə
                </Button>
            </ScrollView>
        </View>
    );
}

const DetailCard = ({ title, value, icon, color }) => (
    <Surface style={styles.miniCard} elevation={1}>
        <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
            <IconButton icon={icon} iconColor={color} size={24} />
        </View>
        <Text style={styles.miniTitle}>{title}</Text>
        <Text style={[styles.miniValue, { color }]}>{value}</Text>
    </Surface>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    detailHeader: { flexDirection: 'row', alignItems: 'center', paddingTop: 5, paddingBottom: 5, paddingHorizontal: 10, backgroundColor: 'white' },
    headerTitleContainer: { flex: 1, marginLeft: 5 },
    detailName: { fontSize: 16, fontWeight: 'bold', color: '#1e293b' },
    detailId: { fontSize: 12, color: '#64748b' },
    scrollContent: { flex: 1, padding: 16 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
    miniCard: { width: width * 0.38, padding: 16, borderRadius: 16, backgroundColor: 'white', alignItems: 'center', marginBottom: 12 },
    iconCircle: { borderRadius: 25, marginBottom: 8 },
    miniTitle: { fontSize: 12, color: '#64748b', marginBottom: 4 },
    miniValue: { fontSize: 16, fontWeight: 'bold' },
    analysisCard: { padding: 20, borderRadius: 16, backgroundColor: 'white', marginBottom: 25 },
    analysisTitle: { fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 },
    analysisRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, alignItems: 'center' },
    label: { color: '#64748b', fontSize: 14 },
    divider: { marginVertical: 8, backgroundColor: '#f1f5f9' },
    profitText: { fontWeight: 'bold', fontSize: 15 },
    totalProfitValue: { fontSize: 20, fontWeight: 'bold', color: '#10b981' },
    editBtn: { borderRadius: 12, paddingVertical: 6, backgroundColor: Colors.primary }
});

