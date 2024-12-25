import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
  ActivityIndicator,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getRequest } from '../../api/apiManager';

const { width: screenWidth } = Dimensions.get('window');
const SPACING = 15;

const RecommendScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const CARD_WIDTH = screenWidth * 0.4;

  const [popularStories, setPopularStories] = useState<any[]>([]);
  const [latestStories, setLatestStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const popularParams = {
          sortBy: 'popular',
          language: 'all',
          age: 'main',
          page: 0,
          size: 10,
        };
        const latestParams = {
          sortBy: 'recent',
          language: 'all',
          age: 'main',
          page: 0,
          size: 10,
        };

        console.log('Fetching popular stories with params:', popularParams);
        const popularResponse = await getRequest('api/library', popularParams);
        console.log('Popular stories response:', popularResponse);

        console.log('Fetching latest stories with params:', latestParams);
        const latestResponse = await getRequest('api/library', latestParams);
        console.log('Latest stories response:', latestResponse);

        setPopularStories((popularResponse.content || []).slice(0, 10));
        setLatestStories((latestResponse.content || []).slice(0, 10));
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const navigateToStoryDetail = (storyId: string) => {
    navigation.navigate('StoryDetail', { storyId });
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, { marginRight: SPACING }]}
      onPress={() => navigateToStoryDetail(item.id)}
    >
      <Image source={{ uri: item.coverUrl }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.tagText}>{item.tag || '#기타'}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToAllStories = () => {
    navigation.navigate('AllStoryScreen');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 인기 동화 */}
        <Text style={styles.sectionTitle}>인기 동화</Text>
        <Carousel
          width={CARD_WIDTH + SPACING}
          height={220}
          data={popularStories}
          renderItem={renderCarouselItem}
          loop={false}
          snapEnabled
          pagingEnabled={false}
          style={{ width: screenWidth, paddingLeft: SPACING }}
        />

        {/* 최신 동화 */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>최신 동화</Text>
        <Carousel
          width={CARD_WIDTH + SPACING}
          height={220}
          data={latestStories}
          renderItem={renderCarouselItem}
          loop={false}
          snapEnabled
          pagingEnabled={false}
          style={{ width: screenWidth, paddingLeft: SPACING }}
        />

        {/* 전체 동화 보기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={navigateToAllStories}>
          <Text style={styles.buttonText}>전체 동화 보기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  scrollViewContent: {
    paddingTop: 30,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 20,
    color: '#4B5563',
  },
  card: {
    width: screenWidth * 0.4,
    marginLeft: SPACING,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  tagText: {
    fontSize: 12,
    color: '#777',
  },
  button: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RecommendScreen;