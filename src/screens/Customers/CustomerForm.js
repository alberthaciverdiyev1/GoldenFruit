import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { IconButton, Surface, Button, Divider } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function CustomerForm({ route, navigation }) {
    const initialCustomer = route.params?.customer || null;
    const isEdit = !!initialCustomer;

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (isEdit) {
            setFormData({
                name: initialCustomer.name || '',
                surname: initialCustomer.surname || '',
                phone: initialCustomer.phone || '',
                address: initialCustomer.address || ''
            });
        }
    }, [initialCustomer]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: '#f8fafc' }}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Surface style={styles.card}>
                    <View style={styles.header}>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.pageTitle}>
                                {isEdit ? 'Müştəri Məlumatlarını Yenilə' : 'Yeni Müştəri Əlavə Et'}
                            </Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={styles.formContainer}>
                        <View style={styles.formControl}>
                            <Text style={styles.label}>Ad</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Adı daxil edin"
                                value={formData.name}
                                onChangeText={(text) => setFormData({...formData, name: text})}
                                placeholderTextColor="#94a3b8"
                            />
                        </View>

                        <View style={styles.formControl}>
                            <Text style={styles.label}>Soyad</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Soyadı daxil edin"
                                value={formData.surname}
                                onChangeText={(text) => setFormData({...formData, surname: text})}
                                placeholderTextColor="#94a3b8"
                            />
                        </View>

                        <View style={styles.formControl}>
                            <Text style={styles.label}>Telefon</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="+994"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({...formData, phone: text})}
                                placeholderTextColor="#94a3b8"
                            />
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.btnAction, styles.btnSave]}
                                onPress={() => {
                                    console.log("Yadda saxlanıldı:", formData);
                                    navigation.goBack();
                                }}
                            >
                                <Text style={styles.btnTextWhite}>
                                    {isEdit ? 'Dəyişiklikləri Saxla' : 'Müştərini Əlavə Et'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.btnAction, styles.btnCancel]}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.btnTextGrey}>İmtina Et və Geri Qayıt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Surface>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20,
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    card: {
        width: '100%',
        maxWidth: 550,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    titleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -15, // Icon-u sola sıxmaq üçün
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    divider: {
        marginBottom: 20,
        backgroundColor: '#f1f5f9'
    },
    formContainer: {
        width: '100%',
    },
    formControl: {
        marginBottom: 20
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        color: '#475569'
    },
    input: {
        backgroundColor: '#f8fafc',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        color: '#1e293b',
    },
    buttonGroup: {
        marginTop: 10,
        display: 'flex',
    },
    btnAction: {
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    btnSave: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    btnCancel: {
        backgroundColor: '#f1f5f9',
    },
    btnTextWhite: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    btnTextGrey: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 15
    }
});