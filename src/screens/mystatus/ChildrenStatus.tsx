import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { postRequest, getRequest, patchRequest, deleteRequest } from '../../api/apiManager';
import Icon from 'react-native-vector-icons/Ionicons';

const ChildrenStatus = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const [newChild, setNewChild] = useState({ name: '', koreanAge: '', englishAge: '' });
  const [editingChild, setEditingChild] = useState({ name: '', koreanAge: '', englishAge: '' });

  const fetchChildren = async () => {
    try {
      const data = await getRequest('/api/members/children');
      setChildren(data);
    } catch (error) {
      console.error('자녀 목록 가져오기 실패:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchChildren();
    }, [])
  );

  const addChild = async () => {
    if (!newChild.name || !newChild.koreanAge || !newChild.englishAge) {
      Alert.alert('입력 오류', '모든 필드를 채워주세요.');
      return;
    }
    try {
      await postRequest('/api/members/children', newChild);
      Alert.alert('성공', '자녀가 추가되었습니다.');
      setNewChild({ name: '', koreanAge: '', englishAge: '' });
      setIsAdding(false);
      await fetchChildren();
    } catch (error) {
      console.error('자녀 추가 실패:', error);
    }
  };

  const updateChild = async () => {
    if (!editingChild.name || !editingChild.koreanAge || !editingChild.englishAge) {
      Alert.alert('입력 오류', '모든 필드를 채워주세요.');
      return;
    }
    try {
      await patchRequest(`/api/members/children/${editingChildId}`, editingChild);
      Alert.alert('성공', '자녀 정보가 수정되었습니다.');
      setEditingChildId(null);
      await fetchChildren();
    } catch (error) {
      console.error('자녀 수정 실패:', error);
    }
  };

  const deleteChild = async (childId: string) => {
    try {
      await deleteRequest(`/api/members/children/${childId}`);
      Alert.alert('성공', '자녀 정보가 삭제되었습니다.');
      await fetchChildren();
    } catch (error) {
      console.error('자녀 삭제 실패:', error);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.childCard}>
      {editingChildId === item.id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            placeholder="자녀 이름"
            value={editingChild.name}
            onChangeText={(text) => setEditingChild({ ...editingChild, name: text })}
          />
          <View style={styles.ageInputsRow}>
            <TextInput
              style={[styles.input, styles.ageInput]}
              placeholder="한글 연령"
              value={editingChild.koreanAge}
              onChangeText={(text) => setEditingChild({ ...editingChild, koreanAge: text })}
            />
            <TextInput
              style={[styles.input, styles.ageInput]}
              placeholder="영어 연령"
              value={editingChild.englishAge}
              onChangeText={(text) => setEditingChild({ ...editingChild, englishAge: text })}
            />
          </View>
          <View style={styles.editButtonsRow}>
            <TouchableOpacity
              style={[styles.editButton, styles.confirmButton]}
              onPress={updateChild}
            >
              <Text style={styles.editButtonText}>수정 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editButton, styles.cancelButton]}
              onPress={() => setEditingChildId(null)}
            >
              <Text style={styles.editButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <Text style={styles.childName}>{item.name}</Text>
          <View style={styles.ageContainer}>
            <View style={styles.ageRow}>
              <Text style={styles.ageLabel}>한글 연령</Text>
              <Text style={styles.ageValue}>{item.koreanAge}</Text>
            </View>
            <View style={styles.ageRow}>
              <Text style={styles.ageLabel}>영어 연령</Text>
              <Text style={styles.ageValue}>{item.englishAge}</Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.editActionButton]}
              onPress={() => {
                setEditingChildId(item.id);
                setEditingChild({
                  name: item.name,
                  koreanAge: item.koreanAge,
                  englishAge: item.englishAge,
                });
              }}
            >
              <Text style={styles.actionButtonText}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteActionButton]}
              onPress={() => deleteChild(item.id)}
            >
              <Text style={styles.actionButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        </>
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
      />

      {isAdding && (
        <View style={styles.addContainer}>
          <View style={styles.addCard}>
            <TextInput
              style={styles.input}
              placeholder="자녀 이름"
              value={newChild.name}
              onChangeText={(text) => setNewChild({ ...newChild, name: text })}
            />
            <View style={styles.ageInputsRow}>
              <TextInput
                style={[styles.input, styles.ageInput]}
                placeholder="한글 연령"
                value={newChild.koreanAge}
                onChangeText={(text) => setNewChild({ ...newChild, koreanAge: text })}
              />
              <TextInput
                style={[styles.input, styles.ageInput]}
                placeholder="영어 연령"
                value={newChild.englishAge}
                onChangeText={(text) => setNewChild({ ...newChild, englishAge: text })}
              />
            </View>
            <View style={styles.editButtonsRow}>
              <TouchableOpacity
                style={[styles.editButton, styles.confirmButton]}
                onPress={addChild}
              >
                <Text style={styles.editButtonText}>추가 완료</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setIsAdding(false);
                  setNewChild({ name: '', koreanAge: '', englishAge: '' });
                }}
              >
                <Text style={styles.editButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAdding(true)}
      >
        <Icon name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  childCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  ageContainer: {
    marginBottom: 16,
  },
  ageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ageLabel: {
    fontSize: 14,
    color: '#666666',
  },
  ageValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  editActionButton: {
    backgroundColor: '#6B66FF',
  },
  deleteActionButton: {
    backgroundColor: '#FF4B4B',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  editContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: '#F8F9FF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
  },
  ageInputsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  ageInput: {
    flex: 1,
  },
  editButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#6B66FF',
  },
  cancelButton: {
    backgroundColor: '#FF4B4B',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
});

export default ChildrenStatus;

