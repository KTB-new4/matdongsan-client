import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getRequest } from '../api/apiManager'; // API 호출 함수
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

interface StoryData {
  id: string;
  title: string;
  likes: number;
  coverUrl: string;
  tags?: string[];
  author: string;
  content: string;
  age: number;
  language: string;
  createdAt: string;
}

const StoryDetail: React.FC = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ttsLink, setTtsLink] = useState<string | null>(null); // TTS 링크 상태 추가

  const storyId = route.params?.storyId;

  // 동화 상세 정보 가져오기
  const fetchStoryDetail = async (id: string) => {
    try {
      const response: StoryData = await getRequest(`/api/stories/${id}`);
      setStory(response);
    } catch (err) {
      console.error('Error fetching story detail:', err);
      setError('동화 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // TTS 링크 가져오기
  const fetchTtsLink = async (id: string) => {
    try {
      const response = await getRequest(`/api/stories/tts/${id}`);
      setTtsLink(response);
    } catch (err) {
      console.error('Error fetching TTS link:', err);
    }
  };

  useEffect(() => {
    if (storyId) {
      fetchStoryDetail(storyId);
      fetchTtsLink(storyId);
    } else {
      setError('유효하지 않은 동화 ID입니다.');
      setLoading(false);
    }
  }, [storyId]);

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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 동화 이미지 */}
        <View style={styles.card}>
          <Image source={{ uri: story?.coverUrl }} style={styles.coverImage} />

          {/* 제목과 좋아요 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{story?.title}</Text>
            <View style={styles.likesContainer}>
              <Icon name="heart" size={20} color="red" />
              <Text style={styles.likes}>{story?.likes}</Text>
            </View>
          </View>

          {/* 태그 */}
          <View style={styles.tagsContainer}>
            {story?.tags?.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>

          {/* 기타 정보 */}
          <Text style={styles.metadata}>
            생성일: {story?.createdAt ? new Date(story.createdAt).toLocaleDateString() : '알 수 없음'}  | 자녀 나이: {story?.age}세
          </Text>

          {/* 재생 버튼 */}
          <TouchableOpacity
            style={styles.playButton}
            onPress={() =>
              navigation.navigate('PlayScreen', {
                story: {
                  id: story?.id || '',
                  title: story?.title || '',
                  content: story?.content || '',
                  author: story?.author || '알 수 없음',
                  coverUrl: story?.coverUrl || '',
                },
                ttsLink: ttsLink,
                isFromCreation: false,
              })
            }
          >
            <Icon name="play-circle-outline" size={24} color="#fff" />
            <Text style={styles.playButtonText}>재생</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likes: {
    marginLeft: 4,
    fontSize: 14,
    color: '#777',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    marginRight: 8,
    fontSize: 14,
    color: '#4A90E2',
  },
  metadata: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  playButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default StoryDetail;