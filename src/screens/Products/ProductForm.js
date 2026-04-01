import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Surface, Text, Divider, TextInput, Button } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function ProductForm({ visible, onDismiss, formData, setFormData, onSave, isEditing }) {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
                <Surface style={styles.formCard}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Redaktə Et' : 'Yeni Məhsul'}</Text>
                    <Divider style={{ marginBottom: 15 }} />

                    <TextInput
                        label="Məhsul Adı"
                        mode="outlined"
                        value={formData.name}
                        onChangeText={t => setFormData({...formData, name: t})}
                        style={styles.input}
                    />

                    <View style={styles.rowInput}>
                        <TextInput
                            label="Sayı"
                            keyboardType="numeric"
                            mode="outlined"
                            value={formData.quantity}
                            onChangeText={t => setFormData({...formData, quantity: t})}
                            style={[styles.input, {flex: 1, marginRight: 8}]}
                        />
                        <TextInput
                            label="Anbar"
                            keyboardType="numeric"
                            mode="outlined"
                            value={formData.stock}
                            onChangeText={t => setFormData({...formData, stock: t})}
                            style={[styles.input, {flex: 1}]}
                        />
                    </View>

                    <View style={styles.rowInput}>
                        <TextInput
                            label="Alış ₼"
                            keyboardType="decimal-pad"
                            mode="outlined"
                            value={formData.buyingPrice}
                            onChangeText={t => setFormData({...formData, buyingPrice: t})}
                            style={[styles.input, {flex: 1, marginRight: 8}]}
                        />
                        <TextInput
                            label="Satış ₼"
                            keyboardType="decimal-pad"
                            mode="outlined"
                            value={formData.sellingPrice}
                            onChangeText={t => setFormData({...formData, sellingPrice: t})}
                            style={[styles.input, {flex: 1}]}
                        />
                    </View>

                    <TextInput
                        label="Çəki (kg)"
                        keyboardType="decimal-pad"
                        mode="outlined"
                        value={formData.weight}
                        onChangeText={t => setFormData({...formData, weight: t})}
                        style={styles.input}
                    />

                    <View style={styles.modalActions}>
                        <Button onPress={onDismiss}>Ləğv Et</Button>
                        <Button
                            mode="contained"
                            onPress={onSave}
                            style={{ backgroundColor: Colors.primary }}
                        >
                            Yadda Saxla
                        </Button>
                    </View>
                </Surface>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modal: { padding: 20 },
    formCard: { padding: 20, borderRadius: 12, backgroundColor: 'white', elevation: 5 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    input: { marginBottom: 10, backgroundColor: 'white' },
    rowInput: { flexDirection: 'row' },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 10 }
});