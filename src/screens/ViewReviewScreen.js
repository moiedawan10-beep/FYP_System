import React, { useState, useEffect } from "react";
import { Button, StyleSheet,Platform, Text, View, ScrollView, TextInput, TouchableOpacity, ImageBackground, SafeAreaView, Image, RefreshControl, Linking, FlatList, Alert } from "react-native";
import { collection, addDoc, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import { RadioButtonItem } from "expo-radio-button";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from "../Components/LoadingIndicator";
import { useRoute } from "@react-navigation/native";

const ViewReviewScreen = ({ navigation }) => {

    const route = useRoute();
    const id = route.params?.id;
    const [groupData, setGroupData] = useState({});
    const [dataLoaded, setLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        const getGroupData = async () => {
            const docRef = doc(db, "Groups", id + '');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setGroupData(docSnap.data());
                setLoading(true);
            } else {
                console.log("No such document!");
            }
            setLoading(true);
        };
        getGroupData();
    }, [id]);

    if (!dataLoaded) {
        return (
            <LoadingIndicator />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',backgroundColor:'white',opacity:0.8 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Group Preview</Text>
                    </View>
                </View>
                <ScrollView style={styles.Webbox}>
                    <View style={{width: wp(50)}}>
                    <View style={{alignself:'center',}}>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                        <Text> {groupData.group_Id}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Idea:</Text>
                            {groupData.idea ? (
                                <Text> {groupData.idea}</Text>
                            ) : (
                                <Text>Not yet Selected</Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Group Leader: </Text>
                            <Text>{groupData.groupLeader}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Status:</Text>
                            {groupData.status ? (
                                <Text style={{ color: 'green' }}> On Going</Text>
                            ) : (
                                <Text> FYP not registered yet</Text>
                            )}
                        </View>

                        <View style={{ marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Group Members </Text>
                            <View style={{ marginHorizontal: 10,width: wp(50), alignSelf: 'center' }}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>Name</Text>
                                    <Text style={styles.tableHeader}>Email</Text>
                                </View>
                                {groupData.groupMembers.map((member, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{member.name}</Text>
                                        <Text style={styles.tableCell}>{member.email}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {groupData.evaluator1 && (
                        <View style={{ paddingBottom: 35 }}>
                            <View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 1</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                    <Text> {groupData.evaluator1.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                    <Text> {groupData.evaluator1.facultyID}</Text>
                                </View>

                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                {groupData.evaluator1.cap1 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator1.cap1.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator1.cap1.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator1.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{  }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}

                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                {groupData.evaluator1.cap2 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator1.cap2.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator1.cap2.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator1.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 2</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                    <Text> {groupData.evaluator2.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                    <Text> {groupData.evaluator2.facultyID}</Text>
                                </View>

                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                {groupData.evaluator2.cap1 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator2.cap1.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{  flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator2.cap1.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator2.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}

                                <Text style={{fontWeight: 'bold'}}>Capstone 2:</Text>

                                {groupData.evaluator2.cap2 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator2.cap2.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{flex: 9.5}}>{question.questionText}</Text>
                                                    <Text style={{flex: 0.5}}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator2.cap2.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator2.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                    </View>
                    </View>
                </ScrollView>
            </ImageBackground>
            ):(
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Group Preview</Text>
                    </View>
                </View>
                <ScrollView style={styles.box}>
                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                        <Text> {groupData.group_Id}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Idea:</Text>
                            {groupData.idea ? (
                                <Text> {groupData.idea}</Text>
                            ) : (
                                <Text>Not yet Selected</Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Group Leader: </Text>
                            <Text>{groupData.groupLeader}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Status:</Text>
                            {groupData.status ? (
                                <Text style={{ color: 'green' }}> On Going</Text>
                            ) : (
                                <Text> FYP not registered yet</Text>
                            )}
                        </View>

                        <View style={{ marginVertical: 2 }}>
                            <Text style={{ fontWeight: 'bold' }}>Group Members </Text>
                            <View style={{ marginHorizontal: 10 }}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>Name</Text>
                                    <Text style={styles.tableHeader}>Email</Text>
                                </View>
                                {groupData.groupMembers.map((member, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{member.name}</Text>
                                        <Text style={styles.tableCell}>{member.email}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {groupData.evaluator1 && (
                        <View style={{ paddingBottom: 35 }}>
                            <View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 1</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                    <Text> {groupData.evaluator1.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                    <Text> {groupData.evaluator1.facultyID}</Text>
                                </View>

                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                {groupData.evaluator1.cap1 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator1.cap1.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator1.cap1.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator1.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{  }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}

                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                {groupData.evaluator1.cap2 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator1.cap2.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator1.cap2.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator1.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}
                            </View>
                            <View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 2</Text>
                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                    <Text> {groupData.evaluator2.name}</Text>
                                </View>

                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                    <Text> {groupData.evaluator2.facultyID}</Text>
                                </View>

                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                {groupData.evaluator2.cap1 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator2.cap1.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{  flex: 9.5 }}>{question.questionText}</Text>
                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator2.cap1.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator2.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}

                                <Text style={{fontWeight: 'bold'}}>Capstone 2:</Text>

                                {groupData.evaluator2.cap2 ? (
                                    <View style={{ marginVertical: 2 }}>
                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                            {groupData.evaluator2.cap2.reviews.questions.map((question, qIndex) => (
                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                    <Text style={{flex: 9.5}}>{question.questionText}</Text>
                                                    <Text style={{flex: 0.5}}>{question.value || 0}</Text>
                                                </View>
                                            ))}
                                            <Text>Comments: {groupData.evaluator2.cap2.reviews.comments}</Text>
                                            <Text>Recommend for Future Competitions: {groupData.evaluator2.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <Text style={{ }}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </ImageBackground>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold'
    },
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    box: {
        borderWidth: 1,
        backgroundColor: 'lightgrey',
        padding: 15,
    },
    Webbox: {
        borderWidth: 1,
        backgroundColor: 'white',
        opacity:0.8,
        padding: 15,
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5
    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
    inputBody: {
        height: 150,
        maxHeight: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        margin: 10
    },
    button: {
        borderWidth: 1,
        padding: 5,
        fontSize: 12
    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    meetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 12,
        alignSelf: 'flex-end',
        fontStyle: 'italic'
    },
    tableCell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        textAlign: 'center'
    },
    tableHeader: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: 'grey',
        backgroundColor: 'lightgrey',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tableRow: {
        flexDirection: 'row'
    }
});

export default ViewReviewScreen;
