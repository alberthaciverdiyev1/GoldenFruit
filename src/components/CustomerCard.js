import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const CustomerCard = ({ customer, onEdit }) => (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.cardTitle}>{customer.name} {customer.surname}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{customer.phone}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={onEdit}>
          <Text style={styles.btnText}>Düzəliş</Text>
        </TouchableOpacity>
      </View>
    </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.base100,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  cardBody: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.baseContent,
    marginBottom: 4
  },
  badge: {
    backgroundColor: Colors.base200,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start'
  },
  badgeText: { fontSize: 12, color: '#6b7280' },
  btnPrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnText: { color: 'white', fontWeight: '600', fontSize: 14 }
});