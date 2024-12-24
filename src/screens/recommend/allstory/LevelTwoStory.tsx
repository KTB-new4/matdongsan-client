import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Dimensions } from 'react-native';
import StorySummary from '../../../components/StorySummary';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { getRequest } from '../../../api/apiManager'; // API 호출 함수

interface Story {
  id: string;
  tag: string;
  title: string;
  author: string;
  likes: number;
  coverUrl: string;
}

interface AllStoryProps {
  searchQuery: string; // 검색어
  sortOption: string; // 정렬 옵션
}

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 40) / 2; // 이미지 크기

const LevelTwoStory: React.FC<AllStoryProps> = ({ searchQuery, sortOption }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'StoryDetail'>>();
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 서버에서 동화 목록 가져오기
  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await getRequest('/api/library', {
        params: {
          sort: sortOption,
          language: 'all',
          age: 'main',
          pageable: {
            page: 0,
            size: 10,
            sort: [sortOption],
          },
        },
      });

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
      setError('동화 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [sortOption]);

  useEffect(() => {
    let updatedStories = [...stories];
    if (searchQuery.trim() !== '') {
      updatedStories = updatedStories.filter((story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredStories(updatedStories);
  }, [searchQuery, stories]);

  // 항목 렌더링
  const renderItem = ({ item }: { item: Story }) => (
    <StorySummary
      tag={item.tag}
      title={item.title.length > 15 ? `${item.title.slice(0, 15)}...` : item.title} // 제목 길이 제한
      author={item.author}
      likes={item.likes}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
      coverUrl={item.coverUrl} // 서버에서 가져온 커버 이미지
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

export default LevelTwoStory;