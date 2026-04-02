import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, DataTable, IconButton, Searchbar, Button, Badge } from 'react-native-paper';
import { Colors } from '../../constants/Colors';
import { ProductService } from '../../services/ProductService';
import ProductForm from './ProductForm';

export default function ProductList({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '', quantity: '0', stock: '0', buyingPrice: '0', sellingPrice: '0', weight: '0'
    });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await ProductService.getProducts(searchQuery);
            setProducts(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [searchQuery]);

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                quantity: String(product.quantity),
                stock: String(product.stock),
                buyingPrice: String(product.buyingPrice),
                sellingPrice: String(product.sellingPrice),
                weight: String(product.weight)
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', quantity: '0', stock: '0', buyingPrice: '0', sellingPrice: '0', weight: '0' });
        }
        setVisible(true);
    };

    const handleSave = async () => {
        if (editingProduct) {
            await ProductService.updateProduct(editingProduct.id, formData);
        } else {
            await ProductService.createProduct(formData);
        }
        setVisible(false);
        fetchProducts();
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                ListHeaderComponent={() => (
                    <Surface style={styles.header} elevation={2}>
                        <View style={styles.headerActionRow}>
                            <Searchbar
                                placeholder="Axtar..."
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                                elevation={0}
                            />
                            <Button mode="contained" icon="plus" onPress={() => openModal()} style={styles.addBtn}>
                                Yeni
                            </Button>
                        </View>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title
                                style={{ flex: 2.5 }}
                                textStyle={styles.headerText}
                            >
                                Məhsul
                            </DataTable.Title>

                            <DataTable.Title
                                numeric
                                style={{ flex: 1 }}
                                textStyle={styles.headerText}
                            >
                                Stok
                            </DataTable.Title>

                            <DataTable.Title
                                numeric
                                style={{ flex: 1.2 }}
                                textStyle={styles.headerText}
                            >
                                Alış
                            </DataTable.Title>

                            <DataTable.Title
                                numeric
                                style={{ flex: 1.2 }}
                                textStyle={styles.headerText}
                            >
                                Satış
                            </DataTable.Title>

                            <DataTable.Title style={{ flex: 0.8 }}></DataTable.Title>
                        </DataTable.Header>
                    </Surface>
                )}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => (
                    <Surface style={styles.rowCard} elevation={1}>
                        <DataTable.Row style={styles.row} onPress={() => console.log("Details", item)}>
                            <DataTable.Cell style={{ flex: 2.5 }}>
                                <View>
                                    <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={{ flex: 1, }}>
                                <View style={[
                                    styles.stockBadge,
                                    { backgroundColor: item.stock < 50 ? '#fee2e2' : '#dcfce7' }
                                ]}>
                                    <Text style={[
                                        styles.stockText,
                                        { color: item.stock < 50 ? '#ef4444' : '#10b981' }
                                    ]}>
                                        {item.stock}
                                    </Text>
                                </View>
                            </DataTable.Cell>
                            <DataTable.Cell numeric style={{ flex: 1.2 }}>{item.buyingPrice.toFixed(2)} AZN</DataTable.Cell>
                            <DataTable.Cell numeric style={{ flex: 1.2 }}>{item.sellingPrice.toFixed(2)} AZN</DataTable.Cell>
                            <DataTable.Cell style={{ flex: 0.8, justifyContent: 'flex-end' }}>
                                <IconButton icon="pencil" size={18} onPress={() => openModal(item)} />
                                <IconButton icon="eye" size={18} onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} />
                            </DataTable.Cell>
                        </DataTable.Row>
                    </Surface>
                )}
            />

            <ProductForm
                visible={visible}
                onDismiss={() => setVisible(false)}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSave}
                isEditing={!!editingProduct}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f1f5f9' },
    header: { backgroundColor: 'white' },
    headerActionRow: { flexDirection: 'row', padding: 12, alignItems: 'center', gap: 10  },
    searchBar: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, height: 45 },
    addBtn: { backgroundColor: Colors.primary, borderRadius: 8 },
    tableHeader: {
        backgroundColor: '#f8fafc',
        height: 55,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0'
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e293b',
        textTransform: 'uppercase',
    },    rowCard: { marginBottom: 6, marginHorizontal: 10, borderRadius: 8, backgroundColor: 'white' },
    row: { height: 65 },
    productName: { fontWeight: 'bold', fontSize: 14 },
    productId: { fontSize: 10, color: '#64748b' },
    stockBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        minWidth: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    stockText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
});