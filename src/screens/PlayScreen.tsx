import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { PanGestureHandler } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { getRequest, postRequest } from '../api/apiManager';

export default function PlayScreen({ route, navigation }: any) {
  // 데이터 초기화
  const storyData = route.params?.story || { title: '기본 제목', content: '' }; // 기본 데이터 설정
  const ttsLinkData = route.params?.ttsLink || undefined; // 기본 TTS 링크 설정
  console.log('tts link : ', ttsLinkData);
  const timestamps: number[] = route.params?.timestamps || []; // 타임스탬프 데이터

  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(81); // 기본값
  const [showModal, setShowModal] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  // 인형 재생 상태 관리
  const [isDollPlaying, setIsDollPlaying] = useState(false);
  const [isLoadingDoll, setIsLoadingDoll] = useState(false);
  const [isDollPlayModalVisible, setIsDollPlayModalVisible] = useState(false);
  const [isDollPlayCloseEnabled, setIsDollPlayCloseEnabled] = useState(false);

  // Q&A 상태 관리
  const [showQAModal, setShowQAModal] = useState(false);
  const [showChildrenList, setShowChildrenList] = useState(false);
  const [children, setChildren] = useState([]); // 자녀 목록
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [qaData, setQaData] = useState<any[]>([]); // Q&A 데이터
  const [questionArrayId, setQuestionArrayId] = useState<number | null>(null); // 질문 배열 ID 상태 추가
  const [qaLoading, setQaLoading] = useState(false);

  const sentences = storyData.content
  .replace(/(?<=[”"]) (?=\w)/g, '\n') // 큰따옴표 뒤의 공백을 줄바꿈으로 변환
  .split(/\n/) // 줄바꿈(\n)을 기준으로 문장 분리
  .filter((sentence: string) => sentence.trim()); // 빈 문장은 제거

  const StoryCoverUrl = storyData.coverUrl || undefined;
  console.log(StoryCoverUrl)

  useEffect(() => {
    // Enable playback in silence mode
    Sound.setCategory('Playback');

    // Properly handle the TTS URL
    if (ttsLinkData) {
      console.log('Loading audio from:', ttsLinkData);
      
      // Release previous instance if it exists
      if (soundRef.current) {
        soundRef.current.release();
      }

      // Create new Sound instance with proper remote URL handling
      const sound = new Sound(ttsLinkData, '', (error) => {
        if (error) {
          console.error('Failed to load sound', error);
          return;
        }
        
        console.log('Sound loaded successfully');
        sound.setVolume(1.0);
        
        const duration = sound.getDuration();
        console.log('Sound duration:', duration);
        setDuration(duration);
      });

      soundRef.current = sound;

      return () => {
        if (sound) {
          sound.release();
        }
      };
    }
  }, [ttsLinkData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
  
          // 현재 시간에 해당하는 문장 인덱스 계산
          const sentenceIndex = timestamps.findIndex(
            (timestamp, index) =>
              seconds >= timestamp && seconds < (timestamps[index + 1] || duration) // 다음 타임스탬프 이전까지
          );
  
          setActiveSentenceIndex(sentenceIndex); // 하이라이트 문장 업데이트
        });
      }
    }, 100); // 100ms마다 업데이트 (더 부드럽게)
  
    return () => clearInterval(interval);
  }, [isPlaying, timestamps, duration]);

  // 자녀 목록 불러오기
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await getRequest('/api/members/children');
        setChildren(response || []);
      } catch (error) {
        console.error('자녀 정보를 가져오는 중 오류 발생:', error);
      }
    };
    fetchChildren();
  }, []);

  const playPauseAudio = () => {
    if (!soundRef.current) {
      console.error('Sound not initialized');
      return;
    }

    console.log('Current playing state:', isPlaying);
    
    if (isPlaying) {
      soundRef.current.pause(() => {
        console.log('Audio paused successfully');
        setIsPlaying(false);
      });
    } else {
      // Reset to start if at the end
      if (currentTime >= duration) {
        soundRef.current.setCurrentTime(0);
      }

      soundRef.current.play((success) => {
        if (success) {
          console.log('Audio finished playing successfully');
        } else {
          console.log('Audio playback failed');
        }
        setIsPlaying(false);
      });

      console.log('Starting audio playback');
      setIsPlaying(true);
    }
  };

  const seekTo = (seconds: number) => {
    if (soundRef.current) {
      soundRef.current.setCurrentTime(seconds);
      setCurrentTime(seconds);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSentencePress = (index: number) => {
    if (!soundRef.current) {
      console.error('Sound not initialized');
      return;
    }

    if (timestamps[index] !== undefined) {
      const targetTime = timestamps[index];
      console.log('Seeking to time:', targetTime);

      // 타임스탬프 시간으로 이동
      soundRef.current.setCurrentTime(targetTime);
      setCurrentTime(targetTime);

      // 현재 문장 활성화 및 재생
      setActiveSentenceIndex(index);
      
      // 재생 상태로 설정
      soundRef.current.play((success) => {
        if (success) {
          console.log('Sentence playback finished successfully');
        } else {
          console.log('Sentence playback failed');
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      console.warn(`해당 문장의 타임스탬프가 없습니다: index ${index}`);
    }
  };

  const handleGestureClose = () => {
    setShowModal(false);
  };

  const handleDollPlay = async () => {
    setIsLoadingDoll(true);
    try {
      await getRequest(`/api/modules/stories/${storyData.id}`);
      setIsDollPlaying(true);
      setIsDollPlayModalVisible(true);

      setTimeout(() => {
        setIsDollPlaying(false);
        setIsDollPlayCloseEnabled(true);
      }, duration * 1000); // 동화 재생 시간이 지나면 닫기 버튼 활성화
    } catch (error) {
      console.error('인형 재생 API 호출 오류:', error);
    } finally {
      setIsLoadingDoll(false);
    }
  };

  // Q&A 데이터 불러오기
const fetchQAData = async () => {
  setQaLoading(true);
  try {
    const storyId = route.params?.story.id;
    console.log('=== Fetching Q&A Data ===');
    console.log('Story ID:', storyId, 'Type:', typeof storyId);

    const response = await getRequest(`/api/dashboard/questions/${storyId}`);
    console.log('Q&A Response:', response);

    if (!response || !response.qnAs) {
      alert('이 동화에 대한 질문 데이터가 없습니다.');
      setQaData([]);
      setQuestionArrayId(null); // 질문 배열 ID 초기화
      return;
    }

    setQaData(response.qnAs);
    setQuestionArrayId(response.id); // 질문 배열 ID 설정
    console.log('Set question array ID:', response.id);
  } catch (error) {
    console.error('Q&A 데이터를 가져오는 중 오류 발생:', error);
    alert('Q&A 데이터를 불러오는데 실패했습니다.');
    setQaData([]);
    setQuestionArrayId(null); // 질문 배열 ID 초기화
  } finally {
    setQaLoading(false);
  }
};

// Q&A 시작
const startQA = async () => {
  if (!selectedChild) {
    alert('먼저 자녀를 선택해 주세요.');
    return;
  }

  if (!qaData || qaData.length === 0) {
    alert('이 동화에 대한 질문 데이터가 없습니다.');
    return;
  }

  if (!questionArrayId) {
    alert('질문 배열 ID가 설정되지 않았습니다.');
    return;
  }

  try {
    console.log('=== Starting Q&A Process ===');
    console.log('Processing question array ID:', questionArrayId);

    const apiUrl = `/api/modules/questions/${questionArrayId}/${selectedChild}`;
    console.log('Calling API with question array ID:', apiUrl);

    const response = await getRequest(apiUrl);
    console.log('Q&A API response:', response);

    alert('Q&A가 성공적으로 시작되었습니다.');
  } catch (error) {
    console.error('Q&A 시작 중 오류 발생:', error);
    alert('Q&A 시작 중 오류가 발생했습니다.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Image
            source={StoryCoverUrl ? {uri: StoryCoverUrl} : undefined}
            style={styles.storyImage}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{storyData.title}</Text>
        <Text style={styles.subtitle}>{storyData.author || '기본 ID'}</Text>

        <View style={styles.playerContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={(value) => seekTo(value)}
            minimumTrackTintColor="#000"
            maximumTrackTintColor="#ddd"
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            <Text style={styles.timeText}>-{formatTime(duration - currentTime)}</Text>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={() => seekTo(Math.max(0, currentTime - 10))}>
              <Ionicons name="play-back-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton} onPress={playPauseAudio}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekTo(Math.min(duration, currentTime + 10))}>
              <Ionicons name="play-forward-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {/* Q&A 생성 버튼 */}
          <TouchableOpacity style={styles.button} onPress={() => {
            setShowQAModal(true);
            fetchQAData();
          }}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#666" />
            <Text style={styles.buttonText}>Q&A 생성</Text>
          </TouchableOpacity>

          {/* Q&A 모달 */}
          <Modal visible={showQAModal} transparent={true} animationType="fade">
            <View style={styles.qaModalBackground}>
              <View style={styles.qaModalContent}>
                {/* 닫기 버튼 */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowQAModal(false)}
                >
                  <Text style={styles.closeButtonText}>닫기</Text>
                </TouchableOpacity>
      
              {/* 자녀 선택 드롭다운 */}
              <View style={styles.childPickerContainer}>
                <RNPickerSelect
                  onValueChange={(value) => setSelectedChild(value)} // 선택된 자녀 ID 업데이트
                  items={children.map((child: any) => ({
                    label: child.name, // 자녀 이름
                    value: child.id, // 자녀 ID
                  }))}
                  style={pickerSelectStyles} // 드롭다운 스타일
                  placeholder={{ label: '자녀를 선택해주세요.', value: null }} // 기본 값
                  value={selectedChild}
                />
              </View>

              {/* 자녀 리스트 */}
              {showChildrenList && (
                <ScrollView horizontal style={styles.childrenList}>
                  {children.map((child: any) => (
                    <TouchableOpacity
                      key={child.id}
                      style={[
                        styles.childItem,
                        selectedChild === child.id && styles.selectedChildItem,
                      ]}
                      onPress={() => {
                        setSelectedChild(child.id); // 자녀 선택
                        setShowChildrenList(false); // 리스트 닫기
                      }}
                    >
                      <Text
                        style={
                          selectedChild === child.id
                            ? { color: '#fff' }
                            : { color: '#000' }
                        }
                      >
                        {child.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}

              {/* Q&A 내용 */}
              <ScrollView style={styles.qaContent}>
                {qaLoading ? (
                  <ActivityIndicator size="large" color="#4A90E2" />
                ) : (
                  qaData.map((qa, index) => (
                    <View key={index} style={styles.qaItem}>
                      <Text style={styles.qaQuestion}>
                        Q{index + 1}: {qa.question}
                      </Text>
                      <Text style={styles.qaAnswer}>
                        예시 답안: {qa.sampleAnswer}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>

                {/* Q&A 시작 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.startQAButton,
                    !selectedChild && { backgroundColor: '#ccc' }, // 자녀 선택 없으면 비활성화
                  ]}
                  onPress={startQA}
                  disabled={!selectedChild}
                >
                  <Text style={styles.startQAButtonText}>Q&A 시작하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 인형 재생 버튼 */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleDollPlay}
            disabled={isLoadingDoll || isDollPlaying}
          >
            {isLoadingDoll ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Ionicons name="play-circle-outline" size={20} color="#666" />
            )}
            <Text style={styles.buttonText}>인형 재생</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 텍스트 모달 */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <PanGestureHandler onEnded={handleGestureClose}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Image
                source={{uri : StoryCoverUrl}}
                style={styles.modalThumbnail}
              />
              <Text style={styles.modalTitle}>{storyData.title}</Text>
              <TouchableOpacity style={styles.modalControls} onPress={playPauseAudio}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#4666FF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {sentences.map((sentence: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    styles.sentenceText,
                    index === activeSentenceIndex && { fontWeight: 'bold', color: '#4666FF' }, // 현재 문장 하이라이트
                  ]}
                  onPress={() => handleSentencePress(index)} // 문장 클릭 시 이동
                >
                  {sentence}
                </Text>
              ))}
            </ScrollView>
          </SafeAreaView>
        </PanGestureHandler>
      </Modal>

      <Modal visible={isDollPlayModalVisible} transparent={true} animationType="fade">
        <View style={styles.dollPlayModalBackground}>
          <View style={styles.dollPlayModalContent}>
            <Text style={styles.dollPlayModalTitle}>인형이 동화를 재생 중입니다</Text>
            <Text style={styles.dollPlayModalMessage}>
              동화가 끝날 때까지 조작이 불가능합니다.
            </Text>
            {isDollPlayCloseEnabled && (
              <TouchableOpacity
                style={styles.dollPlayModalCloseButton}
                onPress={() => setIsDollPlayModalVisible(false)}
              >
                <Text style={styles.dollPlayModalCloseButtonText}>닫기</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  storyImage: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  playerContainer: {
    width: '90%',
    marginTop: 30,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    color: '#666',
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginTop: 20,
  },
  playButton: {
    backgroundColor: '#4666FF',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    gap: 8,
  },
  buttonText: {
    color: '#666',
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  activeNav: {
    color: '#4666FF',
  },
  activeText: {
    color: '#4666FF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  modalThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  modalControls: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  sentenceText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  dollPlayModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 약간 어두운 투명 배경
  },
  dollPlayModalContent: {
    backgroundColor: '#fff', // 밝은 배경
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8, // 화면 너비의 80%
  },
  dollPlayModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  dollPlayModalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  dollPlayModalCloseButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  dollPlayModalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qaModalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  qaModalContent: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  qaModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  childrenList: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  childItem: {
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  selectedChildItem: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  qaContent: {
    marginBottom: 20,
  },
  qaItem: {
    marginBottom: 10,
  },
  qaQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qaAnswer: {
    fontSize: 14,
    color: '#666',
  },
  startQAButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  startQAButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectChildButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectChildButtonText: {
    fontSize: 16,
    color: '#333',
  },
  childPickerContainer: {
    marginVertical: 10, // 드롭다운 위아래 간격
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  inputAndroid: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
});

