import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

const dummyChildData = [
  { id: '1', name: '자녀 이름 1', ageKor: '한글 연령', ageEng: '영어 연령' },
  { id: '2', name: '자녀 이름 2', ageKor: '한글 연령', ageEng: '영어 연령' },
  { id: '3', name: '자녀 이름 3', ageKor: '한글 연령', ageEng: '영어 연령' },
  { id: '4', name: '자녀 이름 4', ageKor: '한글 연령', ageEng: '영어 연령' },
];

const ChildrenStatus = () => {
  const renderItem = ({ item }: { item: typeof dummyChildData[0] }) => (
    <View style={styles.childContainer}>
      <Text style={styles.childInfo}>{item.id}</Text>
      <View style={styles.childDetails}>
        <Text style={styles.childText}>자녀 이름: {item.name}</Text>
        <Text style={styles.childText}>한글 연령: {item.ageKor}</Text>
        <Text style={styles.childText}>영어 연령: {item.ageEng}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={dummyChildData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
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
  childInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
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
});

export default ChildrenStatus;
