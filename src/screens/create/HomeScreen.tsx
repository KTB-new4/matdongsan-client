import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView, Image, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { postRequest } from '../../api/apiManager';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }: any) => {
  const [isKorean, setIsKorean] = useState(true);
  const [writePrompt, setWritePrompt] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(false);
  const togglePosition = useSharedValue(0);

  const storyPrompts = [
    { title: '공룡 박사인 아이에게 보여 주고 싶어요.', description: '공룡에 관한 내용 위주로 동화를 만들어드려요'},
    { title: '동생이 생겼을 때 어려 감정이 들 수 있음을 느끼게 해주고 싶어요.', description: '동생과의 활동이 포함된 동화를 만들어드려요'},
    { title: '아빠와 재미있게 읽을 수 있는 책을 고르고 싶어요.', description: '아빠와 같이 읽으면 재밌는 동화를 만들어드려요'},
    { title: '공격적인 행동을 되돌아보도록 계기를 만들어주고 싶어요.', description: '공룡에 관한 내용위주로 동화를 만들어드려요'},
  ];

  const toggleLanguage = () => {
    setIsKorean(!isKorean);
    togglePosition.value = isKorean ? 60 : 0;
  }

  const animatedCircleStyle = useAnimatedStyle(() => {
    return{
      transform: [{ translateX: withTiming(togglePosition.value, { duration : 300})}],
    };
  });

  const handleGenerate = async () => {
    if (!writePrompt.trim() || !selectedChild) {
      Alert.alert('오류', '모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);
    navigation.navigate('Loading', { response: null });

    try {
      const data = {
        language: isKorean ? 'ko' : 'en',
        age: parseInt(selectedChild),
        given: writePrompt,
      };

      const response = await postRequest('api/stories/1', data);
      console.log('API 응답 : ', response);
      navigation.replace('Loading', { response });
    } catch (error) {
      Alert.alert('오류', `동화 생성 실패: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.languageContainer}>
          <RNPickerSelect
            onValueChange={(value) => setSelectedChild(value)}
            items={[
              { label: '진아', value: '3' },
              { label: '진혁', value: '8' },
              { label: '은혁', value: '5' },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: '자녀 선택', value: '' }}
          />
          <View style={styles.toggleContainer}>
            <TouchableOpacity onPress={toggleLanguage} style={styles.toggleButton}>
              <Animated.View style={[styles.circle, animatedCircleStyle]} />
                <Text style={[styles.toggleText, isKorean ? styles.textRight : styles.textLeft]}>
                {isKorean ? '한국어' : 'English'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Image
          source={require('../../assets/images/profileimage.png')}
          style={styles.characterIcon}
        />
        <Text style={styles.title}>어떤 동화를{'\n'}만들어볼까요?</Text>
      </View>

      {/* Prompt Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="주제를 입력해주세요 :)"
          value={writePrompt}
          onChangeText={setWritePrompt}
          placeholderTextColor="#999"
          onSubmitEditing={handleGenerate}
          multiline
          returnKeyType="done"
          autoCapitalize='none'
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Enter') {
              handleGenerate(); // Enter를 누르면 handleGenerate 호출
              return false; // 줄바꿈 방지
            }
          }}
        />
        {/* <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
          <Text style={styles.generateButtonText}>생성</Text>
        </TouchableOpacity> */}
      </View>

      {/* Story Prompts */}
      <View style={styles.promptsContainer}>
        {storyPrompts.map((prompt, index) => (
          <View
            key={index}
            style={[styles.promptCard]}
          >
            <View style={styles.promptIconContainer}>
              <MaterialCommunityIcons name="google-downasaur" size = {32} color = "#9EA5FF"/>
            </View>
            <View style={styles.promptTextContainer}>
              <Text style={styles.promptDescription}>{prompt.description}</Text>
              <Text style={styles.promptTitle}>{prompt.title}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Help Button */}
      <TouchableOpacity style={styles.helpButton}>
        <Text style={styles.helpButtonText}>?</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    padding: 16,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F1FF',
    borderRadius: 20,
    padding: 4,
    marginLeft: 8,
  },
  toggleOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  toggleOptionActive: {
    backgroundColor: '#FFFFFF',
  },
  toggleOptionInactive: {
    backgroundColor: 'transparent',
  },
  toggleButton: {
    width: 100,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A3A8FE',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 4,
  },
  toggleText: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textLeft: {
    left: 15, // English일 때 텍스트가 왼쪽에 위치
  },
  textRight: {
    right: 20, // 한국어일 때 텍스트가 오른쪽에 위치
  },
  toggleTextActive: {
    color: '#333',
  },
  toggleTextInactive: {
    color: '#666',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  characterIcon: {
    width: 40,
    height: 40,
    marginRight: 20,
    marginLeft: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  generateButton: {
    backgroundColor: '#4A90E2',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promptsContainer: {
    padding: 16,
    paddingTop: 8,
  },
  promptCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  promptIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  promptEmoji: {
    fontSize: 20,
  },
  promptTextContainer: {
    flex: 1,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  promptDescription: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 4,
  },
  helpButton: {
    position: 'absolute',
    right: 16,
    bottom: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6B4EFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
    height: 45,
    alignItems: 'center'
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    color: '#333',
    paddingRight: 30,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
    height: 30,
  },
});

export default HomeScreen;
