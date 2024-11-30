// StorySummary.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const coverImage = require('../assets/images/cover2.png');
const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 40)/2;

type StorySummaryProps = {
  tag: string;
  title: string;
  author: string;
  likes: number;
  onPress: () => void;
};

const StorySummary: React.FC<StorySummaryProps> = ({ tag, title, author, likes, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.coverContainer}>
        <Image style={styles.cover} source={coverImage} />
        <View style={styles.likesContainer}>
          <Text style={styles.likeIcon}>❤️</Text>
          <Text style={styles.likes}>{likes.toLocaleString()}</Text>
        </View>
      </View>
      <Text style={styles.tag}>#{tag}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  coverContainer: {
    position: 'relative',
  },
  cover: {
    width: imageSize,
    height: imageSize,
    backgroundColor: '#ccc',
  },
  likesContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 3,
  },
  likeIcon: {
    color: 'red',
    marginRight: 4,
  },
  likes: {
    color: '#333',
    fontSize: 12,
  },
  tag: {
    fontSize: 12,
    color: '#333',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
});

export default StorySummary;
