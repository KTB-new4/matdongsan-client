import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Button, Alert } from 'react-native';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import { postRequest } from '../../api/apiManager';

const HomeScreen = ({navigation } : any) => {
  const [isKorean, setIsKorean] = useState(true);  // 한글/English 토글 상태
  const [selectedChild, setSelectedChild] = useState('');  // 드롭다운 선택된 자녀
  const [writePrompt, setwritePrompt] = useState(''); // 입력 프롬프트
  const [loading, setLoading] = useState(false);

  // 한글/English 토글 스위치 상태 변경
  const toggleLanguage = () => {
    setIsKorean(!isKorean);
  };

  const handleGenerate = async() => {
    if(!writePrompt.trim() || !selectedChild){
      Alert.alert('오류', '모든 필드를 채워주세요.');
      return;
    }

    setLoading(true);
    try{
      const data = {
        language: isKorean ? 'ko' : 'en',
        age: parseInt(selectedChild),
        given: writePrompt,
      };

      const response = await postRequest('/api/stories', data);
      console.log('API 응답: ', response);

      navigation.navigate('Loading', {
        response,
        onComplete: () => navigation.replace('StoryCreateFinish', { story : response}),
      });
    }
    catch(error){
      Alert.alert('오류', `동화 생성 실패: ${error}`);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.row}>
          {/* 한글/English 토글 스위치 */}
          <TouchableOpacity style={styles.switchContainer} onPress={toggleLanguage}>
            <View
              style={[
                styles.switch,
                isKorean ? styles.switchOn : styles.switchOff,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  isKorean ? styles.textOn : styles.textOff,
                ]}
              >
                {isKorean ? '한글' : 'English'}
              </Text>
              <View
                style={[
                  styles.circle,
                  isKorean ? styles.circleOn : styles.circleOff,
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* 자녀 선택 드롭다운 */}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSelectedChild(value)}
              items={[
                { label: 'Child 1', value: '1' },
                { label: 'Child 2', value: '2' },
                { label: 'Child 3', value: '3' },
              ]}
              style={{
                inputAndroid: styles.pickerText,
                inputIOS: styles.pickerText,
              }}
              placeholder={{ label: 'Select Child', value: '' }}
            />
          </View>
        </View>

        {/* 선택된 자녀와 언어에 따른 내용 표시 */}
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={writePrompt}
            onChangeText={setwritePrompt}
            placeholder="AI에게 보낼 프롬프트를 입력하세요"
          ></TextInput>
          <TouchableOpacity onPress={handleGenerate} style={styles.createbutton}>
            <Text>동화 생성</Text>
          </TouchableOpacity>
          <Text style={styles.statusText}>
            {isKorean
              ? '현재 선택된 언어: 한글'
              : 'Current Language: English'}
          </Text>
          {selectedChild ? (
            <Text style={styles.statusText}>
              선택된 자녀: {selectedChild}
            </Text>
          ) : (
            <Text style={styles.statusText}>자녀를 선택하세요.</Text>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row', // 한 줄로 배치
    alignItems: 'center', // 세로축에서 중앙 정렬
    marginTop: 20,
    marginLeft: 20,
  },
  switchContainer: {
    width: 100,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    marginRight: 20, // 요소 간의 간격 설정
  },
  switch: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  switchOn: {
    backgroundColor: '#4cd137', // 활성 상태일 때 색상
  },
  switchOff: {
    backgroundColor: '#dfe6e9', // 비활성 상태일 때 색상
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 25,
    backgroundColor: 'white',
    position: 'absolute',
  },
  circleOn: {
    left: 5, // 활성 상태일 때 왼쪽 끝에 원이 위치
  },
  circleOff: {
    right: 5, // 비활성 상태일 때 오른쪽 끝에 원이 위치
  },
  text: {
    fontSize: 15,
    position: 'absolute',
  },
  textOn: {
    right: 10, // 활성 상태일 때 텍스트 위치
    color: 'white',
  },
  textOff: {
    left: 10, // 비활성 상태일 때 텍스트 위치
    color: '#2d3436',
  },
  pickerContainer: {
    width: 100,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    justifyContent: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: '#2d3436',
    paddingHorizontal: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  statusText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  createbutton:{
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 10,
    width: '50%',
    alignItems: 'center',
    marginBottom: 20,
  }
});

export default HomeScreen;
