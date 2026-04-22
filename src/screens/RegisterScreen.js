import React, { useState, useEffect } from "react";
import { Button,Dimensions,Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, Image, ImageBackground, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import RadioButtonGroup from "expo-radio-button";

import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import { Directions } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";

const {height,width}= Dimensions.get('window');
import CustomAlert from '../Components/CustomAlert';


const RegisterScreen = ({ navigation }) => {
    const route = useRoute();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("")
    const [name, setName] = useState("");
    let loginType = route.params?.type
    const [error, setError] = useState("")
    const [advisor, setAdvisor] = useState("")
    const [currentProjects, setCurrentProjects] = useState([])
    const chats = []
    const [inProgress, setProgress] = useState(false)
    const [enrolled, setEnrolled] = useState(null)
    const [check, setCheck] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "Enrolled", 'one');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setEnrolled(docSnap.data());
            } else {
                console.log("No such document!");
            }
        }
        getData();
        console.log(enrolled)
    }, [loginType])

    const errorMsg = (e) => {
        console.log(e)

        switch (e) {
            case 'auth/weak-password':
                setError('Weak Password');
                setProgress(false)
                break;
            case 'Firebase: Error (auth/missing-password).':
                setError('Please Enter Password.');
                setProgress(false)
                break;
            case 'auth/user-not-found':
                setError('No user record corresponding to this email.');
                setProgress(false)
                break;
            case 'auth/email-already-in-use':
                setError('Email already in use.');
                setProgress(false)
                break;
            default:
                setError('An unknown error occurred:', error.message);
                setProgress(false)
        }
    }

    const register = async () => {
        setProgress(true)
        if (email == "" || password == "" || name == "") {
            setError('Please Enter All Fields')
            setProgress(false)
        } else {
            if (password == confirmPass) {
                if (loginType == "Student") {
                    if(check){
                        if (email.endsWith('@umt.edu.pk')) {
                            createUserWithEmailAndPassword(auth, email, password)
                                .then((user) => {
                                    dataEntryStd()
                                })
                                .catch(error => {
                                    errorMsg(error.code)
                                })
                        }
                        else {
                            setError('Email should end with @umt.edu.pk')
                            setProgress(false)
                        }
                    }
                    else{
                        setError('Email not Enrolled, Contact Administration')
                        setProgress(false)
                    }
                } else if (loginType == "Faculty") {
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((user) => {
                            dataEntryFaculty()
                        })
                        .catch(error => {
                            errorMsg(error.code)
                        })
                } else {
                    setError("Please Select a Register Type")
                    setProgress(false)
                }
            } else {
                setError("Passwords don't match")
                setProgress(false)
            }
        }
    }

    const reset = () => {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPass('')
    }

    const dataEntryStd = async () => {
        await setDoc(doc(db, "Students", auth.currentUser.uid), {
            name,
            email,
            StudentId: auth.currentUser.uid,
            Group_Id: null,
            Advisor: null,
            chatId: Math.round(300000 + Math.random() * (500000 - 300000))
        });
        setError("User Added")
        setProgress(false)
        reset()
    }

    const dataEntryFaculty = async () => {
        await setDoc(doc(db, "Faculty", auth.currentUser.uid), {
            name,
            email,
            //FacultyId: Math.round(200000 + Math.random() * (300000 - 200000)),
            facultyID: auth.currentUser.uid,
            project_counter: 5,
            interest_area_1: "",
            interest_area_2: "",
            interest_area_3: "",
            pictureUrl: "https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/ProfilePictures%2Fdefault-icon.jpg?alt=media&token=2af314cf-f8f4-4706-bafa-ecc9b9b4e654",
            currentProjects,
            chats
        });
        setProgress(false)
        setError("User Added")
        reset()
    }

    const emailCheck = (n) => {
        setEmail(n);
        let found = false;
        for (let i = 0; i < enrolled.emails.length; i++) {
            // console.log(enrolled.emails[i])
            if (enrolled.emails[i] === n) {
                found = true;
                break;
            }
        }
        setCheck(found);
        console.log(check)
    }

    return (
        <View centerContent={true} automaticallyAdjustKeyboardInsets={true} style={styles.container}>
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={styles.WebborderBox}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../resources/logo.png')} style={styles.Webimage} />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 40 }}>Welcome</Text>
                    <Text style={{ textAlign: 'center', fontSize: 30 }}>Sign up</Text>
                    <TextInput
                        value={name}
                        onChangeText={data => setName(data)}
                        style={styles.Webinput}
                        placeholder="Name"
                    />
                    <TextInput
                        value={email}
                        onChangeText={data => emailCheck(data)}
                        style={styles.Webinput}
                        placeholder="Email"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={password}
                        onChangeText={data => setPassword(data)}
                        style={styles.Webinput}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={confirmPass}
                        onChangeText={data => setConfirmPass(data)}
                        style={styles.Webinput}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />


                    {/* <RadioButtonGroup
                containerStyle={{ marginLeft: 15, marginBottom: 10, flexDirection: "row" }}
                selected={loginType}
                onSelected={(value) => setLoginType(value)}
                //onChangeText={console.log(loginType)}
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
            </RadioButtonGroup> */}

                    {error && (
                        <Text style={styles.error}>{error}</Text>
                    )}

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{ width: "55%", justifyContent: 'center', alignSelf: 'center'}}>
                            <TouchableOpacity style={styles.Webloginbutton} onPress={() => register()}>
                                <Text style={{textAlign:'center'}}>Register</Text>
                            </TouchableOpacity>
                        </View>
                        {inProgress && (
                            <ActivityIndicator size="small" color="grey" />
                        )}
                    </View>
                    <View style={{ justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Main') }}>
                            <Text style={styles.WebsignupText}>Already have an account?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View flexDirection="row" style={{justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.loginbutton} onPress={() => login()}>
                        <Text>Log in</Text>
                    </TouchableOpacity>                
            </View> */}
                </View>
                {/* <TouchableOpacity onPress={()=>{console.log(check);}}><Text>sss</Text></TouchableOpacity> */}
            </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={styles.borderBox}>
                    <View style={{ alignItems: 'center' }}>
                        <Image source={require('../resources/logo.png')} style={styles.image} />
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 40 }}>Welcome</Text>
                    <Text style={{ textAlign: 'center', fontSize: 30 }}>Sign up</Text>
                    <TextInput
                        value={name}
                        onChangeText={data => setName(data)}
                        style={styles.input}
                        placeholder="Name"
                    />
                    <TextInput
                        value={email}
                        onChangeText={data => emailCheck(data)}
                        style={styles.input}
                        placeholder="Email"
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={password}
                        onChangeText={data => setPassword(data)}
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />
                    <TextInput
                        value={confirmPass}
                        onChangeText={data => setConfirmPass(data)}
                        style={styles.input}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        autoCapitalize="none"
                    />


                    {/* <RadioButtonGroup
                containerStyle={{ marginLeft: 15, marginBottom: 10, flexDirection: "row" }}
                selected={loginType}
                onSelected={(value) => setLoginType(value)}
                //onChangeText={console.log(loginType)}
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
            </RadioButtonGroup> */}

                    {error && (
                        <Text style={styles.error}>{error}</Text>
                    )}

                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <View style={{ width: "55%", justifyContent: 'center', alignSelf: 'center'}}>
                            <TouchableOpacity style={styles.loginbutton} onPress={() => register()}>
                                <Text>Register</Text>
                            </TouchableOpacity>
                        </View>
                        {inProgress && (
                            <ActivityIndicator size="small" color="grey" />
                        )}
                    </View>
                    <View style={{ justifyContent: 'center', }}>
                        <TouchableOpacity onPress={() => { navigation.navigate('Main') }}>
                            <Text style={styles.signupText}>Already have an account?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* <View flexDirection="row" style={{justifyContent: 'center'}}>
                    <TouchableOpacity style={styles.loginbutton} onPress={() => login()}>
                        <Text>Log in</Text>
                    </TouchableOpacity>                
            </View> */}
                </View>
                {/* <TouchableOpacity onPress={()=>{console.log(check);}}><Text>sss</Text></TouchableOpacity> */}
            </ImageBackground>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        alignSelf:'center',
        width: wp(40),
        height: hp(5),
        paddingHorizontal: 5,
        margin:5
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
    signUp: {
        borderRadius: 10,
        padding: 5,
        margin: 15,
        borderWidth: 2,
        alignItems: 'center',
    },
    signupText: {
        fontSize: 14,
        marginHorizontal: 25,
        color: '#244082',
        paddingBottom: 15 
    },
    WebsignupText: {
        fontSize: 14,
        marginHorizontal: 25,
        color: '#244082',
        paddingBottom: 15,
        alignSelf:'center',
        textAlign:'center',
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
       // backgroundColor: 'white',
       backgroundColor: 'rgba(255, 255, 255, 0.8)', 
       //height:hp(70),
        alignSelf:'center',
        padding:10,
        paddingVertical:40,

    },
    forget: {
        marginHorizontal: 20,
        marginBottom: 10,
    },
    forgetText: {
        color: 'grey',
        fontSize: 10
    },
})

export default RegisterScreen;