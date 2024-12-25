import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Modal,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { getRequest } from '../../api/apiManager';

// 더미 데이터
const dummyQaData = [
  {
    createAt: "2024.12.11",
    title: "이거 진짜 금쪽이",
    child: "금쪽이",
    details: [
      "Q1. 질문1 내용은 다음과 같습니다.\n예시 답안) 첫번째 답안\n자녀 답안) 엄마당~",
      "Q2. 질문2 내용은 다음과 같습니다.\n예시 답안) 두번째 답안\n자녀 답안) 아빠당!",
      "Q3. 질문3 내용은 다음과 같습니다.\n예시 답안) 세번째 답안\n자녀 답안) 언니당!",
    ],
  },
  {
    createAt: "2024.12.12",
    title: "신나는 모험 이야기",
    child: "철수",
    details: [
      "Q1. 모험이란 무엇인가요?\n예시 답안) 새로운 도전\n자녀 답안) 게임!",
      "Q2. 가장 기억에 남는 모험은?\n예시 답안) 숲 탐험\n자녀 답안) 공룡나라!",
    ],
  },
  {
    createAt: "2024.12.13",
    title: "꿈꾸는 아이",
    child: "영희",
    details: [
      "Q1. 꿈은 무엇인가요?\n예시 답안) 미래의 희망\n자녀 답안) 선생님!",
      "Q2. 꿈을 이루기 위해 필요한 것은?\n예시 답안) 노력\n자녀 답안) 공부!",
    ],
  },
];

const dummyChildrenData = [
  { id: "1", name: "금쪽이" },
  { id: "2", name: "철수" },
  { id: "3", name: "영희" },
];

const QnADashboard = () => {
  const [qaData, setQaData] = useState<any[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);

  const page = 0;
  const size = 10;

  // 초기 데이터 호출
  const fetchInitialData = async () => {
    try {
      setLoading(true);

      const [qaResponse, childrenResponse] = await Promise.all([
        getRequest('/api/dashboard', { page, size }),
        getRequest('/api/members/children'),
      ]);

      setQaData(qaResponse.content.length > 0 ? qaResponse.content : dummyQaData); // 서버 데이터 없으면 더미 데이터 사용
      setChildren(childrenResponse.length > 0 ? childrenResponse : dummyChildrenData); // 서버 데이터 없으면 더미 데이터 사용
    } catch (error) {
      console.error('초기 데이터 요청 오류:', error);
      setError('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 특정 자녀 Q&A 데이터 호출
  const fetchQnADataByChild = async (childId: string) => {
    try {
      setLoading(true);
      const response = await getRequest(`/api/dashboard/${childId}`, { page, size });
      setQaData(response.content.length > 0 ? response.content : dummyQaData); // 서버 데이터 없으면 더미 데이터 사용
    } catch (error) {
      console.error('특정 자녀 Q&A 데이터 요청 오류:', error);
      setError('Q&A 데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 자녀 선택 핸들러
  const handleChildSelect = (childId: string) => {
    setSelectedChild(childId);
    if (childId) {
      fetchQnADataByChild(childId); // 자녀별 Q&A 호출
    } else {
      fetchInitialData(); // 전체 Q&A 데이터 다시 호출
    }
  };

  // 항목 클릭 핸들러
  const handleItemPress = (details: string[]) => {
    setSelectedDetails(details);
    setModalVisible(true);
  };

  // 화면 첫 진입 시 초기 데이터 호출
  useEffect(() => {
    fetchInitialData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}>자녀별 확인하기</Text>
        <RNPickerSelect
          onValueChange={(value) => handleChildSelect(value)}
          items={[
            { label: '전체', value: null },
            ...children.map((child) => ({ label: child.name, value: child.id })),
          ]}
          placeholder={{ label: '자녀를 선택하세요', value: null }}
          style={pickerSelectStyles}
          value={selectedChild}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {qaData.map((qa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.qaItem}
            onPress={() => handleItemPress(qa.details || [])} // 항목 클릭 시 세부 내용 표시
          >
            <Text style={styles.qaDate}>{qa.createAt}</Text>
            <Text style={styles.qaTitle}>동화 제목: {qa.title}</Text>
            <Text style={styles.qaChild}>자녀: {qa.child}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollView>
              {selectedDetails.map((detail, index) => (
                <Text key={index} style={styles.modalText}>
                  {detail}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  dropdownContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  dropdownLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  qaItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qaDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  qaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  qaChild: {
    fontSize: 14,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#F8F9FF',
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: '#333',
    backgroundColor: '#F8F9FF',
  },
});

export default QnADashboard;