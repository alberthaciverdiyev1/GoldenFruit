import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function ProductList({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mehsul Siyahısı</Text>
      <Button 
        title="Yeni Mehsul Əlavə Et" 
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