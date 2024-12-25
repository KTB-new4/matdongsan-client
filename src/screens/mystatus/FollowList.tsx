import React, { useState, useEffect, useCallback } from 'react';
import { Dimensions, FlatList, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import FollowSummary from '../../components/FollowSummary';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { getRequest } from '../../api/apiManager';

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const spacing = 10;
const itemWidth = (screenWidth - spacing * (numColumns + 1)) / numColumns;

interface FollowData {
  id: number; // 작가 ID
  nickname: string;
  followers: number;
  profileImage: string;
}

const FollowList: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [followList, setFollowList] = useState<FollowData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 팔로우 리스트 가져오기
  const fetchFollowList = async () => {
    try {
      setLoading(true);
      const response: FollowData[] = await getRequest('/api/members/follow');
      setFollowList(response);
    } catch (err) {
      console.error('Error fetching follow list:', err);
      setError('팔로우 리스트를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 화면으로 돌아올 때 팔로우 리스트 갱신
  useFocusEffect(
    useCallback(() => {
      fetchFollowList();
    }, [])
  );

  const renderItem = ({ item }: { item: FollowData }) => (
    <FollowSummary
      nickname={item.nickname}
      followers={item.followers}
      profileImage={item.profileImage}
      containerStyle={{ width: itemWidth, marginHorizontal: spacing / 2 }}
      onPress={() =>
        navigation.navigate('FollowStoryList', {
          nickname: item.nickname,
          followers: item.followers,
          authorId: item.id, // 작가 ID 전달
          profileImage: item.profileImage
        })
      }
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
    <FlatList
      data={followList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: spacing / 2,
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

export default FollowList;