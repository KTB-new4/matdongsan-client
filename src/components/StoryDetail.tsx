// StoryDetail.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

const StoryDetail: React.FC = () => {
  const route = useRoute<StoryDetailRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const dummyStoryData = {
    id: 'dummy-id',
    title: 'Dummy Story Title',
    content: 'This is a sample story content for testing purposes.',
  };

  // storyId가 없을 경우 대비
  const storyId = route.params?.storyId;

  if (!storyId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Story ID가 없습니다. 올바른 경로로 접근해주세요.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>동화 제목 (ID: {storyId})</Text>
      <Text style={styles.author}>작가: 홍길동</Text>
      <Text style={styles.tag}>#가족</Text>
      <Text style={styles.createdAt}>생성 일자: 2024-10-31</Text>
      <Button title="재생" onPress={() => navigation.navigate('PlayScreen', {story : dummyStoryData, isFromCreation : false})} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    marginBottom: 5,
  },
  tag: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default StoryDetail;
