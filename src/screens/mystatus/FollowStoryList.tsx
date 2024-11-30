import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import StorySummary from '../../components/StorySummary';
import { useNavigation, NavigationProp, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

type FollowStoryListRouteProp = RouteProp<RootStackParamList, 'FollowStoryList'>;

const profileImage = require('../../assets/images/profileimage.png');

const FollowStoryList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, 'StoryDetail'>>();
  const route = useRoute<FollowStoryListRouteProp>();

  // 팔로워 정보 및 스토리 더미 데이터
  const { nickname, followers } = route.params;
  const [stories, setStories] = useState([
    { id: '1', tag: '가족', title: '가족 이야기', author: '홍길동', likes: 1000 },
    { id: '2', tag: '사랑', title: '사랑 이야기', author: '김철수', likes: 1000 },
    { id: '3', tag: '우정', title: '우정 이야기', author: '홍길동', likes: 1000 },
    { id: '4', tag: '지혜', title: '지혜 이야기', author: '김철수', likes: 1000 },
    // 더미 데이터 추가 가능
  ]);

  const renderItem = ({ item }: { item: typeof stories[0] }) => (
    <StorySummary
      tag={item.tag}
      title={item.title}
      author={item.author}
      likes={item.likes}
      onPress={() => navigation.navigate('StoryDetail', { storyId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      {/* 팔로워 정보 섹션 */}
      <View style={styles.header}>
        <Image source={profileImage} style={styles.profileImage} />
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{nickname}</Text>
          <View style={styles.followersContainer}>
            <Text style={styles.likeIcon}>❤️</Text>
            <Text style={styles.followers}>{followers.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      {/* 스토리 목록 */}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
  },
  userInfo: {
    marginLeft: 15,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  followersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeIcon: {
    color: 'red',
    fontSize: 14,
    marginRight: 4,
  },
  followers: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default FollowStoryList;
