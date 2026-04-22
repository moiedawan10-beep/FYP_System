import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, Platform, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, ImageBackground, RefreshControl, Linking, FlatList, Alert } from "react-native";
import { collection, addDoc, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import LoadingIndicator from "../Components/LoadingIndicator";
import CustomAlert from "../Components/CustomAlert";

const ViewFutureIdeas = ({ navigation }) => {

    const [dataLoaded, setLoading] = useState(false)
    const [data, setData] = useState(null)

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "Ideas", 'one');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
                setLoading(true)
            } else {
                console.log("No such document!");
            }
        }
        getData()
    }, [dataLoaded])

    if (!dataLoaded) {
        return <LoadingIndicator />
    }

    const renderItem = ({ item }) => (
        <View style={styles.emailContainer}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.idea}</Text>
            <Text style={{ fontSize: 16, flex: 7.8,  }}>"{item.desc || 'N/A'}"</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', opacity: 0.8, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.Webheading}>Future FYP Ideas</Text>
                        </View>
                    </View>
                    <View style={styles.Webbox}>
                        <FlatList
                            data={data.ideas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                            style={{width:wp(60),alignSelf:'center'}}
                        />
                    </View>
                </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.heading}>Future FYP Ideas</Text>
                        </View>
                    </View>
                    <View style={styles.box}>
                        <FlatList
                            data={data.ideas}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                    </View>
                </ImageBackground>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',

    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
        marginHorizontal: 60,
        textAlign: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8
    },
    emailContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        margin: 5
    },
    removeText: {
        color: 'red'
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,

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
        paddingTop: 15,
        borderWidth: 1,
        backgroundColor: 'lightgrey',
        padding: 10,
        flex: 1,
      //  justifyContent: 'center'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    Webbox: {
        paddingTop: 15,
        borderWidth: 1,
        backgroundColor: 'white',
        opacity: 0.8,
        padding: 20,
        flex: 1,
        justifyContent: 'center'
    },
});

export default ViewFutureIdeas;