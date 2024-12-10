import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Alert } from 'react-native';

const TOKEN_KEY = 'SERVER_TOKENS';

let navigation: any; // 네비게이션 객체를 저장할 변수

console.log('EncryptedStorage:', EncryptedStorage);

// 네비게이션 객체 설정
export const setNavigation = (nav: any) => {
  navigation = nav;
};

// 토큰 저장
export const storeServerTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await EncryptedStorage.setItem(
      TOKEN_KEY,
      JSON.stringify({ accessToken, refreshToken })
    );
    console.log('토큰 저장 완료');
  } catch (error) {
    console.error('토큰 저장 실패:', error);
    throw new Error('토큰 저장 중 오류가 발생했습니다.');
  }
};

// 토큰 가져오기
export const getServerTokens = async () => {
  try {
    const tokens = await EncryptedStorage.getItem(TOKEN_KEY);
    return tokens ? JSON.parse(tokens) : null;
  } catch (error) {
    console.error('토큰 가져오기 실패:', error);
    return null;
  }
};

// 토큰 삭제
export const clearServerTokens = async () => {
  try {
    await EncryptedStorage.removeItem(TOKEN_KEY);
    console.log('토큰 삭제 완료');
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
};

// 액세스 토큰 갱신
export const refreshTokens = async () => {
  const tokens = await getServerTokens();
  if (!tokens?.refreshToken) {
    console.error('리프레시 토큰 없음. 다시 로그인 필요.');
    await handleSessionExpired();
    return null;
  }

  try {
    const { data } = await axios.get('http://3.35.49.154/api/auth/reissue', {
      headers: {
        Authorization: `Bearer ${tokens.refreshToken}`,
      },
    });

    // 새로 받은 액세스 토큰 저장
    await storeServerTokens(data.accessToken, tokens.refreshToken);
    console.log('토큰 갱신 성공');
    return data.accessToken;
  } catch (error: any) {
    console.error('토큰 갱신 실패:', error.response?.data || error.message);

    // 네트워크 관련 에러 처리
    if (error.response) {
      Alert.alert('오류', '토큰 갱신 중 문제가 발생했습니다.');
    } else {
      Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
    }

    await handleSessionExpired();
    return null;
  }
};

// 세션 만료 처리
const handleSessionExpired = async () => {
  Alert.alert('로그인 필요', '세션이 만료되었습니다. 다시 로그인해 주세요.');
  await clearServerTokens();

  if (navigation) {
    navigation.reset({ index: 0, routes: [{ name: 'Start' }] });
  } else {
    console.error('네비게이션 객체가 설정되지 않았습니다.');
  }
};