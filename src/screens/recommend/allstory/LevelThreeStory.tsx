// AllStory.tsx (또는 다른 탭 컴포넌트와 동일한 구조로)
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import StorySummary from '../../../components/StorySummary';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';

const LevelThreeStory: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'StoryDetail'>>();
  const [stories, setStories] = useState([
    { id: '1', tag: '가족', title: '가족 이야기', author: '홍길동', likes: 1000 },
    { id: '2', tag: '사랑', title: '사랑 이야기', author: '김철수', likes: 1000 },
    { id: '3', tag: '우정', title: '우정 이야기', author: '홍길동', likes: 1000 },
    { id: '4', tag: '지혜', title: '지혜 이야기', author: '김철수', likes: 1000 },
    // 더미 데이터 추가
  ]);

  const renderItem = ({ item }: { item: typeof stories[0] }) => (
    <StorySummary
      tag={item.tag}
      title={item.title}
      author={item.author}
      likes={item.likes}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id})}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer:{
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
});

export default LevelThreeStory;
