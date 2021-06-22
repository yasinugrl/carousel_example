import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    TouchableOpacity,
    Platform,
} from 'react-native';
const { width, height } = Dimensions.get('window');

const SPACING = 10;
const ITEM_SIZE = width * 0.7;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;

const DATA = [
    {
        title: 'Character 1',
        images: ['https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200',
            'https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200']
    },
    {
        title: 'Character 2',
        images: ['https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200',
            'https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200']
    },
    {
        title: 'Character 3',
        images: ['https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200',
            'https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200']
    },
    {
        title: 'Character 4',
        images: ['https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200']
    }
];

export default function Carousel() {
    const [characters, setCharacters] = useState([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const carouselRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0)


    useEffect(() => {
        const dt = DATA.map(item => {
            const min = 0;
            const max = item.images.length - 1;
            const rondomImageIndex = Math.floor(Math.random() * (max - min + 1)) + min;
            item.rondomImageIndex = rondomImageIndex
            return item
        })
        setCharacters([{ key: 'empty-left' }, ...dt, { key: 'empty-right' }]);
    }, []);

    const nextPrevButton = () => {
        return (
            <View style={{ width, height: 60, bottom: width / 2, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => {
                            if (currentIndex > 0) {
                                carouselRef.current.scrollToOffset({ animated: true, offset: ITEM_SIZE * (currentIndex - 1) });
                                setCurrentIndex(currentIndex - 1)
                            }
                    }}
                >
                    <Image
                        source={require('../assets/prev.png')}
                        resizeMode='contain'
                        style={{ width: 50, tintColor: currentIndex == 0 ? 'rgba(222, 222, 222, 0.3)' : 'white' }}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        if (currentIndex < characters.length - 3) {
                            console.log('currentIndex: ', currentIndex);
                            setCurrentIndex(currentIndex + 1)
                            carouselRef.current.scrollToOffset({ animated: true, offset: ITEM_SIZE * (currentIndex + 1) });
                        }
                    }}>
                    <Image
                        source={require('../assets/next.png')}
                        resizeMode='contain'
                        style={{ width: 50, tintColor: currentIndex == characters.length - 3 ? 'rgba(222, 222, 222, 0.3)' : 'white' }}

                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={carouselRef}
                showsHorizontalScrollIndicator={false}
                data={characters}
                scrollEnabled={false}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                bounces={false}
                decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
                renderToHardwareTextureAndroid
                snapToInterval={ITEM_SIZE}
                snapToAlignment='start'
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                renderItem={({ item, index }) => {
                    if (!item.images) {
                        return <View style={{ width: EMPTY_ITEM_SIZE }} />;
                    }
                    const inputRange = [
                        (index - 2) * ITEM_SIZE,
                        (index - 1) * ITEM_SIZE,
                        index * ITEM_SIZE,
                    ];

                    const translateY = scrollX.interpolate({
                        inputRange,
                        outputRange: [100, 50, 100],
                        extrapolate: 'clamp',
                    });

                    return (
                        <View style={{ width: ITEM_SIZE }}>
                            <Animated.View
                                style={{
                                    marginHorizontal: SPACING,
                                    padding: SPACING * 2,
                                    alignItems: 'center',
                                    transform: [{ translateY }],
                                    backgroundColor: 'white',
                                    borderRadius: 34,
                                }}
                            >
                                <Image
                                    source={{ uri: item.images[item.rondomImageIndex] }}
                                    style={styles.posterImage}
                                />
                                <Text style={{ fontSize: 16 }} numberOfLines={1}>
                                    {item.title}
                                </Text>
                            </Animated.View>
                        </View>
                    );
                }}
            />
            {nextPrevButton()}
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f75e5e',
        paddingTop: 50
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    posterImage: {
        width: '100%',
        height: ITEM_SIZE * 1.2,
        resizeMode: 'cover',
        borderRadius: 24,
        margin: 0,
        marginBottom: 10,
    },
});