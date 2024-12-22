import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import StorySummary from '../../components/StorySummary';
import { useRoute, RouteProp, NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getRequest, postRequest, deleteRequest } from '../../api/apiManager';

interface Story {
  id: string;
  tag: string;
  title: string;
  author: string;
  likes: number;
  coverUrl: string;
}

interface AuthorData {
  profileImage: string;
  nickname: string;
  followers: number;
  storyCount: number;
  likeCount: number;
}

type FollowStoryListRouteProp = RouteProp<RootStackParamList, 'FollowStoryList'>;

const FollowStoryList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<FollowStoryListRouteProp>();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSort, setSelectedSort] = useState<string>('recent'); // 정렬 상태
  const [isFollowed, setIsFollowed] = useState<boolean>(false); // 팔로우 상태
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false); // 팔로우 요청 중인지 여부
  const [authorData, setAuthorData] = useState<AuthorData | null>(null); // 작가 정보

  const { authorId } = route.params;

  // 작가 정보 가져오기
  const fetchAuthorData = async () => {
    try {
      const response: AuthorData = await getRequest(`/api/members/${authorId}`);
      setAuthorData(response);
    } catch (err) {
      console.error('Error fetching author data:', err);
    }
  };

  // 서버에서 해당 작가의 동화 목록 가져오기
  const fetchStories = async () => {
    try {
      setLoading(true);

      const params = {
        sort: selectedSort,
        pageable: {
          page: 0,
          size: 10,
        },
      };

      const response = await getRequest(`/api/library/${authorId}`, params);
      const formattedStories: Story[] = response.content.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        likes: item.likes,
        tag: item.tags?.[0] || '기타',
        coverUrl: item.coverUrl,
      }));

      setStories(formattedStories);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
    }
  };

  // 팔로우 상태 확인 및 업데이트
  const fetchFollowStatus = async () => {
    try {
      const response = await getRequest(`/api/members/follow`);
      const isUserFollowed = response.some((user: any) => user.id === authorId);
      setIsFollowed(isUserFollowed);
    } catch (err) {
      console.error('Error fetching follow status:', err);
    }
  };

  const toggleFollow = async () => {
    setLoadingFollow(true);
    try {
      if (isFollowed) {
        await deleteRequest(`/api/members/follow/${authorId}`);
        setIsFollowed(false);
      } else {
        await postRequest(`/api/members/follow/${authorId}`);
        setIsFollowed(true);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    } finally {
      setLoadingFollow(false);
    }
  };

  useEffect(() => {
    fetchAuthorData();
    fetchStories();
    fetchFollowStatus();
  }, [selectedSort]);

  // 동화 렌더링
  const renderItem = ({ item }: { item: Story }) => (
    <StorySummary
      tag={item.tag}
      title={item.title}
      author={item.author}
      likes={item.likes}
      coverUrl={item.coverUrl}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      {/* 상단 작가 정보 */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: authorData?.profileImage || 'https://example.com/default-profile.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{authorData?.nickname}</Text>
        <View style={styles.profileStats}>
          <Text style={styles.statText}>작품 수: {authorData?.storyCount}</Text>
          <Text style={styles.statText}>좋아요 수: {authorData?.likeCount}</Text>
        </View>
      </View>

      {/* 팔로우 버튼 */}
      <View style={styles.followButtonContainer}>
        <TouchableOpacity
          style={[styles.followButton, isFollowed ? styles.unfollowButton : null]}
          onPress={toggleFollow}
          disabled={loadingFollow}
        >
          <Text style={styles.followButtonText}>
            {isFollowed ? '팔로우 취소' : '팔로우 하기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 정렬 버튼 */}
      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.sortButton,
            selectedSort === 'recent' && styles.activeSortButton,
          ]}
          onPress={() => setSelectedSort('recent')}
        >
          <Text
            style={[
              styles.sortButtonText,
              selectedSort === 'recent' && styles.activeSortButtonText,
            ]}
          >
            최신순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            selectedSort === 'popular' && styles.activeSortButton,
          ]}
          onPress={() => setSelectedSort('popular')}
        >
          <Text
            style={[
              styles.sortButtonText,
              selectedSort === 'popular' && styles.activeSortButtonText,
            ]}
          >
            좋아요순
          </Text>
        </TouchableOpacity>
      </View>

      {/* 동화 리스트 */}
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={stories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    padding: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileStats: {
    marginTop: 10,
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  followButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  followButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
  },
  unfollowButton: {
    backgroundColor: '#FF6B6B',
  },
  followButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  sortButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sortButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E8E8E8',
  },
  activeSortButton: {
    backgroundColor: '#4A90E2',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#555',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default FollowStoryList;