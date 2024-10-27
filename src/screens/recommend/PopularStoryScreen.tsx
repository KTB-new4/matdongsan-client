import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  Button
} from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS, useDerivedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

// 이미지 데이터 타입 정의
type ImageData = {
  id: string;
  source: any;
  tag: string;
  title: string;
  author: string;
};

// 이미지 데이터 배열
const imageData: ImageData[] = [
  {
    id: '1',
    source: require('../../assets/images/cover1.png'),
    tag: '#모험',
    title: '인기동화 1',
    author: '작가1',
  },
  {
    id: '2',
    source: require('../../assets/images/cover2.png'),
    tag: '#판타지',
    title: '인기동화 2',
    author: '작가2',
  },
  {
    id: '3',
    source: require('../../assets/images/cover3.png'),
    tag: '#우정',
    title: '인기동화 3',
    author: '작가3',
  },
  {
    id: '4',
    source: require('../../assets/images/cover4.png'),
    tag: '#가족',
    title: '인기동화 4',
    author: '작가4',
  },
  {
    id: '5',
    source: require('../../assets/images/cover5.png'),
    tag: '#자연',
    title: '인기동화 5',
    author: '작가5',
  },
];

const RecommendScreen: React.FC = () => {
  const activeIndex = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSnapToItem = (index: number) => {
    activeIndex.value = withTiming(index);
    runOnJS(setCurrentIndex)(index);
  };

  const renderItem = ({ item }: { item: ImageData }) => (
    <View style={styles.card}>
      <Image source={item.source} style={styles.image} />
      <View style={styles.likeBox}>
        <Text>❤️ 1,0k</Text>
      </View>
      <View style={styles.textInfo}>
        <Text style={styles.infoText}>{item.tag}</Text>
        <Text style={styles.infoText}>제목: {item.title}</Text>
        <Text style={styles.infoText}>작가: {item.author}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Carousel
        width={screenWidth * 0.8}
        height={400}
        data={imageData}
        renderItem={renderItem}
        onSnapToItem={handleSnapToItem}
        style={{ alignSelf: 'center' }}
        loop={false} // 자동 슬라이드 비활성화
        pagingEnabled={true} // 부드럽게 한 페이지씩 이동
        snapEnabled={true}
        mode="parallax"
        modeConfig={{
          parallaxScrollingOffset: 60, // 옆 이미지 간격 조정
          parallaxScrollingScale: 0.9, // 옆 이미지 크기 조정
        }}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>동화 보러가기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#e0e0e0',
    padding: 10,
    alignItems: 'center',
    height: 350,
    justifyContent: 'space-between',
    marginHorizontal: 10, // 아이템 간격 설정
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  likeBox: {
    backgroundColor: '#d3d3d3',
    padding: 5,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  textInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#d3d3d3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default RecommendScreen;
