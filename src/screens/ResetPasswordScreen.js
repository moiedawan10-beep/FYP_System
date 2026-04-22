// ResetPasswordScreen.js
import React, { useState } from 'react';
import { View,Dimensions,Platform, TextInput, Alert, StyleSheet, TouchableOpacity, Text, Image, ImageBackground, SafeAreaView } from 'react-native';
import { sendPasswordResetEmail, FirebaseError, Auth } from 'firebase/auth';
import { auth } from '../../FirebaseConfig'; // Adjust the import path as needed

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CustomAlert from '../Components/CustomAlert';

const ResetPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')

    const handleResetPassword = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            // Password reset email sent successfully
            setError("Password Reset", "Password reset email sent successfully. Please check your email.");
            setShowAlert(true);
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                // Handle user not found error
                setError("Password Reset Error", "No user found with this email address. Please check your email address.");
                setShowAlert(true);
            } else {
                // Handle other errors
                console.error(error);
                setError("Password Reset Error", "An error occurred while sending the password reset email. Please try again later.");
                setShowAlert(true);
            }
        }
    };

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {showAlert && (
                <CustomAlert
                    message={error}
                    //screenName="Main"
                    onClose={handleCloseAlert} // No screenName means it will just close
                />
            )}
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' ,borderBottomWidth:1}}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Reset Password</Text>
                    </View>
                </View>
                <View style={{ flex: 1 }}></View>

                <View style={styles.Webbox}>


                    <TextInput
                        style={styles.Webinput}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={handleResetPassword} style={styles.Webloginbutton}>
                        <Text style={{textAlign:'center'}}>Reset Password</Text>
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.note}>Note: Email must be registered</Text>
                    </View>
                </View>
                <View style={{ flex: 2, }}></View>

            </ImageBackground>
            ) : (
<ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' ,borderBottomWidth:1}}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Reset Password</Text>
                    </View>
                </View>
                <View style={{ flex: 2, backgroundColor: 'lightgrey' }}></View>

                <View style={styles.box}>


                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={handleResetPassword} style={styles.loginbutton}>
                        <Text>Reset Password</Text>
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.note}>Note: Email must be registered</Text>
                    </View>
                </View>
                <View style={{ flex: 2, backgroundColor: 'lightgrey' }}></View>

            </ImageBackground>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    Webinput: {
        borderWidth: 1,
        alignSelf: 'center',
        width: wp(40),
        height: hp(5),
        paddingHorizontal: 5,
        margin: 5
    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    Webloginbutton: {
        padding: 10,
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
        width: wp(20),
    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
  
    box: {
        backgroundColor: 'lightgrey',
        padding: 25,
        paddingVertical: 150,
    },
    Webbox: {
        borderRadius: 10,
        flex:10,
        //backgroundColor: 'white',
        //height:hp(70),
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 50% transparent black
        alignSelf: 'center',
        padding: 40,
        paddingVertical: 40,

    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 8,
        width: '100%',
    },
    button: {
        borderWidth: 1,
        justifyContent: 'center',
        marginTop: 15
    },
    textButton: {
        padding: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    note: {
        alignSelf: 'flex-end',
        color: 'black',
        margin: 10,
        fontSize: 11,
        color: '#244082',
        fontWeight: 'bold'
    }
});

export default ResetPasswordScreen;
