import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Dimensions, Platform, Text, View, TextInput, TouchableOpacity, RefreshControl, ScrollView, ImageBackground, Image } from "react-native";
import { collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import CustomAlert from '../Components/CustomAlert';


import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import { Directions } from "react-native-gesture-handler";
import { CommonActions, useRoute } from "@react-navigation/native";


const MainScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginType, setLoginType] = useState("");
    const [error, setError] = useState("")
    const [stdData, setStdData] = useState([])
    const [facultyData, setFacultyData] = useState([])
    const [groupId, setGroupId] = useState([])

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getStdData = async () => {
            const querySnapshot = await getDocs(collection(db, "Students"));
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
            });
            setStdData(temp);
        }

        const getFacData = async () => {
            const querySnapshot = await getDocs(collection(db, "Faculty"));
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data().email)
            });
            setFacultyData(temp)

        }

        getStdData()
        getFacData()
    }, [email])

    const loginStd = async () => {
        for (var i = 0; i < stdData.length; i++) {
            if (stdData[i].email == email) {
                try {
                    await signInWithEmailAndPassword(auth, email, password).then(() => {
                        console.log(stdData[i])
                        if (stdData[i].Advisor == null || stdData[i].Advisor === "") {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'StdInitial' }]
                                })
                            )
                        } else {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'StdPortal' }]
                                })
                            )
                        }
                    })
                } catch (error) {
                    errorMsg(error.message)
                }
                break;
            }
        }
        setTimeout(() => {
            if (error == '') {
                setError('Email not Valid')
            }
        }, 2000);
    }

    const errorMsg = (e) => {
        console.log(e)

        switch (e) {
            case 'Firebase: Error (auth/invalid-credential).':
                setError('The Password is not valid.');
                break;
            case 'Firebase: Error (auth/missing-password).':
                setError('Please Enter Password.');
                break;
            case 'auth/user-not-found':
                setError('No user record corresponding to this email.');
                break;
            case 'auth/wrong-password':
                setError('The password is invalid.');
                break;
            default:
                setError('An unknown error occurred:', error.message);
        }
    }

    const loginFac = () => {
        for (var i = 0; i < facultyData.length; i++) {
            console.log("1" + facultyData[i])
            if (facultyData[i] == email) {
                signInWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        navigation.navigate('AdvisorPortal')
                    })
                    .catch((error) => {
                        errorMsg(error.message)
                    })

                console.log("Portal")
            }
        }
        setTimeout(() => {
            if (error != '') {
                setError('Email not Valid')
            }
        }, 2000);
    }

    const login = () => {
        setError('')
        if (email == "admin" && password == "admin123") {
            navigation.navigate('AdminScreen')
        }
        else if (loginType == "") {
            setError("Please Select a Login Type")
        }
        else if (loginType == "Student") {
            loginStd()
        }
        else if (loginType == "Faculty") {
            loginFac()
        }

    }

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={styles.WebborderBox}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../resources/logo.png')} style={styles.Webimage} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 40 }}>Welcome Back</Text>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>Sign In</Text>
                        <TextInput
                            onChangeText={data => setEmail(data)}
                            style={styles.Webinput}
                            placeholder="Email"
                            autoCapitalize="none"
                        />
                        <TextInput
                            onChangeText={data => setPassword(data)}
                            style={styles.Webinput}
                            placeholder="Password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />

                        <View style={{ width: "45%", justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.forget} onPress={() => navigation.navigate('ResetPassword')}>
                                <Text style={styles.WebforgetText}>Forget Password?</Text>
                            </TouchableOpacity>
                        </View>


                        <RadioButtonGroup
                            containerStyle={{ marginLeft: 15, marginBottom: 10, flexDirection: "row" }}
                            selected={loginType}
                            onSelected={(value) => setLoginType(value)}
                            onChangeText={console.log(loginType)}
                            radioBackground="green"

                        >
                            <RadioButtonItem value="Student" label="Student" style={{ marginLeft: 5 }} />
                            <RadioButtonItem
                                value="Faculty"
                                label={
                                    <Text>Faculty</Text>
                                }
                                style={{ marginLeft: 10 }}
                            />
                        </RadioButtonGroup>

                        {error && (
                            <Text style={styles.error}>{error}</Text>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                            <View style={{ width: "55%" }}>
                                <TouchableOpacity style={styles.Webloginbutton} onPress={() => login()}>
                                    <Text style={{textAlign:'center'}}>Log in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: "45%", justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Register', {
                                type: "Student"
                            })}>
                                <Text style={styles.WebsignupText}>Don't have Account?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={styles.borderBox}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require('../resources/logo.png')} style={styles.image} />
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 40 }}>Welcome Back</Text>
                        <Text style={{ textAlign: 'center', fontSize: 30 }}>Sign In</Text>
                        <TextInput
                            onChangeText={data => setEmail(data)}
                            style={styles.input}
                            placeholder="Email"
                            autoCapitalize="none"
                        />
                        <TextInput
                            onChangeText={data => setPassword(data)}
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />

                        <View style={{ width: "45%", justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.forget} onPress={() => navigation.navigate('ResetPassword')}>
                                <Text style={styles.forgetText}>Forget Password?</Text>
                            </TouchableOpacity>
                        </View>


                        <RadioButtonGroup
                            containerStyle={{ marginLeft: 15, marginBottom: 10, flexDirection: "row" }}
                            selected={loginType}
                            onSelected={(value) => setLoginType(value)}
                            onChangeText={console.log(loginType)}
                            radioBackground="green"

                        >
                            <RadioButtonItem value="Student" label="Student" style={{ marginLeft: 5 }} />
                            <RadioButtonItem
                                value="Faculty"
                                label={
                                    <Text>Faculty</Text>
                                }
                                style={{ marginLeft: 10 }}
                            />
                        </RadioButtonGroup>

                        {error && (
                            <Text style={styles.error}>{error}</Text>
                        )}

                        <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                            <View style={{ width: "55%" }}>
                                <TouchableOpacity style={styles.loginbutton} onPress={() => login()}>
                                    <Text >Log in</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: "45%", justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('Register', {
                                type: "Student"
                            })}>
                                <Text style={styles.signupText}>Don't have Account?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

    },
    signupText: {
        fontSize: 14,
        marginHorizontal: 25,
        color: '#244082',
        width: '100%',
        marginBottom: 15
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        margin: 3
    },
    Webimage: {
        width: wp(20),
        height: hp(20),
        resizeMode: 'contain',
        margin: 3
    },
    input: {
        borderWidth: 1,
        padding: 10,
        margin: 15,
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
    WebsignupText: {
        fontSize: 14,
        marginHorizontal: 25,
        color: '#244082',
        paddingBottom: 15,
        alignSelf: 'flex-start',
        textAlign: 'center',
    },
    signUp: {
        borderRadius: 10,
        padding: 5,
        margin: 15,
        borderWidth: 2,
        alignItems: 'center',
    },
    signupText2: {
        color: 'red'
    },
    error: {
        color: 'red',
        marginLeft: 25
    },
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    borderBox: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        backgroundColor: 'white', // Background color

    },
    WebborderBox: {
        borderRadius: 10,
        //backgroundColor: 'white',
        //height:hp(70),
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 50% transparent black
        alignSelf: 'center',
        padding: 10,
        paddingVertical: 40,

    },
    forget: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    forgetText: {
        color: 'grey',
        fontSize: 10
    },
    WebforgetText: {
        color: 'grey',
        fontSize: 15,
        paddingTop:5,
        fontSize:'bold'
    },
})

export default MainScreen;