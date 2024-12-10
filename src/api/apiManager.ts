// src/api/apiManager.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.35.49.154/', // 서버 주소
  timeout: 30000, // 30초 타임아웃
});

// 공통 에러 처리
const handleError = (error: any) => {
  console.error('API 호출 오류:', error.toJSON ? error.toJSON() : error);
  if (error.response) {
    console.error('Response data:', error.response.data);
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
  try {
    const response = await api.get(endpoint, { params, headers });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// POST 요청
export const postRequest = async (endpoint: string, data: any, headers = {}) => {
  try {
    const response = await api.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// PATCH 요청
export const patchRequest = async (endpoint: string, data: any, headers = {}) => {
  try {
    const response = await api.patch(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};