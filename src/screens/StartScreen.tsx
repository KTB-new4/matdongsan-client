import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import { postRequest } from '../api/apiManager'; // API 관리 모듈
import * as KakaoLogins from '@react-native-seoul/kakao-login'; // Kakao SDK 사용
import { storeServerTokens } from '../api/serverTokenManager'; // 서버 토큰 저장 유틸리티

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

      const kakaoAccessToken = kakaoResult.accessToken;
      console.log('Extracted Kakao token:', kakaoAccessToken);

      // 사용자 정보 가져오기
      const userProfile = await KakaoLogins.getProfile();
      console.log('Kakao User Profile:', JSON.stringify(userProfile, null, 2));

      const email = userProfile?.email;
      if (!email) {
        throw new Error('이메일 정보를 가져올 수 없습니다.');
      }

      // 서버로 로그인 요청
      console.log('Sending to server:', { token: kakaoAccessToken, email });
      const responseData = await postRequest('/api/auth/kakao/login', {
        token: kakaoAccessToken,
        email,
      });

      console.log('Login API Response:', responseData);

      if (responseData?.accessToken && responseData?.refreshToken) {
        // 서버에서 받은 토큰 저장
        await storeServerTokens(responseData.accessToken, responseData.refreshToken);

        Alert.alert('로그인 성공', `환영합니다, ${email}!`);
        navigation.navigate('MainTabs'); // MainTabs로 이동
      } else {
        throw new Error(responseData?.message || '서버 응답이 올바르지 않습니다.');
      }
    } catch (error) {
      // 에러 처리
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
    <ImageBackground
      source={require('../assets/images/startscreen.png')}
      style={styles.background}
    >
      <Image
        source={require('../assets/images/brandImage.png')}
        style={styles.brandImage}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleKakaoLogin}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text style={styles.loginButtonText}>카카오 계정으로 시작하기</Text>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandImage: {
    width: '100%',
    height: '40%', // 상단에 꽉 차도록 설정
    marginTop: 0,
  },
  loginButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FEE500',
    paddingVertical: 30,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StartScreen;