import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { postRequest } from '../api/apiManager'; // API 관리 모듈
import * as KakaoLogins from '@react-native-seoul/kakao-login'; // Kakao SDK 사용

const StartScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!KakaoLogins) {
      console.error('KakaoLogins 모듈이 로드되지 않았습니다.');
      Alert.alert(
        '오류',
        'Kakao SDK가 제대로 초기화되지 않았습니다. 네이티브 설정을 확인하세요.',
      );
    }
  }, []);

  const handleKakaoLogin = async () => {
    try {
      setLoading(true);

      // 카카오 로그인 시작
      const kakaoResult = await KakaoLogins.login();
      console.log('Kakao Login Success:', kakaoResult);

      const token = kakaoResult.accessToken;
      console.log('Extracted token:', token);

      // 사용자 정보 가져오기
      const userProfile = await KakaoLogins.getProfile();
      console.log('Kakao User Profile:', JSON.stringify(userProfile, null, 2));

      const email = userProfile.email;
      if (!email) {
        throw new Error('이메일 정보를 가져올 수 없습니다.');
      }

      // 서버로 로그인 요청
      console.log('Sending to server:', { token, email });
      const responseData = await postRequest(
        '/api/auth/kakao/login',
        { token, email },
      );

      console.log('Login API Response:', responseData);

      if (responseData.accessToken) {
        Alert.alert('로그인 성공', `환영합니다, ${email}!`);
        navigation.navigate('MainTabs', { user: responseData });
      } else {
        Alert.alert('로그인 실패', responseData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      // 'error' 타입을 명시적으로 처리
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        Alert.alert('오류', error.message || '로그인 처리 중 문제가 발생했습니다.');
      } else {
        console.error('Unknown error:', error);
        Alert.alert('오류', '알 수 없는 문제가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matdongsan에 오신 것을 환영합니다!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleKakaoLogin}>
          <Text style={styles.loginButtonText}>카카오 계정으로 시작하기</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FEE500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    elevation: 3,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartScreen;