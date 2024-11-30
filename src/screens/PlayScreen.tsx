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
} from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { PanGestureHandler } from 'react-native-gesture-handler';

export default function PlayScreen({ route, navigation }: any) {
  const { story, ttsLink } = route.params;
  const audioUrl = 'https://matdongsan.s3.ap-northeast-2.amazonaws.com/6729854078523a58e7403d18.mp3';
  const soundRef = useRef<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(81); // 기본값, 실제 로딩 후 설정됨
  const [showModal, setShowModal] = useState(false);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);

  const sentences = story.content.split(/(\. |\n)/).filter((sentence: string) => sentence.trim());

  useEffect(() => {
    soundRef.current = new Sound(ttsLink, '', (error) => {
      if (error) {
        console.log('오디오 파일 로드 오류:', error);
        return;
      }
      if (soundRef.current) {
        setDuration(soundRef.current.getDuration());
      }
    });

    return () => {
      soundRef.current?.release();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
  
          // 각 문장의 예상 재생 시간을 설정하고 현재 재생 시간에 따라 맞는 문장 인덱스를 찾음
          let cumulativeDuration = 0;
          
          // 각 문장의 길이를 바탕으로 예상 재생 시간을 계산합니다.
          const sentenceDurations: number[] = sentences.map((sentence: string) => {
            return (sentence.length / story.content.length) * duration;
          });
  
          // 현재 재생 시간이 cumulativeDuration을 초과하지 않는 첫 번째 문장 인덱스를 찾음
          const sentenceIndex = sentenceDurations.findIndex((time: number) => {
            cumulativeDuration += time;
            return seconds < cumulativeDuration;
          });
          
          setActiveSentenceIndex(sentenceIndex);
        });
      }
    }, 500);
  
    return () => clearInterval(interval);
  }, [isPlaying, duration]);
  

  const playPauseAudio = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play(() => setIsPlaying(false));
      }
      setIsPlaying(!isPlaying);
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
    const timePerSentence = duration / sentences.length;
    const targetTime = index * timePerSentence;
    seekTo(targetTime);
    setIsPlaying(true);
  };

  const handleGestureClose = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Image
          source={require('../assets/images/cover2.png')}
          style={styles.storyImage}
        />
        <Text style={styles.title}>{story.title}</Text>
        <Text style={styles.subtitle}>{story.id}</Text>

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
              <Ionicons name="reload" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={playPauseAudio}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#fff" 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekTo(Math.min(duration, currentTime + 10))}>
              <Ionicons name="forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setShowModal(true)}
          >
            <Ionicons name="book-outline" size={20} color="#666" />
            <Text style={styles.buttonText}>동화 읽기</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showModal} animationType="slide" transparent={true}>
        <PanGestureHandler onEnded={handleGestureClose}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Image
                source={require('../assets/images/cover2.png')}
                style={styles.modalThumbnail}
              />
              <Text style={styles.modalTitle}>{story.title}</Text>
              <TouchableOpacity style={styles.modalControls} onPress={playPauseAudio}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="#4666FF" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {sentences.map((sentence: string, index: number) => (
                <Text
                  key={index}
                  style={[
                    styles.sentenceText,
                    index === activeSentenceIndex && { fontWeight: 'bold', color: '#000' },
                  ]}
                  onPress={() => handleSentencePress(index)}
                >
                  {sentence}
                </Text>
              ))}
            </ScrollView>
          </SafeAreaView>
        </PanGestureHandler>
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
});