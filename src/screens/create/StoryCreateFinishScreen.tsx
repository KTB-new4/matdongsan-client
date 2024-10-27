import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal, BackHandler } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

const StoryCreateFinishScreen = ({route, navigation } : any) => {
  const {story} = route.params;

  useEffect(() => {
    const backAction =() => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  },[navigation])

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('story.title');
  const [tempTitle, setTempTitle] = useState(title);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postStatus, setPostStatus] = useState<null | 'yes' | 'no'>(null);
  const [tag, setTag] = useState('');

  const playStory = () =>{
    navigation.navigate('Play');
  };

  const handleEditPress = () => {
    setTempTitle('');
    setIsEditing(true);
  };

  const handleSavePress = () => {
    if(tempTitle.trim() !== ''){
      setTitle(tempTitle);
    }
    setIsEditing(false);
  };

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handletag = () => {
    setTag(tag);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 제목 섹션 */}
        <View style={styles.row}>
          <Text style={styles.label}>제목</Text>
          <View style={styles.inlineRow}>
            {isEditing ? (
              <TextInput
              style={styles.input}
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder={title}
              />
            ) : (
              <Text style={styles.content}>{title}</Text>
            )}
            <TouchableOpacity style={styles.smallButton}
            onPress={isEditing ? handleSavePress : handleEditPress}
            >
              <Text style={styles.buttonText}>
                {isEditing ? '완료' : '수정'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 내용 섹션 */}
        <View style={styles.row}>
          <Text style={styles.label}>내용</Text>
          <TouchableOpacity style={styles.smallButton} onPress={openModal}>
            <Text style={styles.buttonText}>상세 보기</Text>
          </TouchableOpacity>
        </View>

        <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{story.content}</Text>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 태그 섹션 */}
        <View style={styles.row}>
          <Text style={styles.label}>태그</Text>
          <TextInput
          style={styles.input}
          value={tag}
          onChangeText={setTag}
          placeholder='태그를 입력하세요'
          />
        </View>

        {/* 게시판 거부 유무 */}
        <View style={styles.column}>
          <Text style={styles.postYesOrNo}>게시판 게재 유무</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.yesButton,
              postStatus === 'yes' && styles.activeYesButton,
            ]}
            onPress={() => setPostStatus('yes')}>
              <Text style={styles.buttonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.noButton,
              postStatus === 'no' && styles.activeNoButton,
            ]}
            onPress={() => setPostStatus('no')}>
              <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 재생 버튼 */}
        <TouchableOpacity style={styles.playButton} onPress={playStory}>
          <Text style={styles.buttonText}>재생</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10, // 텍스트와 버튼 간의 간격
  },
  column: {
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 70, // 고정된 너비로 정렬이 더 명확해짐
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    paddingVertical: 2,
    width: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
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
  postYesOrNo:{
    fontSize: 16,
    fontWeight: 'bold',
    width: 120,
    alignSelf: 'center',
  },
  content: {
    fontSize: 18,
    marginRight: 10, // 텍스트와 버튼 사이 간격 확보
  },
  smallButton: {
    backgroundColor: '#CCCCCC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
    marginTop: 10,
  },
  yesButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  noButton: {
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  activeYesButton: {
    backgroundColor: 'blue',
  },
  activeNoButton: {
    backgroundColor: 'red',
  },
  playButton: {
    backgroundColor: '#CCCCCC',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
    marginTop: 20,
  },
});

export default StoryCreateFinishScreen;
