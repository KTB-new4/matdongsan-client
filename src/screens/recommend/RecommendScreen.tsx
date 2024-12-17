import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const { width: screenWidth } = Dimensions.get('window');

// SPACING을 styles 정의 전에 선언
const SPACING = 15; // 카드 간 간격

// 데이터 배열
const stories = [
  { id: '1', source: require('../../assets/images/cover1.png'), tag: '#모험', title: '동화 1' },
  { id: '2', source: require('../../assets/images/cover2.png'), tag: '#우정', title: '동화 2' },
  { id: '3', source: require('../../assets/images/cover3.png'), tag: '#가족', title: '동화 3' },
  { id: '4', source: require('../../assets/images/cover4.png'), tag: '#여행', title: '동화 4' },
];

const RecommendScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const CARD_WIDTH = screenWidth * 0.4; // 카드 너비

  const navigateToStoryDetail = (storyId: string) => {
    navigation.navigate('StoryDetail', { storyId });
  };

  const renderCarouselItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, { marginRight: SPACING }]}
      onPress={() => navigateToStoryDetail(item.id)} // 클릭 시 StoryDetail로 이동
    >
      <Image source={item.source} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.tagText}>{item.tag}</Text>
      </View>
    </TouchableOpacity>
  );

  const navigateToAllStories = () => {
    navigation.navigate('AllStoryScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* 인기 동화 */}
        <Text style={styles.sectionTitle}>인기 동화</Text>
        <Carousel
          width={CARD_WIDTH + SPACING}
          height={220}
          data={stories}
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
          data={stories}
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
  scrollViewContent: {
    paddingTop: 30, // 전체 상단 여백
    paddingBottom: 20, // 하단 여백
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
    marginLeft: 20,
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