import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View,Platform, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, RefreshControl, Linking, ImageBackground } from "react-native";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import LoadingIndicator from "../Components/LoadingIndicator";
import CustomAlert from '../Components/CustomAlert';

import { CommonActions } from "@react-navigation/native";
//import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";

const AdvisorPortalScreen = ({ navigation }) => {

    const [data, setData] = useState({})
    const [proposals, setProposals] = useState(null)
    const [dataLoaded, setLoading] = useState(false)
    const [dropDown, setDropDown] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            //put reference as auth,currentuser.uid
            const docRef = doc(db, "Faculty", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().email);
                setData(docSnap.data());
                console.log(data)
                setLoading(true)
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

            const querySnapshot = await getDocs(collection(db, "Proposals"));
            const temp = []
            querySnapshot.forEach((doc) => {
                if (doc.data().Advisor_Id == auth.currentUser.uid && doc.data().isAccepted == null) {
                    temp.push(
                        doc.data()
                    )
                }
            });
            setProposals(temp);
            console.log(proposals)
        }
        getData()
    }, [dataLoaded])

    const dropdown = ["Advisor Portal", "Evaluator Portal", "Profile", "sign Out"]

    const func = (n) => {
        //navigation
        if (n == "Advisor Portal") {
            console.log("1")
        } else if (n == "Evaluator Portal") {
            navigation.navigate('EvaluatorPortal', {
                FactData: data,
            });
        } else if (n == "Profile") {
            navigation.navigate('ProfileFaculty', {
                FactData: data,
            });
        } else if (n == "sign Out") {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Main' }]
                })
            )
        }
    }

    const nav = (value) => {
        switch (value) {
            case 1:
                //View Proposals
                navigation.navigate('ProposalHandle', {
                    proposals: proposals
                })
                break;
            case 2:
                //Current Active Projects
                navigation.navigate('ViewProjects', {
                    groups: data.currentProjects
                })
                break;
            case 3:
                //Schedule Meetings
                navigation.navigate('ScheduleMeeting')
                break;
            case 4:
                //Previous FYPS
                Linking.openURL('https://sst.umt.edu.pk/vip/Projects/Final-Year-Projects.aspx')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 5:
                //Generate Emails
                navigation.navigate('EmailScreen')
                break;
            case 6:
                //Counselling Hours
                navigation.navigate("CounsellingHours", {
                    id: auth.currentUser.uid
                })
                break;
                
            case 7: 
                //Add FYP
                navigation.navigate('AddFutureFYP', {
                    type: 'advisor'
                })
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
                <View style={styles.Webheader}>
                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity 
                            onPress={() => {
                                navigation.navigate('ProfileFaculty', {
                                    FactData: data,
                                });
                            }}
                        >
                            <Image
                                style={styles.profilePic}
                                source={{ uri: data.pictureUrl }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 8, alignItems: 'center',textAlign:'center', flexDirection: 'row' }}>
                        <Text style={styles.Webheading}>Advisor Portal</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                            <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                        </TouchableOpacity>
                    </View>

                    {dropDown && (
                        <View style={styles.popup}>
                            <ImageBackground source={require('../resources/bg1.jpg')} style={styles.WebbackgroundPopup}>
                                <View style={{alignItems: 'center'}}>
                                    <Image
                                        style={styles.profilePic}
                                        source={{ uri: data.pictureUrl }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                                </View>
                                <View style={{ margin: 10, paddingBottom: 20,width:wp(25),height:hp(25) }}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            navigation.navigate('EvaluatorPortal', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Evaluator Portal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('ProfileFaculty', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Profile</Text>
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
                <View style={{ flex: 9, paddingTop: 15,width: wp(50),alignSelf:'center' }}>
                    <ScrollView refreshControl={
                        <RefreshControl refreshing={!dataLoaded} onRefresh={() => { setLoading(false) }} />
                    }>
                        <View style={{ flex: 1 }}>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(1)} style={[styles.menuContainer]}>
                                    {proposals?.length == 0 ? (
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                View Proposals
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', flex: 8, justifyContent: 'space-evenly' }}>
                                            <Text style={styles.menuSub}>
                                                View Proposals
                                            </Text>
                                            <Animatable.View
                                                animation="pulse"
                                                easing="ease-in-quint"
                                                iterationCount="infinite"
                                                style={styles.notificationBorder}
                                            >
                                                <Text style={styles.notification}>
                                                    {proposals?.length}
                                                </Text>
                                            </Animatable.View>
                                        </View>
                                    )}


                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(2)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Current Active Projects
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(4)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Previous Final Year Projects
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(5)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Generate Email
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(6)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Counselling Hours
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(7)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Add Future Idea
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>


                <View style={{ justifyContent: 'flex-end', position: 'relative', backgroundColor: 'black' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ChatListFact', {
                                FactData: data,
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
                    <View style={{ flex: 2, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity 
                            onPress={() => {
                                navigation.navigate('ProfileFaculty', {
                                    FactData: data,
                                });
                            }}
                        >
                            <Image
                                style={styles.profilePic}
                                source={{ uri: data.pictureUrl }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 8, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.heading}>Advisor Portal</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                            <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                        </TouchableOpacity>
                    </View>

                    {dropDown && (
                        <View style={styles.popup}>
                            <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                <View style={{alignItems: 'center'}}>
                                    <Image
                                        style={styles.profilePic}
                                        source={{ uri: data.pictureUrl }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                                </View>
                                <View style={{ margin: 10, paddingBottom: 20 }}>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            navigation.navigate('EvaluatorPortal', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Evaluator Portal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('ProfileFaculty', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Profile</Text>
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
                        <View style={{ flex: 1 }}>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(1)} style={[styles.menuContainer]}>
                                    {proposals?.length == 0 ? (
                                        <View style={{ flex: 8 }}>
                                            <Text style={[styles.menuSub]}>
                                                View Proposals
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', flex: 8, justifyContent: 'space-evenly' }}>
                                            <Text style={styles.menuSub}>
                                                View Proposals
                                            </Text>
                                            <Animatable.View
                                                animation="pulse"
                                                easing="ease-in-quint"
                                                iterationCount="infinite"
                                                style={styles.notificationBorder}
                                            >
                                                <Text style={styles.notification}>
                                                    {proposals?.length}
                                                </Text>
                                            </Animatable.View>
                                        </View>
                                    )}


                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(2)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Current Active Projects
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(4)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Previous Final Year Projects
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(5)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Generate Email
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(6)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Counselling Hours
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.div}>
                                <TouchableOpacity onPress={() => nav(7)} style={[styles.menuContainer]}>
                                    <View style={{ flex: 8 }}>
                                        <Text style={[styles.menuSub]}>
                                            Add Future Idea
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>


                <View style={{ justifyContent: 'flex-end', position: 'relative', backgroundColor: 'black' }}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('ChatListFact', {
                                FactData: data,
                            });
                        }}
                    >
                        <Image source={require('../resources/chat.jpg')} style={styles.chat} />
                    </TouchableOpacity>
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
        borderBottomWidth:1
    },
    Webheader: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
        
        zIndex: 1,
       // borderBottomWidth:1
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
       marginHorizontal: 20,


    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
       marginHorizontal: 10,
        
        fontWeight: 'bold',
       //marginVertical: 5,
      // paddingHorizontal:wp(40),

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
    profilePic: {
        borderWidth: 1,
        height: 55,
        width: 55,
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
    background: {
        height: hp(100),
        width: wp(100),
        //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    notification: {
        fontSize: 10,
        textAlign: 'center',
        color: 'white'
    },
    notificationBorder: {
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 100,
        marginHorizontal: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: 'white'
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
    drop: {
        height: 25,
        width: 25,
        marginRight: 10
    },
    popup: {
        position: 'absolute',
        //height: '400%',
        width: '50%',
        //opacity: 0.9,
        zIndex: 1,
        right: 0,
        top: '100%',
        alignItems: 'center',
        maxHeight: '700%',
    },
    Webpopup: {
        position: 'absolute',
        //height: '400%',
        width: wp(50),
        height: hp(25),
        zIndex: 1,
        right: 0,
        alignItems:'flex-start'
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
       flex: 1,
       // resizeMode: 'stretch', // or 'stretch' or 'contain',
       height:hp(28),
       width: wp(25), 
       right: 0,
        position: 'absolute'
    }

})

export default AdvisorPortalScreen;