// src/api/apiManager.ts
import axios from 'axios';
import { getServerTokens, refreshTokens } from './serverTokenManager';

const api = axios.create({
  baseURL: 'http://3.35.49.154/', // 서버 주소
  timeout: 30000, // 30초 타임아웃
});

// 공통 에러 처리
const handleError = async (error: any, retryCallback: () => Promise<any>) => {
  console.error('API 호출 오류:', error.toJSON ? error.toJSON() : error);
  if (error.response) {
    console.error('Response data:', error.response.data);

    // "액세스 토큰 만료" 메시지 처리
    if (
      error.response.status === 401 &&
      error.response.data?.message === '액세스 토큰 만료'
    ) {
      console.log('토큰 만료 감지, 갱신 시도');
      const newAccessToken = await refreshTokens();
      if (newAccessToken) {
        console.log('토큰 갱신 성공, 요청 재시도');
        return retryCallback(); // 갱신된 토큰으로 요청 재시도
      }
    }

    throw error.response.data; // 서버 에러 메시지 반환
  } else if (error.request) {
    console.error('Request:', error.request);
    throw new Error('서버와 연결할 수 없습니다.');
  } else {
    throw new Error(error.message);
  }
};

// GET 요청
export const getRequest = async (endpoint: string, params = {}, headers = {}) => {
  const retryCallback = async () => getRequest(endpoint, params, headers); // 재시도 콜백
  try {
    const tokens = await getServerTokens();

    const finalHeaders = tokens?.accessToken
      ? { ...headers, accessToken: tokens.accessToken }
      : { ...headers };

    // 헤더 로그 추가
    console.log('GET 요청 헤더:', finalHeaders);

    const response = await api.get(endpoint, {
      params,
      headers: finalHeaders,
    });
    return response.data;
  } catch (error) {
    return handleError(error, retryCallback);
  }
};

// POST 요청
export const postRequest = async (endpoint: string, data: any, headers = {}) => {
  const retryCallback = async () => postRequest(endpoint, data, headers); // 재시도 콜백
  try {
    const tokens = await getServerTokens();
    const response = await api.post(endpoint, data, {
      headers: {
        ...headers,
        Authorization: tokens?.accessToken ? `Bearer ${tokens.accessToken}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, retryCallback);
  }
};

// PATCH 요청
export const patchRequest = async (endpoint: string, data: any, headers = {}) => {
  const retryCallback = async () => patchRequest(endpoint, data, headers); // 재시도 콜백
  try {
    const tokens = await getServerTokens();
    const response = await api.patch(endpoint, data, {
      headers: {
        ...headers,
        Authorization: tokens?.accessToken ? `Bearer ${tokens.accessToken}` : undefined,
      },
    });
    return response.data;
  } catch (error) {
    return handleError(error, retryCallback);
  }
};