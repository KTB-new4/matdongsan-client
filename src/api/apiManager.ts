// src/api/apiManager.ts
import axios from 'axios';

// 기본 Axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://192.168.37.216:8080', // 백엔드 서버 주소
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 오류 처리 함수
const handleError = (error: any) => {
  console.error('API 호출 오류:', error);
  if (error.response) {
    throw error.response.data;
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
