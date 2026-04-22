import React, { useState, useEffect, useLayoutEffect } from "react";
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Platform, SafeAreaView, Image, Alert, Linking, RefreshControl, ImageBackground } from "react-native";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as Animatable from "react-native-animatable"



import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import { Directions, ScrollView } from "react-native-gesture-handler";

import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from "../Components/LoadingIndicator";
import { CommonActions } from "@react-navigation/native";

const StudentPortalScreen = ({ navigation }) => {

    const [data, setData] = useState({})
    const [dataLoaded, setLoading] = useState(false)
    const [dropDown, setDropDown] = useState(false)
    const [error, setError] = useState('')
    const [msg, setMsg] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const [members, setMembers] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            const getData = async () => {
                const docRef = doc(db, "Students", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setData(docSnap.data());
                    if (docSnap.data().Advisor != null) {
                        navigation.navigate('AdvisorPortal')
                    }
                    setLoading(true)
                } else {
                    console.log("No such document!");
                }
            }
            getData()
        }, [dataLoaded, msg])
    );

    useEffect(() => {
        const fetchMembers = async () => {
            const docRef = doc(db, "Groups", data.Group_Id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setMembers(docSnap.data().groupMembers || []);
            } else {
                console.log("No such document!");
            }
        };

        fetchMembers();
    }, [data]);

    if (!dataLoaded) {
        return <LoadingIndicator />;
    }


    const nav = (value) => {
        switch (value) {
            case 1:
                navigation.navigate('AdvisorList', {
                    stdData: data
                })
                break;
            case 2:
                Alert.alert('Under Development Please Wait :)')
                break;
            case 3:
                navigation.navigate('FormsScreen')
                break;
            case 4:
                navigation.navigate('GroupRegistration')
                break;
            case 5:
                if (data.Group_Id == "" || data.Group_Id == null) {
                    setError('Please Register Group to Proceed')
                    setShowAlert(true);
                }
                else {
                    navigation.navigate('ProposalSubmission')
                }
                break;
            case 6:
                Linking.openURL('https://sst.umt.edu.pk/vip/Projects/Final-Year-Projects.aspx')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 7:
                navigation.navigate('ViewFutureIdeas')
                break;
            case 8:
                navigation.navigate('GuidelineScreen')
                break;
            case 9:
                navigation.navigate('EditGroup', {
                    gId: data.Group_Id,
                    currentUser: data.name,
                })
                break;
            case 10:
                //View Previous Proposals
                navigation.navigate('PreviousProposals', {
                    group: data.Group_Id,
                })
                break
        }
    }

    const handleMsgAccept = async () => {
        const docRefUser = doc(db, "Students", auth.currentUser.uid);
        await updateDoc(docRefUser, {
            "message": null
        });
        setError('Group Joined')
        setShowAlert(true)
        setMsg(false)
    }

    const handleMsgReject = async () => {
        if (members === null) {
            console.log("Members not yet loaded");
            return;
        }

        const newMembers = members.filter(user => user.id !== auth.currentUser.uid);

        const docRefUser = doc(db, "Students", auth.currentUser.uid);
        await updateDoc(docRefUser, {
            "Group_Id": null,
            "project_Id": null, 
            "message": null
        });

        const docRefGroup = doc(db, "Groups", data.Group_Id);
        await updateDoc(docRefGroup, {
            "groupMembers": newMembers
        });

        setError('Invite Rejected');
        setShowAlert(true);
        setMsg(false);
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
                    <View style={styles.header}>
                        <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.heading}>Student Portal</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                setDropDown(!dropDown)
                                setMsg(null)
                            }}>
                                <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                            </TouchableOpacity>
                        </View>

                        {msg && (
                            <View style={styles.popup}>
                                <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                    <View style={{ alignItems: 'center' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15, paddingHorizontal: 20 }}>Notifications</Text>
                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>
                                        {data.message ? (
                                            <View>
                                                <Text>{data.message}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 15 }}>
                                                    <TouchableOpacity onPress={() => { handleMsgAccept() }}>
                                                        <Text style={{ color: 'green', borderWidth: 1, borderColor: 'green', padding: 5 }}>Accept</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { handleMsgReject() }}>
                                                        <Text style={{ color: 'red', borderWidth: 1, borderColor: 'red', padding: 5, }}>Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <Text>No new Notifications</Text>
                                        )
                                        }
                                    </View>
                                </ImageBackground>
                            </View>
                        )}

                        {dropDown && (
                            <View style={styles.popup}>
                                <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                    <View style={{ alignItems: 'center' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>{data.name}</Text>
                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDropDown(false)
                                                setMsg(true)
                                            }}
                                            style={{ flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 4 }}
                                        >
                                            <Text style={[styles.dropText, { borderBottomWidth: 0 }]}>Group Invites</Text>
                                            {data.message && (
                                                <Animatable.View
                                                    animation="pulse"
                                                    easing="ease-in-quint"
                                                    iterationCount="infinite"
                                                    style={styles.notificationBorder}
                                                >
                                                    <Text style={styles.notification}>
                                                        1
                                                    </Text>
                                                </Animatable.View>
                                            )}
                                        </TouchableOpacity>

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
                    <View style={{ flex: 9, paddingTop: 15 }}>
                        <ScrollView refreshControl={
                            <RefreshControl refreshing={!dataLoaded} onRefresh={() => { setLoading(false) }} />
                        }>
                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Display Advisors
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            FYP Templates
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            {data.Group_Id == null ? (
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Group Registration
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.Webdiv}>
                                    <TouchableOpacity onPress={() => nav(9)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Edit Group
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            )}



                            {/* <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={() => nav(5)}>
                            <Text style={styles.menuSub}>
                                Submit Proposal
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(6)} style={styles.menuContainer}>

                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Previous Final Year Projects
                                        </Text>

                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(7)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Future Project Ideas
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>


                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(10)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            View Sent Proposals
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>


                            <View style={styles.Webdiv}>
                                <TouchableOpacity onPress={() => nav(8)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Guidelines
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={styles.header}>
                        <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={styles.heading}>Student Portal</Text>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                setDropDown(!dropDown)
                                setMsg(null)
                            }}>
                                <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                            </TouchableOpacity>
                        </View>

                        {msg && (
                            <View style={styles.popup}>
                                <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                    <View style={{ alignItems: 'center' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15, paddingHorizontal: 20 }}>Notifications</Text>
                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>
                                        {data.message ? (
                                            <View>
                                                <Text>{data.message}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 15 }}>
                                                    <TouchableOpacity onPress={() => { handleMsgAccept() }}>
                                                        <Text style={{ color: 'green', borderWidth: 1, borderColor: 'green', padding: 5 }}>Accept</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => { handleMsgReject() }}>
                                                        <Text style={{ color: 'red', borderWidth: 1, borderColor: 'red', padding: 5, }}>Reject</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <Text>No new Notifications</Text>
                                        )
                                        }
                                    </View>
                                </ImageBackground>
                            </View>
                        )}

                        {dropDown && (
                            <View style={styles.popup}>
                                <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                    <View style={{ alignItems: 'center' }}>

                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>{data.name}</Text>
                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setDropDown(false)
                                                setMsg(true)
                                            }}
                                            style={{ flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 4 }}
                                        >
                                            <Text style={[styles.dropText, { borderBottomWidth: 0 }]}>Group Invites</Text>
                                            {data.message && (
                                                <Animatable.View
                                                    animation="pulse"
                                                    easing="ease-in-quint"
                                                    iterationCount="infinite"
                                                    style={styles.notificationBorder}
                                                >
                                                    <Text style={styles.notification}>
                                                        1
                                                    </Text>
                                                </Animatable.View>
                                            )}
                                        </TouchableOpacity>

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
                    <View style={{ flex: 9, paddingTop: 15 }}>
                        <ScrollView refreshControl={
                            <RefreshControl refreshing={!dataLoaded} onRefresh={() => { setLoading(false) }} />
                        }>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Display Advisors
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            FYP Templates
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            {data.Group_Id == null ? (
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Group Registration
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.div}>
                                    <TouchableOpacity onPress={() => nav(9)} style={styles.menuContainer}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.menuSub}>
                                                Edit Group
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                </View>
                            )}



                            {/* <View style={styles.menuContainer}>
                        <TouchableOpacity onPress={() => nav(5)}>
                            <Text style={styles.menuSub}>
                                Submit Proposal
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(6)} style={styles.menuContainer}>

                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Previous Final Year Projects
                                        </Text>

                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(7)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Future Project Ideas
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>


                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(10)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            View Sent Proposals
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>


                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(8)} style={styles.menuContainer}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={styles.menuSub}>
                                            Guidelines
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
            )}
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
        zIndex: 1,
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
        borderRadius: 5
    },
    Webdiv: {
        margin: 5,
        borderRadius: 5,
        width: wp(50),
        alignSelf: 'center'
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
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 15,
        right: 15,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "black"
    },
    menuContainer: {
        margin: 7,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    drop: {
        height: 25,
        width: 25,
        marginRight: 10
    },
    Webdrop: {
        height: hp(25),
        width: wp(25),
        marginRight: 10,
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
    popup: {
        position: 'absolute',
        //height: '400%',
        width: 'auto',
        //opacity: 0.9,
        zIndex: 1,
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
    },
    WebbackgroundPopup: {
        width: wp(25),
        height: hp(25),
        right: 0,
        position: 'absolute'
    },
    notification: {
        fontSize: 10,
        textAlign: 'center',
    },
    notificationBorder: {
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },

})

export default StudentPortalScreen;