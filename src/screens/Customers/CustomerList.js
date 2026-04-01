import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { DataTable, Button, Surface, IconButton } from 'react-native-paper';
import { Colors } from '../../constants/Colors';

export default function CustomerList({ navigation }) {
    const customers = [
        { id: '1', name: 'Albert', surname: 'Haciverdiyev', phone: '055-123-45-67' },
        { id: '2', name: 'Jale', surname: 'Quliyeva', phone: '050-987-65-43' },
    ];

    const handleDelete = (id) => {
        const confirm = window.confirm ? window.confirm("Bu müştərini silmək istədiyinizə əminsiniz?") : true;
        if (confirm) {
            console.log(id, "ID-li müştəri silindi");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={() => navigation.navigate('CustomerForm')}
                    style={styles.addButton}
                    labelStyle={styles.addButtonLabel}
                    buttonColor={Colors.primary}
                >
                    Yeni Müştəri
                </Button>
            </View>

            <Surface style={styles.surface}>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={styles.tableWrapper}>
                        <DataTable style={{ flex: 1 }}>
                            <DataTable.Header style={styles.tableHeader}>
                                <DataTable.Title textStyle={styles.headerText} style={{ flex: 2 }}>Ad</DataTable.Title>
                                <DataTable.Title textStyle={styles.headerText} style={{ flex: 2 }}>Soyad</DataTable.Title>
                                <DataTable.Title textStyle={styles.headerText} style={{ flex: 2 }}>Telefon</DataTable.Title>
                                <DataTable.Title textStyle={styles.headerText} style={styles.actionColumnHeader}>Əməliyyatlar</DataTable.Title>
                            </DataTable.Header>

                            {customers.map((item) => (
                                <DataTable.Row key={item.id} style={styles.row}>
                                    <DataTable.Cell textStyle={styles.cellText} style={{ flex: 2 }}>{item.name}</DataTable.Cell>
                                    <DataTable.Cell textStyle={styles.cellText} style={{ flex: 2 }}>{item.surname}</DataTable.Cell>
                                    <DataTable.Cell textStyle={styles.cellText} style={{ flex: 2 }}>{item.phone}</DataTable.Cell>

                                    <DataTable.Cell style={styles.actionCell}>
                                        <View style={styles.buttonGroup}>
                                            <IconButton
                                                icon="eye"
                                                iconColor="#6366f1"
                                                size={24}
                                                onPress={() => navigation.navigate('CustomerDetails',{ customer: item })}
                                            />
                                            <IconButton
                                                icon="pencil"
                                                iconColor={Colors.primary}
                                                size={24}
                                                onPress={() => navigation.navigate('CustomerForm', { customer: item })}
                                            />
                                            <IconButton
                                                icon="delete"
                                                iconColor="#ef4444"
                                                size={24}
                                                onPress={() => handleDelete(item.id)}
                                            />
                                        </View>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </View>
                </ScrollView>
            </Surface>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 15,
    },
    addButton: {
        borderRadius: 8,
        elevation: 2,
    },
    addButtonLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    surface: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: 'white',
        overflow: 'hidden',
        elevation: 1,
    },
    tableWrapper: {
        flex: 1,
        width: '100%',
        minWidth: 800,
    },
    tableHeader: {
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        height: 60,
    },
    headerText: {
        fontSize: 17, // Başlıq fontu
        fontWeight: 'bold',
        color: '#1e293b',
    },
    cellText: {
        fontSize: 15, // Məlumat fontu
        color: '#334155',
    },
    row: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f5f9',
        height: 60,
    },
    actionColumnHeader: {
        flex: 1.5,
        justifyContent: 'center',
    },
    actionCell: {
        flex: 1.5,
        justifyContent: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});