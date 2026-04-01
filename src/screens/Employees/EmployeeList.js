import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function EmployeeList({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Isci Siyahısı</Text>
      <Button 
        title="Yeni Isci Əlavə Et" 
        onPress={() => alert('Form açılacaq')} 
        color="#FF8C00"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 }
});