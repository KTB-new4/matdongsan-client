import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AllStoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This is All Story Page!</Text>
      {/* 도서관에 관한 정보를 여기에 표시할 수 있습니다 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AllStoryScreen;
