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
  isMyStory: boolean;
  authorId: string;
}

const StoryDetail: React.FC = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [story, setStory] = useState<StoryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ttsLink, setTtsLink] = useState<string | null>(null);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  const storyId = route.params?.storyId;

  const fetchStoryDetail = async (id: string) => {
    try {
      const response: StoryData = await getRequest(`/api/stories/${id}`);
      setStory(response);
      setIsLiked(response.isLiked);
      setIsFollowed(response.isFollowed);
      setLikeCount(response.likes);
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
      setTtsLink(response.ttsUrl);
      setTimestamps(response.timestamps);
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
      if (story?.isMyStory) {
        alert('자신의 동화는 팔로우할 수 없습니다.');
        return;
      }

      if (isFollowed) {
        await deleteRequest(`/api/members/follow/${story?.authorId}`);
        setIsFollowed(false);
      } else {
        await postRequest(`/api/members/follow/${story?.authorId}`);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('팔로우/언팔로우 처리 중 오류 발생:', err);
      alert('작업 중 오류가 발생했습니다. 다시 시도해 주세요.');
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: story?.coverUrl }} style={styles.coverImage} />
            <View style={styles.likeButton}>
              <TouchableOpacity onPress={toggleLike}>
                <View style={styles.likeContent}>
                  <Icon
                    name={isLiked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isLiked ? '#FF4B4B' : '#666'}
                  />
                  <Text style={styles.likeCount}>{likeCount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.title}>{story?.title}</Text>

            {story?.tags && story.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {story.tags.map((tag, index) => (
                  <Text key={index} style={styles.tag}>{tag}</Text>
                ))}
              </View>
            )}

            <Text style={styles.author}>{story?.author}</Text>

            <View style={styles.metadataContainer}>
              <Text style={styles.metadata}>생성일 : {formatDate(story?.createdAt || '')}</Text>
              <Text style={styles.metadata}>자녀 나이 : {story?.age}세</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.followButton, isFollowed && styles.followedButton]}
                onPress={toggleFollow}
              >
                <Text style={styles.buttonText}>
                  {isFollowed ? '팔로우 취소' : '팔로우'}
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
                      author: story?.author || '',
                      coverUrl: story?.coverUrl || '',
                    },
                    ttsLink: ttsLink,
                    timestamps: timestamps,
                    isFromCreation: false,
                  })
                }
              >
                <Icon name="play-circle-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>재생</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 8,
  },
  likeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    color: '#6B66FF',
    fontSize: 14,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  metadataContainer: {
    marginBottom: 20,
  },
  metadata: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#6B66FF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followedButton: {
    backgroundColor: '#FF4B4B',
  },
  playButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});

export default StoryDetail;

