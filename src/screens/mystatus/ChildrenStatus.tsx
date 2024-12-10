import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { postRequest, getRequest, patchRequest, deleteRequest } from '../../api/apiManager';

const ChildrenStatus = () => {
  const [children, setChildren] = useState<any[]>([]); // 자녀 정보
  const [isAdding, setIsAdding] = useState(false); // 추가 중인지 여부
  const [editingChildId, setEditingChildId] = useState<string | null>(null); // 수정 중인 자녀 ID
  const [newChild, setNewChild] = useState({ name: '', koreanAge: '', englishAge: '' }); // 새 자녀 추가
  const [editingChild, setEditingChild] = useState({ name: '', koreanAge: '', englishAge: '' }); // 수정 중인 자녀 데이터

  // 서버에서 자녀 목록 가져오기
  const fetchChildren = async () => {
    try {
      const data = await getRequest('/api/members/children');
      setChildren(data); // 서버 데이터를 최신 상태로 설정
    } catch (error) {
      console.error('자녀 목록 가져오기 실패:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchChildren();
    }, [])
  );

  // 자녀 추가
  const addChild = async () => {
    if (!newChild.name || !newChild.koreanAge || !newChild.englishAge) {
      Alert.alert('입력 오류', '모든 필드를 채워주세요.');
      return;
    }
    try {
      const addedChild = await postRequest('/api/members/children', newChild);
      Alert.alert('성공', '자녀가 추가되었습니다.');
      setNewChild({ name: '', koreanAge: '', englishAge: '' });
      setIsAdding(false);
      await fetchChildren(); // 추가 후 최신 데이터 가져오기
    } catch (error) {
      console.error('자녀 추가 실패:', error);
    }
  };

  // 자녀 수정
  const updateChild = async () => {
    if (!editingChild.name || !editingChild.koreanAge || !editingChild.englishAge) {
      Alert.alert('입력 오류', '모든 필드를 채워주세요.');
      return;
    }
    try {
      await patchRequest(`/api/members/children/${editingChildId}`, editingChild);
      Alert.alert('성공', '자녀 정보가 수정되었습니다.');
      setEditingChildId(null);
      await fetchChildren(); // 수정 후 최신 데이터 가져오기
    } catch (error) {
      console.error('자녀 수정 실패:', error);
    }
  };

  // 자녀 삭제
  const deleteChild = async (childId: string) => {
    try {
      await deleteRequest(`/api/members/children/${childId}`);
      Alert.alert('성공', '자녀 정보가 삭제되었습니다.');
      await fetchChildren(); // 삭제 후 최신 데이터 가져오기
    } catch (error) {
      console.error('자녀 삭제 실패:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View>
      <View style={styles.childContainer}>
        <View style={styles.childDetails}>
          <Text style={styles.childText}>자녀 이름: {item.name}</Text>
          <Text style={styles.childText}>한글 연령: {item.koreanAge}</Text>
          <Text style={styles.childText}>영어 연령: {item.englishAge}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setEditingChildId(item.id);
              setEditingChild({ name: item.name, koreanAge: item.koreanAge, englishAge: item.englishAge });
            }}
          >
            <Text style={styles.buttonText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => deleteChild(item.id)}>
            <Text style={styles.buttonText}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
      {editingChildId === item.id && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="자녀 이름"
            value={editingChild.name}
            onChangeText={(text) => setEditingChild({ ...editingChild, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="한글 연령"
            value={editingChild.koreanAge}
            onChangeText={(text) => setEditingChild({ ...editingChild, koreanAge: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="영어 연령"
            value={editingChild.englishAge}
            onChangeText={(text) => setEditingChild({ ...editingChild, englishAge: text })}
          />
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity style={styles.addButton} onPress={updateChild}>
              <Text style={styles.addButtonText}>수정 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addButton, styles.cancelButton]}
              onPress={() => {
                setEditingChildId(null);
              }}
            >
              <Text style={styles.addButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={
          isAdding ? (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="자녀 이름"
                value={newChild.name}
                onChangeText={(text) => setNewChild({ ...newChild, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="한글 연령"
                value={newChild.koreanAge}
                onChangeText={(text) => setNewChild({ ...newChild, koreanAge: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="영어 연령"
                value={newChild.englishAge}
                onChangeText={(text) => setNewChild({ ...newChild, englishAge: text })}
              />
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity style={styles.addButton} onPress={addChild}>
                  <Text style={styles.addButtonText}>추가 완료</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, styles.cancelButton]}
                  onPress={() => {
                    setIsAdding(false);
                    setNewChild({ name: '', koreanAge: '', englishAge: '' });
                  }}
                >
                  <Text style={styles.addButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
              <Text style={styles.addButtonText}>자녀 추가</Text>
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  listContainer: {
    paddingVertical: 10,
  },
  childContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  childDetails: {
    flex: 1,
  },
  childText: {
    fontSize: 14,
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 12,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ChildrenStatus;