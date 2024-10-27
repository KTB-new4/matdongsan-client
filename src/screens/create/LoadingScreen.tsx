import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = ({ route, navigation }: any) => {
  const { response } = route.params;

  useEffect(() => {
    // 3초 후에 StoryCreateFinishScreen으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Create Finish', { story: response });
    }, 3000);

    return () => clearTimeout(timer); // 타이머 정리
  }, [navigation, response]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>동화 생성 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 20, fontSize: 18, color: '#555' },
});

export default LoadingScreen;
