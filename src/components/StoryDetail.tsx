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
import { getRequest, postRequest, deleteRequest } from '../api/apiManager';
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
  isLiked: boolean;
  isFollowed: boolean;
  authorId: string; // authorId 추가
}

const StoryDetail: React.FC = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ttsLink, setTtsLink] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const storyId = route.params?.storyId;

  const fetchStoryDetail = async (id: string) => {
    try {
      const response: StoryData = await getRequest(`/api/stories/${id}`);
      console.log('Story Detail Response:', response); // 디버깅용 로그
      console.log('Is Liked:', response.isLiked); // 좋아요 상태 확인

      setStory(response);
      setIsLiked(response.isLiked); // 좋아요 상태 설정
      setIsFollowed(response.isFollowed); // 팔로우 상태 설정
      setLikeCount(response.likes); // 좋아요 개수 설정
    } catch (err) {
      console.error('Error fetching story detail:', err);
      setError('동화 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTtsLink = async (id: string) => {
    try {
      const response = await getRequest(`/api/stories/tts/${id}`);
      setTtsLink(response);
    } catch (err) {
      console.error('Error fetching TTS link:', err);
    }
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await deleteRequest(`/api/stories/likes/${storyId}`);
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await postRequest(`/api/stories/likes/${storyId}`);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 처리 중 오류 발생:', err);
    }
  };

  const toggleFollow = async () => {
    try {
      if (story?.authorId) {
        if (isFollowed) {
          await deleteRequest(`/api/members/follow/${story.authorId}`);
          setIsFollowed(false);
        } else {
          await postRequest(`/api/members/follow/${story.authorId}`);
          setIsFollowed(true);
        }
      } else {
        console.error('Error: authorId is not available');
      }
    } catch (err) {
      console.error('팔로우 처리 중 오류 발생:', err);
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

    const unsubscribe = navigation.addListener('focus', () => {
      if (storyId) {
        fetchStoryDetail(storyId);
      }
    });

    return unsubscribe;
  }, [storyId, navigation]);

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
        <View style={styles.card}>
          <Image source={{ uri: story?.coverUrl }} style={styles.coverImage} />

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{story?.title}</Text>
            <TouchableOpacity style={styles.likesContainer} onPress={toggleLike}>
              <Icon
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? 'red' : '#777'}
              />
              <Text style={styles.likes}>{likeCount}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tagsContainer}>
            {story?.tags?.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                #{tag}
              </Text>
            ))}
          </View>

          <Text style={styles.author}>작가: {story?.author || '알 수 없음'}</Text>

          <Text style={styles.metadata}>
            생성일: {story?.createdAt ? new Date(story.createdAt).toLocaleDateString() : '알 수 없음'}
            {' | '}자녀 나이: {story?.age}세
          </Text>

          {/* 버튼 영역 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={toggleFollow}
            >
              <Text style={styles.followButtonText}>
                {isFollowed ? '팔로우 취소' : '팔로우 하기'}
              </Text>
            </TouchableOpacity>
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
              <Text style={styles.playButtonText}>동화 재생</Text>
            </TouchableOpacity>
          </View>
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
    height: 250,
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
    fontSize: 16,
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
  author: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  metadata: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#6C5CE7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playButton: {
    flex: 1,
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  playButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default StoryDetail;