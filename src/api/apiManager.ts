// src/api/apiManager.ts
import axios from 'axios';

// 기본 Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://3.35.49.154/', // 백엔드 서버 주소
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 오류 처리 함수
const handleError = (error: any) => {
  console.error('API 호출 오류:', error.toJSON ? error.toJSON() : error);
  if (error.response) {
    console.log('Response data:', error.response.data);
    console.log('Response status:', error.response.status);
    console.log('Response headers:', error.response.headers);
    throw error.response.data;
  } else if (error.request) {
    console.log('Request:', error.request);
    throw new Error('서버와의 연결이 불안정합니다.');
  } else {
    throw new Error(error.message);
  }
};


// **GET 요청**: 데이터 조회
export const getRequest = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// **POST 요청**: 새 데이터 생성
export const postRequest = async (endpoint: string, data: any) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// **PATCH 요청**: 데이터 업데이트
export const patchRequest = async (endpoint: string, data: any) => {
  try {
    const response = await api.patch(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
