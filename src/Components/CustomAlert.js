import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomAlert = ({ message, screenName, onClose }) => {
    const navigation = useNavigation();

    const handleOkPress = () => {
        if (screenName) {
            navigation.navigate(screenName);
        } else {
            onClose();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.alertBox}>
                <Text style={styles.message}>{message}</Text>
                <TouchableOpacity style={styles.okButton} onPress={handleOkPress}>
                    <Text style={styles.okButtonText}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        position: 'absolute',
        borderRadius: 10,
        top: '40%',
        left: '19%'
    },
    alertBox: {
        padding: 20,
        backgroundColor: 'lightgrey',
        borderRadius: 10,

        height: hp(20),
        width: wp(62),

        alignItems: 'center',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-evenly'
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    okButton: {
        width: '100%',
        padding: 10,
        backgroundColor: '#244082',
        borderRadius: 5,
        alignItems: 'center',
    },
    okButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomAlert;
