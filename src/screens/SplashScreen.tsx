import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated } from 'react-native';

const SplashScreen = ({ navigation } : any) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => {
                navigation.replace('Start');
            }, 1000);
            
        });
    }, [fadeAnim, scaleAnim, navigation]);

    return (
    <View style={styles.container}>
        <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[
            styles.logo,
            {opacity: fadeAnim},
        ]}
        ></Animated.Image>
    </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // 필요 시 배경색을 변경하세요
    },
    logo: {
        width: 150,
        height: 180,
    },
});

export default SplashScreen;
