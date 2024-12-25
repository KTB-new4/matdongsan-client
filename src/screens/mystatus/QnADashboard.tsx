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
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Ionicons';
import { getRequest } from '../../api/apiManager';

// 더미 데이터
const dummyQaData = [
  {
    createAt: "2024.12.24",
    title: "개굴개굴 개굴이",
    child: "금이",
    details: [
      "Q1. 개구리들이 비가 오는 날에 무엇을 하려고 했나요?\n예시 답안) 개구리들은 비가 오는 날에 놀려고 했어요.\n자녀 답안) 개구리들은 즐겁게 연못에서 놀려고 했어요",
      "Q2. 황금이가 연못에 뭐가 떠다니고 있다고 외쳤나요?\n예시 답안) 황금이는 연못에 플라스틱 병이 떠다니고\n자녀 답안) 연못에는 플라스틱 병이 있었어요",
      "Q3. 개구리들이 비가 오는 날에 무엇을 하려고 했나요?\n예시 답안) 개구리들은 비가 오는 날에 놀려고 했어요.\n자녀 답안) 개구리들은 즐겁게 연못에서 놀려고 했어요",
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
  const [tempSelectedChild, setTempSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerKey, setPickerKey] = useState(0); // 피커 리렌더링을 위한 키

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

      setQaData(qaResponse.content?.length > 0 ? qaResponse.content : dummyQaData); // 서버 데이터 없으면 더미 데이터 사용
      setChildren(childrenResponse?.length > 0 ? childrenResponse : dummyChildrenData); // 서버 데이터 없으면 더미 데이터 사용
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
      setQaData(response.content?.length > 0 ? response.content : dummyQaData); // 서버 데이터 없으면 더미 데이터 사용
    } catch (error) {
      console.error('특정 자녀 Q&A 데이터 요청 오류:', error);
      setError('Q&A 데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (value: string | null) => {
    if (Platform.OS === 'android') {
      handleSelection(value);
    } else {
      setTempSelectedChild(value);
    }
  };

  const handleSelection = (value: string | null) => {
    setSelectedChild(value);
    if (value) {
      fetchQnADataByChild(value);
    } else {
      fetchInitialData();
    }
  };

  const handleDone = () => {
    handleSelection(tempSelectedChild);
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
        <ActivityIndicator size="large" color="#6B66FF" />
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
      <View style={styles.header}>
        <View style={styles.filterButton}>
          <Icon name="filter" size={20} color="#666" />
          <RNPickerSelect
            key={pickerKey}
            onValueChange={(value) => handleSelection(value)} // 선택 즉시 반영
            onDonePress={() => handleSelection(tempSelectedChild)} // iOS의 Done 버튼 처리
            items={[
              { label: '전체', value: null },
              ...children.map((child) => ({
                label: child.name,
                value: child.id,
              })),
            ]}
            value={selectedChild} // 선택된 값 표시
            style={{
              ...pickerSelectStyles,
              inputIOSContainer: styles.pickerContainer,
              inputAndroidContainer: styles.pickerContainer,
            }}
            placeholder={{ label: '자녀별로 확인하기', value: null }}
            useNativeAndroidPickerStyle={false} // Android 스타일 커스터마이즈
            textInputProps={{
              numberOfLines: 1,
            }}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {qaData.map((qa, index) => (
          <TouchableOpacity
            key={index}
            style={styles.qaCard}
            onPress={() => handleItemPress(qa.details || [])}
          >
            <Text style={styles.qaDate}>{qa.createAt}</Text>
            <Text style={styles.qaTitle}>{qa.title}</Text>
            <Text style={styles.qaChild}>{qa.child}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Q&A 상세 모달 */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <ScrollView style={styles.modalScroll}>
              {selectedDetails.map((detail, index) => {
                const [question, ...answers] = detail.split('\n');
                return (
                  <View key={index} style={styles.qaItem}>
                    <Text style={styles.questionText}>{question}</Text>
                    {answers.map((answer, answerIndex) => (
                      <Text key={answerIndex} style={styles.answerText}>
                        {answer}
                      </Text>
                    ))}
                  </View>
                );
              })}
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
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 14,
    color: '#666',
    paddingRight: 24, // 아이콘을 위한 공간
  },
  scrollContainer: {
    padding: 16,
  },
  qaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qaDate: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  qaTitle: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  qaChild: {
    fontSize: 14,
    color: '#666666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalScroll: {
    marginTop: 8,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
  qaItem: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    color: '#6B66FF',
    marginBottom: 8,
    fontWeight: '500',
  },
  answerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
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
    color: '#FF4B4B',
    textAlign: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    color: '#666',
    paddingRight: 24,
    width: '100%',
  },
  inputAndroid: {
    fontSize: 14,
    color: '#666',
    paddingRight: 24,
    width: '100%',
  },
});

export default QnADashboard;

