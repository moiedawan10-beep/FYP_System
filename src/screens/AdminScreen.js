import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { View, SafeAreaViewBase, Text, StyleSheet, Platform, Button, Alert, SafeAreaView, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { CommonActions, useRoute } from "@react-navigation/native";

import CustomAlert from '../Components/CustomAlert';



const AdminScreen = ({ navigation }) => {
    const [dropDown, setDropDown] = useState(false)

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    const nav = (value) => {
        switch (value) {
            case 1:
                //Manage Faculty
                navigation.navigate('ManageFaculty')
                break;
            case 2:
                //Add Faculty
                navigation.navigate('AddExcel')
                break;
            case 3:
                //Manage Students
                navigation.navigate('ManageStudents')
                break;
            case 4:
                //Active Groups
                navigation.navigate('ManageGroups')
                break;
            case 5:
                //Schedular
                navigation.navigate('Schedular')
                break;
            case 6:
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }]
                    })
                )
                break;
            case 7:
                //Schedular
                navigation.navigate('EnrollStudent')
                break;
            case 8:
                //Future FYP
                navigation.navigate('AddFutureFYP',{
                    type: 'admin'
                })
                break;
            case 9:
                //Questionnaires
                navigation.navigate('Questionnaire')
                break;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={styles.header}>
                    <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.Webheading}>Admin Portal</Text>
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
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15,marginLeft:5 }}>        Admin        </Text>

                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>


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
                                            <Text style={styles.WebdropText}>Sign Out</Text>
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
                    <ScrollView>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Manage Faculty
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(2)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Add Faculty
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Manage Students
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Active FYP Groups
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(5)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Meeting Schedular
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(7)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Enroll Students
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(8)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Add Future FYP Ideas
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.Webdiv}>
                            <TouchableOpacity onPress={() => nav(9)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Questionnaires
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>

            </ImageBackground>
            ) :(
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={styles.header}>
                    <View style={{ flex: 8.5, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.heading}>Admin Portal</Text>
                    </View>
                    <View style={{ justifyContent: 'center', flex: 1 }}>
                        <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                            <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                        </TouchableOpacity>
                    </View>

                    <View >
                        {dropDown && (
                            <View style={styles.popup}>
                                <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 15 }}>        Admin        </Text>

                                    </View>
                                    <View style={{ margin: 10, paddingBottom: 20 }}>


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
                    <ScrollView>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(1)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Manage Faculty
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(2)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Add Faculty
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(3)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Manage Students
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(4)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Active FYP Groups
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(5)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Meeting Schedular
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(7)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Enroll Students
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(8)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Add Future FYP Ideas
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.div}>
                            <TouchableOpacity onPress={() => nav(9)} style={styles.menuContainer}>
                                <View style={{ flex: 8 }}>
                                    <Text style={styles.menuSub}>
                                        Questionnaires
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
        zIndex: 1
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,
        marginLeft: 20,

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
    Webheading: {
        fontSize: 25,
        marginLeft:10,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

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
    WebbackgroundPopup: {
        height: hp(15),
        width: wp(25),
        right: 0,
        position: 'absolute'
    },
    Webdiv: {
        margin: 5,
        borderRadius: 5,
        width: wp(50),
        alignSelf: 'center'
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
    popup: {
        position: 'absolute',
        //height: '400%',
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
       textAlign: 'center'
    },
    WebdropText: {
        // borderTopWidth: 1,
        borderBottomWidth: 1,
        fontSize: 17,
        margin: 3,
       // textAlign: 'center'
    },
    backgroundPopup: {
        flex: 1,
        resizeMode: 'stretch', // or 'stretch' or 'contain',
        right: 0,
        position: 'absolute'
    }

})

export default AdminScreen;