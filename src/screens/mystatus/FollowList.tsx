import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import FollowSummary from '../../components/FollowSummary';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const screenWidth = Dimensions.get('window').width;
const numColumns = 3;
const spacing = 10;
const itemWidth = (screenWidth - spacing * (numColumns + 1 )) / numColumns;

const dummyData = [
  { id: '1', nickname: '닉네임1', followers: 1100 },
  { id: '2', nickname: '닉네임2', followers: 950 },
  { id: '3', nickname: '닉네임3', followers: 1200 },
  { id: '4', nickname: '닉네임4', followers: 700 },
  { id: '5', nickname: '닉네임5', followers: 1340 },
  { id: '6', nickname: '닉네임6', followers: 2100 },
];

const FollowList = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const renderItem = ({ item }: { item: typeof dummyData[0] }) => (
    <FollowSummary
    nickname={item.nickname}
    followers={item.followers}
    containerStyle={{width: itemWidth, marginHorizontal: spacing/2}}
    onPress={() => navigation.navigate('FollowStoryList', {
        nickname: item.nickname,
        followers: item.followers,
    })}
    />
  );

  return (
    <FlatList
      data={dummyData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: spacing/2,
  },
});

export default FollowList;
