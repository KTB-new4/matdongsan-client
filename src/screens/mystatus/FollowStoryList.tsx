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
import { SafeAreaView } from 'react-native-safe-area-context';

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

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

const FollowStoryList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<FollowStoryListRouteProp>();

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState<string>('recent');
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { authorId } = route.params;

  const fetchAuthorData = async () => {
    try {
      const response: AuthorData = await getRequest(`/api/members/${authorId}`);
      setAuthorData(response);
    } catch (err) {
      console.error('Error fetching author data:', err);
    }
  };

  const fetchStories = async (page: number, isLoadingMore: boolean = false) => {
    try {
      if (!isLoadingMore) {
        setLoading(true);
      }
      const params = {
        sortBy: selectedSort,
        page,
        size:10,
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

      if (isLoadingMore) {
        setStories(prev => [...prev, ...formattedStories]);
      } else {
        setStories(formattedStories);
      }

      setHasMore(response.content.length === 10);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching stories:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

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
    setCurrentPage(0);
    setHasMore(true);
    fetchStories(0);
    fetchFollowStatus();
  }, [selectedSort]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchStories(currentPage + 1, true);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator
        size="small"
        color="#6B66FF"
        style={styles.footerLoader}
      />
    );
  };

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
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageSection}>
            <Image
              source={{ uri: authorData?.profileImage || 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{authorData?.nickname || '알 수 없음'}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(authorData?.storyCount || 0)}</Text>
              <Text style={styles.statLabel}>작품 수</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(authorData?.likeCount || 0)}</Text>
              <Text style={styles.statLabel}>좋아요❤️</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.sortButtons}>
            <TouchableOpacity
              style={[styles.sortButton, selectedSort === 'recent' && styles.activeSortButton]}
              onPress={() => setSelectedSort('recent')}
            >
              <Text style={[styles.buttonText, selectedSort === 'recent' && styles.activeButtonText]}>
                최신순
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, selectedSort === 'popular' && styles.activeSortButton]}
              onPress={() => setSelectedSort('popular')}
            >
              <Text style={[styles.buttonText, selectedSort === 'popular' && styles.activeButtonText]}>
                좋아요순
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.followButton, isFollowed && styles.followedButton]}
            onPress={toggleFollow}
            disabled={loadingFollow}
          >
            <Text style={styles.followButtonText}>
              {isFollowed ? '팔로우 취소' : '팔로우'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6B66FF" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={stories}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  profileImageSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
    paddingTop: 50,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  activeSortButton: {
    backgroundColor: '#6B66FF',
  },
  buttonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  followButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#6B66FF',
  },
  followedButton: {
    backgroundColor: '#FF4B4B',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  footerLoader: {
    marginVertical: 16,
  },
});

export default FollowStoryList;

