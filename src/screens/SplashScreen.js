import React, { useEffect, useState } from "react";
import { Text,StyleSheet,View, Button,Dimensions,Platform } from "react-native";
import { Video,ResizeMode } from "expo-av";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SplashScreen = ({navigation}) => {

    const video = React.useRef(null);
    // const [status, setStatus] = useState({});
    useEffect(() => {
        video.current.playAsync()
        setTimeout(() => {
            navigation.navigate('Main')
        },4300)
    },[]);


    return(
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
            <Video
                ref={video}
                style={styles.background}
                source={require("../resources/splash.mp4")}
                resizeMode={ResizeMode.COVER}
                //onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            ) : (
                <Video
                ref={video}
                style={styles.video}
                source={require("../resources/splash.mp4")}
                resizeMode={ResizeMode.COVER}
                //onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
            )}
            {/* <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                    status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
            /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    },
    video: {
        flex: 1
    },
    background: {
       flex:1,
      
       height: hp('100%'),
       width: wp('100%'), 
    
    },
});

export default SplashScreen;