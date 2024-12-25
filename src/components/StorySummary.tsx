import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const imageSize = (screenWidth - 40) / 2;

type StorySummaryProps = {
  tag: string;
  title: string;
  author: string;
  likes: number;
  onPress: () => void;
  coverUrl: string;
};

const StorySummary: React.FC<StorySummaryProps> = ({ tag, title, author, likes, onPress, coverUrl }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.cardContainer}>
        <View style={styles.coverContainer}>
          <Image style={styles.cover} source={{ uri: coverUrl }} />
          <View style={styles.likesContainer}>
            <Text style={styles.likeIcon}>♥</Text>
            <Text style={styles.likes}>{likes >= 1000 ? `${(likes/1000).toFixed(1)}k` : likes}</Text>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.tagContainer}>
            <Text style={styles.tagPrefix}></Text>
            <Text style={styles.tag}>{tag}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginHorizontal: 5,
    width: imageSize,
  },
  cardContainer: {
    width: imageSize,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  coverContainer: {
    position: 'relative',
    width: imageSize,
    height: imageSize,
  },
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  likesContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likeIcon: {
    color: '#ff3b30',
    fontSize: 16,
    marginRight: 4,
  },
  likes: {
    color: '#0066ff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagPrefix: {
    color: '#666',
    fontSize: 12,
    marginRight: 1,
  },
  tag: {
    color: '#666',
    fontSize: 12,
  },
});

export default StorySummary;

