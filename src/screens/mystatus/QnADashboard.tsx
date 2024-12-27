import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Ionicons';
import { getRequest } from '../../api/apiManager';

interface QnAItem {
  id: string;
  createAt: string;
  title: string;
  child: string;
  details: string[];
}

interface Child {
  id: string;
  name: string;
}

const QnADashboard = () => {
  const [qaData, setQaData] = useState<QnAItem[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [tempSelectedChild, setTempSelectedChild] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const size = 10;

  const fetchChildren = async () => {
    try {
      const response = await getRequest('/api/members/children');
      setChildren(response || []);
    } catch (error) {
      console.error('자녀 목록 가져오기 실패:', error);
    }
  };

  const fetchQnAData = async (pageNum: number, childId?: string | null) => {
    try {
      setLoadingMore(true);
      const endpoint = childId 
        ? `/api/dashboard/${childId}`
        : '/api/dashboard';
  
      const response = await getRequest(endpoint, { page: pageNum, size });
      
      console.log('Fetched QnA Data:', response); // 디버깅 로그 추가
  
      const newData = response?.content || [];
      setHasMore(newData.length === size);
  
      if (pageNum === 0) {
        setQaData(newData);
      } else {
        setQaData(prev => [...prev, ...newData]);
      }
    } catch (error) {
      console.error('Q&A 데이터 요청 오류:', error);
      setError('데이터를 불러오는 중 문제가 발생했습니다.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleValueChange = (value: string | null) => {
    // 플랫폼에 상관없이 즉시 tempSelectedChild를 업데이트
    setTempSelectedChild(value);
  };

  const handleSelection = (value: string | null) => {
    setSelectedChild(value);
    setTempSelectedChild(null); // 선택 완료 후 임시 상태 초기화
    setPage(0);
    fetchQnAData(0, value);
  };

  useEffect(() => {
    // selectedChild가 변경될 때 데이터를 새로 가져옴
    fetchQnAData(0, selectedChild);
  }, [selectedChild]);

  const handleItemPress = async (qnaId: string) => {
    try {
      setLoadingMore(true);
      const response = await getRequest(`/api/dashboard/detail/${qnaId}`);
      
      if (response && Array.isArray(response)) {
        const details = response.map((item) => {
          return `질문: ${item.question}\n예시 답변: ${item.sampleAnswer}\n답변: ${item.answer}`;
        });
        setSelectedDetails(details);
        setModalVisible(true); // 모달 표시
      } else {
        alert('상세 데이터를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error('상세보기 API 호출 오류:', error);
      alert('상세 데이터를 가져오는 중 문제가 발생했습니다.');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchQnAData(nextPage, selectedChild);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#6B66FF" />
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: QnAItem }) => {
    console.log('Rendering Item:', item); // 디버깅 로그 추가
  
    return (
      <TouchableOpacity
        style={styles.qaCard}
        onPress={() => {
          console.log('Clicked QnA ID:', item.id); // 클릭된 QnA ID 확인
          handleItemPress(item.id);
        }}
      >
        <Text style={styles.qaDate}>{item.createAt}</Text>
        <Text style={styles.qaTitle}>{item.title}</Text>
        <Text style={styles.qaChild}>{item.child}</Text>
      </TouchableOpacity>
    );
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([
        fetchChildren(),
        fetchQnAData(0)
      ]);
      setLoading(false);
    };

    initializeData();
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
            onValueChange={(value) => setSelectedChild(value)} // 선택한 값을 selectedChild에 저장
            items={[
              { label: '전체', value: null },
              ...children.map((child) => ({
                label: child.name,
                value: child.id,
              })),
            ]}
            value={selectedChild} // 현재 선택된 값 유지
            style={{
              ...pickerSelectStyles,
              inputIOSContainer: styles.pickerContainer,
              inputAndroidContainer: styles.pickerContainer,
            }}
            placeholder={{ label: '자녀별로 확인하기', value: null }}
            useNativeAndroidPickerStyle={false}
            textInputProps={{
              numberOfLines: 1,
            }}
          />
        </View>
      </View>

      <FlatList
        data={qaData}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id || index.toString()}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

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
            <FlatList
              data={selectedDetails}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.modalScroll}
              renderItem={({ item }) => {
                const [question, ...answers] = item.split('\n');
                return (
                  <View style={styles.qaItem}>
                    <Text style={styles.questionText}>{question}</Text>
                    {answers.map((answer, answerIndex) => (
                      <Text key={answerIndex} style={styles.answerText}>
                        {answer}
                      </Text>
                    ))}
                  </View>
                );
              }}
            />
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
  listContainer: {
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
    paddingTop: 8,
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
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
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

