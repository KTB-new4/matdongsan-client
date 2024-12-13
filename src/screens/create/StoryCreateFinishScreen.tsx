// StoryCreateFinishScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import { Switch } from 'react-native-switch';
import { getRequest, patchRequest } from '../../api/apiManager';

const StoryCreateFinishScreen: React.FC = ({ route, navigation }: any) => {
  const { story } = route.params;

  useEffect(() => {
    const maxRetries = 10; // 최대 재시도 횟수
    let retries = 0; // 현재 시도 횟수

    const fetchTtsLink = async () => {
      try {
        const response = await getRequest(`api/stories/tts/${story.id}`);
        console.log("API 응답 데이터:", response); // 응답 확인

        if (response) {
          setTtsLink(response); // TTS 링크 설정
          setIsLoading(false); // 로딩 상태 해제
          return;
        } else{
          console.log("TTS 생성 중...");
        }
      } catch (error) {
        console.error("Error fetching TTS link:", error);
      }
      
      if (retries < maxRetries) {
        retries += 1;
        console.log(story.id)
        setTimeout(fetchTtsLink, 5000); // 5초 간격으로 재시도
      } else {
        setIsLoading(false); // 최대 시도 후 로딩 해제
        console.warn("TTS 링크를 찾을 수 없습니다.");
      }
    };

    fetchTtsLink();

    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);


  

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(story.title);
  const [tempTitle, setTempTitle] = useState(title);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [ttsLink, setTtsLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditPress = () => {
    setTempTitle(title);
    setIsEditing(true);
  };

  // 제목 수정 완료
  const handleSavePress = async () => {
    if (tempTitle.trim() !== title) {
      try {
        await patchRequest(`/api/stories/${story.id}`, {
          title: tempTitle,
          isPublic: isPublished,
          tags,
        },{});
        setTitle(tempTitle);
        Alert.alert('성공', '제목이 수정되었습니다.');
        const updatedStory = await getRequest(`/api/stories/${story.id}`);
        console.log('PATCH 후 서버 데이터: ', updatedStory);
      } catch (error) {
        console.error('Error updating title:', error);
        Alert.alert('오류', '제목 수정에 실패했습니다.');
      }
    }
    setIsEditing(false);
  };

  // 태그 추가
  const addTag = async () => {
    if (tagInput.trim() && !tags.includes(`#${tagInput.trim()}`)) {
      const newTags = [...tags, `#${tagInput.trim()}`];
      setTags(newTags);
      setTagInput('');
      try {
        await patchRequest(`/api/stories/${story.id}`, {
          title,
          isPublic: isPublished,
          tags: newTags,
        });
        Alert.alert('성공', '태그가 추가되었습니다.');
      } catch (error) {
        console.error('Error adding tag:', error);
        Alert.alert('오류', '태그 추가에 실패했습니다.');
      }
    }
  };

  // 태그 삭제
  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    try {
      await patchRequest(`/api/stories/${story.id}`, {
        title,
        isPublic: isPublished,
        tags: newTags,
      });
      Alert.alert('성공', '태그가 삭제되었습니다.');
    } catch (error) {
      console.error('Error removing tag:', error);
      Alert.alert('오류', '태그 삭제에 실패했습니다.');
    }
  };

  const handdlePublishToggle = async (isPublished : boolean) => {
    setIsPublished(isPublished);
    try{
      //서버 업데이트 요청
      await patchRequest(`api/stories/${story.id}`, {
        title,
        isPublic: isPublished,
        tags,
      });
      Alert.alert('성공', `동화가 ${isPublished ? '게시' : '비공개'} 처리되었습니다.`);
    }
    catch(error){
      console.error('Error updating isPublic : ', error);
      Alert.alert('오류', '동화 게시 상태를 변경하는데 실패했습니다.');
    }
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const patchAndPlayStory = async () => {
    const titleModified = title !== story.title;
    const tagsModified = tags.length > 0;
    const isPublicModified = isPublished;

    if (titleModified || tagsModified || isPublicModified) {
      try {
        const response = await patchRequest(`/api/stories/${story.id}`, {
          title,
          isPublic: isPublished,
          tags,
        });
        console.log("API Patch Response: ", response.data);
      } catch (error) {
        console.error("API 호출 오류: ", error);
      }
    }

    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'MainTabs', params: { screen: 'HomeNav', params: { screen: 'Home' } } },
          { name: 'PlayScreen', params: { story, isFromCreation: true, ttsLink } },
        ],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <Image source={require('../../assets/images/cover2.png')} style={styles.storyImage} resizeMode="cover" />

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.label}>제목</Text>
              {isEditing ? (
                <TextInput style={styles.titleInput} value={tempTitle} onChangeText={setTempTitle} multiline />
              ) : (
                <Text style={styles.title}>{title}</Text>
              )}
              <TouchableOpacity onPress={isEditing ? handleSavePress : handleEditPress}>
                <Icon name="edit-2" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Preview Section */}
          <View style={styles.previewContainer}>
            <TouchableOpacity onPress={openModal}>
              <Text style={styles.detailText}>내용 미리보기</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={isModalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  <Text style={styles.modalText}>{story.content}</Text>
                </ScrollView>
                <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.buttonText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Tags Section */}
          <View style={styles.tagsContainer}>
            <Text style={styles.label}>태그</Text>
            <View style={styles.tagsList}>
              {tags.map((tag, index) => (
                <TouchableOpacity key={index} style={styles.tag} onPress={() => removeTag(tag)}>
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={tagInput}
                onChangeText={setTagInput}
                placeholder="태그를 입력하세요"
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Text style={styles.addTagText}>+ 추가</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Publish Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>동화 게시하기</Text>
            <Switch
              value={isPublished}
              onValueChange={handdlePublishToggle}
              circleSize={24}
              barHeight={30}
              circleBorderWidth={0}
              backgroundActive="#6366F1"
              backgroundInactive="#D1D5DB"
              circleActiveColor="#FFFFFF"
              circleInActiveColor="#FFFFFF"
              renderActiveText={false}
              renderInActiveText={false}
            />
          </View>

          {/* Play Button */}
          <TouchableOpacity style={[styles.playButton, isLoading && styles.disabledButton]} onPress={patchAndPlayStory} disabled={isLoading}>
            <Icon name="play" size={20} color="#FFFFFF" style={styles.playIcon} />
            <Text style={styles.playButtonText}>동화 재생</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  scrollContent: {
    paddingBottom: 20, // 스크롤 영역의 여백 설정
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flex: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storyImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  titleContainer: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginRight: 14,
    marginLeft: 8
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  titleInput: {
    flex: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 2,
  },
  previewContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  previewText: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailText: {
    color: '#6366F1',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center'
  },
  tagsContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  tagText: {
    color: '#6366F1',
    fontSize: 14,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 2,
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addTagText: {
    color: '#6B7280',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 10
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  playButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  playIcon: {
    marginRight: 8,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton:{
    backgroundColor: '#B0B0B0'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
  },
});

export default StoryCreateFinishScreen;
