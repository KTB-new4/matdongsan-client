import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import StorySummary from '../../../components/StorySummary';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { getRequest } from '../../../api/apiManager';

interface Story {
  id: string;
  tag: string;
  title: string;
  author: string;
  likes: number;
  coverUrl: string;
}

interface LevelTwoStoryProps {
  searchQuery: string;
  sortOption: string;
}

const LevelTwoStory: React.FC<LevelTwoStoryProps> = ({ searchQuery, sortOption }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'StoryDetail'>>();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true); // 데이터가 더 있는지 여부
  const pageSize = 10;

  const fetchStories = async (currentPage: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setHasMore(true); // 데이터가 더 있을 가능성을 초기화
        setPage(0); // 페이지 초기화
      } else if (currentPage > 0) {
        setLoadingMore(true);
      }

      const params = {
        sortBy: sortOption,
        language: 'all',
        age: 'lv2',
        page: currentPage,
        size: pageSize,
      };

      const response = await getRequest('/api/library', params);

      const newStories = response.content.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        likes: item.likes,
        tag: item.tags?.[0] || '기타',
        coverUrl: item.coverUrl,
      }));

      setStories((prevStories) => {
        if (reset) return newStories; // 초기화 시 새로운 데이터로 교체
        const existingIds = new Set(prevStories.map((story) => story.id));
        const uniqueStories = newStories.filter((story: Story) => !existingIds.has(story.id));
        return [...prevStories, ...uniqueStories]; // 추가 로드 시 기존 데이터에 합침
      });

      if (newStories.length < pageSize) {
        setHasMore(false); // 데이터가 더 이상 없음을 표시
      }
    } catch (err) {
      console.error('LevelTwoStory 데이터 요청 오류:', err);
      setError('동화 목록을 불러오지 못했습니다.');
    } finally {
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // 화면으로 돌아왔을 때 데이터를 초기화하고 첫 페이지 로드
  useFocusEffect(
    useCallback(() => {
      fetchStories(0, true); // 데이터를 초기화하고 처음부터 로드
    }, [sortOption])
  );

  // 검색어에 따른 필터링
  useEffect(() => {
    const updatedStories = searchQuery.trim()
      ? stories.filter((story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : stories;

    setFilteredStories(updatedStories);
  }, [searchQuery, stories]);

  const loadMoreStories = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStories(nextPage);
    }
  };

  const renderItem = ({ item }: { item: Story }) => (
    <StorySummary
      tag={item.tag}
      title={item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title}
      author={item.author}
      likes={item.likes}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
      coverUrl={item.coverUrl}
    />
  );

  if (loading && page === 0) {
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
    <View style={styles.container}>
      <FlatList
        data={filteredStories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMoreStories}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color="#4A90E2" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F9FF',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoading: {
    marginVertical: 20,
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

export default LevelTwoStory;