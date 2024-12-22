import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import StorySummary from '../../components/StorySummary';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getRequest } from '../../api/apiManager'; // API 호출 함수

interface Story {
  id: string;
  tag: string;
  title: string;
  author: string;
  likes: number;
  coverUrl: string;
}

interface UserProfile {
  profileImage: string;
  nickname: string;
  storyCount: number;
  likeCount: number;
}

const MyPageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSort, setSelectedSort] = useState<string>('recent'); // 정렬 상태
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // 사용자 정보 가져오기
  const fetchUserProfile = async () => {
    try {
      const response = await getRequest('/api/members');
      setUserProfile({
        profileImage: response.profileImage,
        nickname: response.nickname,
        storyCount: response.storyCount,
        likeCount: response.likeCount,
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // 서버에서 내 동화 목록 가져오기
  const fetchStories = async () => {
    try {
      setLoading(true);

      const params = {
        sort: selectedSort === 'recent' ? 'recent' : 'popular', // 최신순 또는 좋아요순
        language: 'all',
        age: 'main',
        pageable: {
          page: 0,
          size: 5,
        },
      };

      console.log('Request Params:', params);

      const response = await getRequest('/api/library/my', params); // getRequest로 params 전달
      console.log('API Response:', response);

      // 응답 데이터 가공
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

  // 초기 데이터 가져오기
  useEffect(() => {
    fetchUserProfile();
    fetchStories();
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
      {/* 상단 프로필 정보 */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userProfile?.profileImage || 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userProfile?.nickname || '알 수 없음'}</Text>
        <View style={styles.profileStats}>
          <Text style={styles.statText}>{userProfile?.storyCount || 0}</Text>
          <Text style={styles.statLabel}>작품 수</Text>
          <Text style={styles.statText}>{userProfile?.likeCount || 0}</Text>
          <Text style={styles.statLabel}>좋아요 ❤️</Text>
        </View>
      </View>

      {/* 정렬 버튼 */}
      <View style={styles.sortButtonsContainer}>
        <TouchableOpacity
          style={[styles.sortButton, selectedSort === 'recent' && styles.activeSortButton]}
          onPress={() => setSelectedSort('recent')}
        >
          <Text style={[styles.sortButtonText, selectedSort === 'recent' && styles.activeSortButtonText]}>
            최신순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, selectedSort === 'popular' && styles.activeSortButton]}
          onPress={() => setSelectedSort('likes')}
        >
          <Text style={[styles.sortButtonText, selectedSort === 'popular' && styles.activeSortButtonText]}>
            좋아요순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => navigation.navigate('MyStatusScreen')}
        >
          <Text style={styles.infoButtonText}>내 정보</Text>
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
    flexDirection: 'row',
    marginTop: 10,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
    marginHorizontal: 10,
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
  infoButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFD700',
  },
  infoButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
});

export default MyPageScreen;