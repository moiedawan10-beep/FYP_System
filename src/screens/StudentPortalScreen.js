import React, { useState, useEffect, useLayoutEffect } from "react";
import { Button, StyleSheet, Text, Platform, Dimensions, View, TextInput, TouchableOpacity, SafeAreaView, Image, RefreshControl, ScrollView, ImageBackground } from "react-native";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { CommonActions, useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import { Directions } from "react-native-gesture-handler";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from "../Components/LoadingIndicator";

const StudentPortalScreen = ({ navigation }) => {

    const [data, setData] = useState({})
    const [chat, setChat] = useState("")
    const [dataLoaded, setLoading] = useState(false)
    const [advisor, setAdvisor] = useState(null)
    const [dropDown, setDropDown] = useState(false)


    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useLayoutEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "Students", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().email);
                setData(docSnap.data());
                setChat(docSnap.data().chatId)

            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getData()
        console.log(data.name)
    }, [dataLoaded])

    useEffect(() => {
        const getData = async () => {
            if (!data) {
                return
            }
            const docRef = doc(db, "Faculty", data.Advisor + '');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().email);
                setAdvisor(docSnap.data());
                setLoading(true)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getData()
        console.log(advisor?.name)
    }, [data])

    const nav = (value) => {
        switch (value) {
            case 1:
                navigation.navigate('CounsellingHours', {
                    id: data.Advisor
                })
                break;
            case 2:
                //request meeting
                navigation.navigate('RequestMeeting', {
                    id: data.Advisor
                })
                break;
            case 3:
                //reviews
                console.log(data.Group_Id);
                navigation.navigate('ViewReview', {
                    id: data.Group_Id
                })
                break;
            case 4:
                navigation.navigate('FormsScreen')
                break;
            case 5:
                navigation.navigate('GuidelineScreen')
                break;
        }
    }

    if (!dataLoaded) {
        return <LoadingIndicator />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={styles.header}>
                        <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.heading}>Student Portal</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                                <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                            </TouchableOpacity>
                        </View>

                        <View >
                            {dropDown && (
                                <View style={styles.popup}>
                                    <ImageBackground source={require('../resources/bg1.jpg')} style={styles.WebbackgroundPopup}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>{data.name}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Advisor: {advisor.name}</Text>

                                        </View>
                                        <View style={{ margin: 10, paddingBottom: 20 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('ResetPassword');
                                                }}
                                            >
                                                <Text style={styles.dropText}>Change Password</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.dispatch(
                                                        CommonActions.reset({
                                                            index: 0,
                                                            routes: [{ name: 'Main' }]
                                                        })
                                                    )
                                                }}
                                            >
                                                <Text style={styles.dropText}>Sign Out</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>
                                </View>
                            )}
                        </View>

                        {/* <View style={{ flex: 3.5, justifyContent: 'center' }}>
                    <SelectDropdown
                        data={dropdown}
                        defaultButtonText="Advisor Portal"
                        style={styles.dropdown}
                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={{ fontSize: 13 }}
                        dropdownIconPosition="right"
                        rowTextStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdownRow}
                        onSelect={(selectedItem, index) => {
                            func(selectedItem)
                        }}
                    ></SelectDropdown>
                </View> */}


                    </View>
                    <View style={{ flex: 9, paddingTop: 15, zIndex: 0, justifyContent: 'center' }}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={!dataLoaded} onRefresh={() => { setLoading(false) }} />
                            }>

                            <View style={{}}>
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                View Advisor's Availability
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(2)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                Request Meeting
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                Preview Group
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                FYP Templates
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(5)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Guidelines
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ScrollView>
                    </View >
                    <View style={{ justifyContent: 'flex-end', position: 'relative', backgroundColor: 'black' }}>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('id' + chat)
                                navigation.navigate('ChatScreenStd', {
                                    stdData: data,
                                });
                            }}
                        >
                            <Image source={require('../resources/chat.jpg')} style={styles.chat} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={styles.header}>
                        <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.heading}>Student Portal</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                                <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                            </TouchableOpacity>
                        </View>

                        <View >
                            {dropDown && (
                                <View style={styles.popup}>
                                    <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>{data.name}</Text>
                                            <Text style={{ fontSize: 16, fontWeight: '600', textAlign: 'center' }}>Advisor: {advisor.name}</Text>

                                        </View>
                                        <View style={{ margin: 10, paddingBottom: 20 }}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('ResetPassword');
                                                }}
                                            >
                                                <Text style={styles.dropText}>Change Password</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.dispatch(
                                                        CommonActions.reset({
                                                            index: 0,
                                                            routes: [{ name: 'Main' }]
                                                        })
                                                    )
                                                }}
                                            >
                                                <Text style={styles.dropText}>Sign Out</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>
                                </View>
                            )}
                        </View>

                        {/* <View style={{ flex: 3.5, justifyContent: 'center' }}>
                    <SelectDropdown
                        data={dropdown}
                        defaultButtonText="Advisor Portal"
                        style={styles.dropdown}
                        buttonStyle={styles.dropdownBtnStyle}
                        buttonTextStyle={{ fontSize: 13 }}
                        dropdownIconPosition="right"
                        rowTextStyle={styles.dropdownText}
                        dropdownStyle={styles.dropdown1DropdownStyle}
                        rowStyle={styles.dropdownRow}
                        onSelect={(selectedItem, index) => {
                            func(selectedItem)
                        }}
                    ></SelectDropdown>
                </View> */}


                    </View>
                    <View style={{ flex: 9, paddingTop: 15, zIndex: 0, justifyContent: 'center' }}>
                        <ScrollView
                            refreshControl={
                                <RefreshControl refreshing={!dataLoaded} onRefresh={() => { setLoading(false) }} />
                            }>

                            <View style={{}}>
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                View Advisor's Availability
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(2)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                Request Meeting
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                Preview Group
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                FYP Templates
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(5)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Guidelines
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            </View>

                        </ScrollView>
                    </View >
                    <View style={{ justifyContent: 'flex-end', position: 'relative', backgroundColor: 'black' }}>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('id' + chat)
                                navigation.navigate('ChatScreenStd', {
                                    stdData: data,
                                });
                            }}
                        >
                            <Image source={require('../resources/chat.jpg')} style={styles.chat} />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            )}
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
        zIndex: 1
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,
        marginLeft: 15
    },
    subHeading: {
        fontSize: 10,
        textAlign: "center",
        marginVertical: 7
    },
    prop: {
        backgroundColor: 'red',
    },
    div: {
        margin: 5,
        borderRadius: 5,
        zIndex: 0
    },
    Webdiv: {
        margin: 5,
        borderRadius: 5,
        width: wp(50),
        alignSelf: 'center'
    },
    Webdrop: {
        height: hp(25),
        width: wp(25),
        marginRight: 10,
    },
    WebbackgroundPopup: {
        height: hp(25),
        width: wp(25),
        right: 0,
        position: 'absolute'
    },
    profilePic: {
        borderWidth: 1,
        height: 65,
        width: 65,
        margin: 10,
        borderRadius: 5000,
    },
    dropdown: {
        backgroundColor: 'black',
    },
    dropdownBtnStyle: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderColor: '#444',
        alignSelf: 'center',
        width: 120,
        backgroundColor: 'lightgrey'
    },
    dropdownText: {
        fontSize: 14
    },
    dropdown1DropdownStyle: {
        backgroundColor: '#EFEFEF'
    },
    chat: {
        height: 60,
        width: 60,
        position: 'absolute',
        bottom: 15,
        right: 15,
        borderRadius: 150,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: 'white',
        padding: 30
    },
    menuContainer: {
        margin: 7,
        paddingRight: 2,
        padding: 10,
        borderRadius: 240,
        backgroundColor: '#396eb0',
        opacity: 0.9
    },
    menuSub: {
        fontSize: 25,
        padding: 5,
        color: 'white',
        paddingLeft: 5,
        textAlign: 'center'
    },
    notification: {
        fontSize: 10,
        textAlign: 'center',
    },
    notificationBorder: {
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 100,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    containerImage: {
        alignSelf: 'center',
        flex: 2,
    },
    image: {
        height: 50,
        width: 50,
        marginHorizontal: 5,
        paddingHorizontal: 5,
    },
    background: {
        height: hp(100),
        width: wp(100),
        //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    Webbutton: {
        padding: 10,
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
        width: wp(20),
    },
    drop: {
        height: 25,
        width: 25,
        marginRight: 10
    },
    popup: {
        position: 'absolute',
        //height: '400%',
        width: 'auto',
        //opacity: 0.9,

        right: 0,
        top: '100%',
        alignItems: 'center',
        maxHeight: '700%',
    },
    dropText: {
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        fontSize: 17,
        margin: 3,
        textAlign: 'left'
    },
    backgroundPopup: {
        flex: 1,
        resizeMode: 'stretch', // or 'stretch' or 'contain',
        right: 0,
        position: 'absolute'
    }

})

export default StudentPortalScreen;