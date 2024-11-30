import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const StartScreen = ({ navigation }: any) => {
  const handleKakaoLogin = async () => {
    try {
      // 카카오 로그인 API 호출 (추후 실제 로직으로 대체)
      const isLoggedIn = false; // 현재 로그인 상태를 가정

      if (isLoggedIn) {
        // 추후 로그인이 유지된다면 바로 메인으로 이동
        navigation.replace('MainTabs');
      } else {
        // 로그인 절차 수행
        Alert.alert('카카오 로그인 성공', '프로필 설정 화면으로 이동합니다.');
        navigation.replace('MainTabs'); // SetProfile로 이동
      }
    } catch (error) {
      Alert.alert('로그인 실패', '다시 시도해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/startscreen.png')} // 배경 이미지
        style={styles.image}
      />
      <TouchableOpacity style={styles.button} onPress={handleKakaoLogin}>
        <Text style={styles.buttonText}>카카오 계정으로 시작하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FB',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FEE500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StartScreen;
