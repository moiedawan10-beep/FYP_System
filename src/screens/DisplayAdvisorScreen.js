import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text,Platform, View, TextInput, TouchableOpacity, FlatList, Image, Linking, ImageBackground, Alert } from "react-native";
import { collection, addDoc, setDoc, doc, query, where, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import { useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import { Directions, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomAlert from '../Components/CustomAlert';


const AdvisorDisplayScreen = ({ navigation }) => {
    const route = useRoute();
    const [facultyData, setFacultyData] = useState([])
    const data = route.params?.stdData
    const [detail, setDetail] = useState(null)
    const [error, setError] = useState('')

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getFacData = async () => {
            const querySnapshot = await getDocs(collection(db, "Faculty"));
            const temp = []
            querySnapshot.forEach((doc) => {
                temp.push(doc.data())
                console.log(temp)
            });
            setFacultyData(temp)
        }
        getFacData()
    }, [])

    const handleItemPress = (item) => {
        if (data.Group_Id == "" || data.Group_Id == null) {
            setError('Please Register Group to Proceed')
            setShowAlert(true);

        }
        else {
            navigation.navigate('ProposalSubmission', { advisorData: item })
        }
    };

    const handleDetailPress = (item) => {
        setDetail(item)
    }

    const renderItem = ({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1, flexDirection: 'row' }}>
            <Image
                style={styles.profilePic}
                source={{ uri: item.pictureUrl }}
            />
            <View style={{ alignItems: 'center', flexDirection: 'column', alignSelf: 'center' }}>
                <Text style={{ fontSize: 20, margin: 5, alignSelf: 'flex-start' }}>{item.name}</Text>
                <Text style={{ marginBottom: 27 }}>{item.email}</Text>
            </View>
            {/* <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                <Text style={{ fontSize: 11, marginVertical: 2, alignSelf: 'flex-end' }}>{item.interest_area_1}</Text>
                <Text style={{ fontSize: 11, marginVertical: 2, alignSelf: 'flex-end' }}>{item.interest_area_2}</Text>
                <Text style={{ fontSize: 11, marginVertical: 2, alignSelf: 'flex-end' }}>{item.interest_area_3}</Text>
            </View> */}
            <View style={{ position: 'absolute', right: 0, margin: 12, flexDirection: 'column', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => {
                        handleDetailPress(item)
                    }}>
                    <Text style={styles.detailButt}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        handleItemPress(item)
                    }}>
                    <Text style={styles.submitButt}>Submit Proposal</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {showAlert && (
                <CustomAlert
                    message={error}
                    //screenName="Main"
                    onClose={handleCloseAlert} // No screenName means it will just close
                />
            )}
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row',marginTop:0, justifyContent: 'space-around',backgroundColor:'white',opacity:0.8, alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Available Advisors</Text>
                    </View>
                </View>
<View style={{ backgroundColor: 'white', opacity:0.8, alignItems:'center' }}>
                <View style={{ width:wp(60), flexDirection:'row',alignSelf:'center' }}>
                    <FlatList
                        data={facultyData}
                        renderItem={renderItem}
                    />
                    {detail && (
                        <View style={styles.popup}>

                            <TouchableOpacity onPress={() => {
                                setDetail(null)
                            }} style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, marginBottom: 15 }}>
                                <Image source={require('../resources/cancel.jpg')} style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 24, textAlign: 'center', position: 'absolute', marginVertical: 10, left: '45%' }}>Details</Text>
                            <ScrollView>
                                <View>
                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Advisor's Name:</Text>
                                        <Text> {detail.name}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', marginVertical: 2 }}>
                                        <Text style={{  fontWeight: 'bold' }}>Interest Areas:</Text>
                                        {detail.interest_area_1 != "" && detail.interest_area_1 != null ? (
                                            <View>
                                                <Text> {detail.interest_area_1}</Text>
                                                <Text> {detail.interest_area_2}</Text>
                                                <Text> {detail.interest_area_3}</Text>
                                            </View>
                                        ) : (<View>
                                            <Text style={{ color: 'grey' }}> Unavailable</Text>
                                        </View>)}
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{  fontWeight: 'bold' }}>Available Seats:</Text>
                                        <Text> {detail.project_counter}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    )}
                </View>
                </View>
            </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading1}>Available Advisors</Text>
                    </View>
                </View>

                <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
                    <FlatList
                        data={facultyData}
                        renderItem={renderItem}
                        
                    />
                    {detail && (
                        <View style={styles.popup}>

                            <TouchableOpacity onPress={() => {
                                setDetail(null)
                            }} style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, marginBottom: 15 }}>
                                <Image source={require('../resources/cancel.jpg')} style={{ height: 20, width: 20 }} />
                            </TouchableOpacity>
                            <Text style={{ fontSize: 24, textAlign: 'center', position: 'absolute', marginVertical: 10, left: '45%' }}>Details</Text>
                            <ScrollView>
                                <View>
                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{ fontWeight: 'bold' }}>Advisor's Name:</Text>
                                        <Text> {detail.name}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', marginVertical: 2 }}>
                                        <Text style={{  fontWeight: 'bold' }}>Interest Areas:</Text>
                                        {detail.interest_area_1 != "" && detail.interest_area_1 != null ? (
                                            <View>
                                                <Text> {detail.interest_area_1}</Text>
                                                <Text> {detail.interest_area_2}</Text>
                                                <Text> {detail.interest_area_3}</Text>
                                            </View>
                                        ) : (<View>
                                            <Text style={{ color: 'grey' }}> Unavailable</Text>
                                        </View>)}
                                    </View>
                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{  fontWeight: 'bold' }}>Available Seats:</Text>
                                        <Text> {detail.project_counter}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>

                    )}
                </View>
            </ImageBackground>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center'
    },
    heading: {
        fontSize: 24,
        marginHorizontal: 15,
        marginVertical: 5
    },
    profilePic: {
        borderWidth: 1,
        height: 70,
        width: 70,
        margin: 5,
        borderRadius: 5000,
    },
    submitButt: {
        fontSize: 12,
        borderWidth: 1,
        padding: 5,
        
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'green',
        borderColor: 'green',
        width: 100,
        margin:5
        //marginBottom:20,
    },
    detailButt: {
        fontSize: 12,
        borderWidth: 1,
        padding: 5,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#244082',
        borderColor: '#244082',
        width: 100,
        margin: 5
    },
    popup: {
        position: 'absolute',
        top: '30%',
        left: '10%',
        width: '80%',
        maxHeight: '30%',
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
    heading1: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,

    },
})

export default AdvisorDisplayScreen;