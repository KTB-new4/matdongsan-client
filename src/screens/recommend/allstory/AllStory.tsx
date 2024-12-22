import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
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

interface AllStoryProps {
  searchQuery: string;
  sortOption: string;
}

const AllStory: React.FC<AllStoryProps> = ({ searchQuery, sortOption }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'StoryDetail'>>();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStories = async () => {
    try {
      setLoading(true);
  
      // 요청 파라미터
      const params = {
        sort: sortOption, // 최신순 또는 인기순
        language: 'all',
        age: 'main',
        pageable: {
          page: 0,
          size: 10, // RecommendScreen과 동일한 페이지 크기
        },
      };
  
      // 요청 파라미터 로그
      console.log('AllStory 요청 파라미터:', params);
  
      // 서버 요청
      const response = await getRequest('/api/library', params);
  
      // 응답 로그
      console.log('AllStory 서버 응답:', response);
  
      // 데이터 변환
      const formattedStories = response.content.map((item: any) => ({
        id: item.id,
        title: item.title,
        author: item.author,
        likes: item.likes,
        tag: item.tags?.[0] || '기타',
        coverUrl: item.coverUrl,
      }));
  
      setStories(formattedStories);
    } catch (err) {
      console.error('AllStory 데이터 요청 오류:', err);
      setError('동화 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStories();
    }, [sortOption])
  );

  useEffect(() => {
    let updatedStories = [...stories];

    if (searchQuery.trim() !== '') {
      updatedStories = updatedStories.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredStories(updatedStories);
  }, [searchQuery, stories]);

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
    <View style={styles.container}>
      <FlatList
        data={filteredStories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
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

export default AllStory;