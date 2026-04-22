import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Image, Platform, Linking, Alert, RefreshControl, ImageBackground } from "react-native";
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, FieldValue, arrayUnion, query, where, writeBatch } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import RadioButtonGroup from "expo-radio-button";
import SelectDropdown from "react-native-select-dropdown";
import { Dimensions } from "react-native";
import * as Animatable from "react-native-animatable"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from "../Components/LoadingIndicator";
import { useRoute } from "@react-navigation/native";
import { FlatList } from "react-native-gesture-handler";
import firebase from "firebase/compat/app";

const ViewActiveProjectsScreen = ({ navigation }) => {

    const route = useRoute();
    const groups = route.params?.groups
    const [data, setData] = useState({})
    const [dataLoaded, setLoading] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState(null)


    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };




    useEffect(() => {
        console.log(groups);
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "Groups"));
            const temp = []
            querySnapshot.forEach((doc) => {
                for (let i = 0; i < groups.length; i++) {
                    if (doc.data().group_Id == groups[i]) {
                        temp.push(doc.data())
                        console.log('added');
                    }
                }
            });
            setData(temp);
        }
        getData()
        console.log(data)
        setLoading(true)
    }, [dataLoaded])

    if (!dataLoaded) {
        <LoadingIndicator />
    }

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'web' ? (

                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', opacity: 0.8, alignItems: 'center', borderBottomWidth: 1 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%', }}>
                            <Text style={styles.Webheading}>Active Projects</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white', opacity: 0.8 }}>
                        <Text style={{ color: 'grey', textAlign: 'center', fontSize: 10, paddingTop: 15 }}>Total Projects ( {groups?.length} )</Text>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <View style={styles.Weblist}>
                                    <View style={{ flex: 6.5 }}>
                                        <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                        <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                        <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                        <Text>Members: <Text style={{ color: 'rgb(110,110,110)' }}>
                                            {item.groupMembers.map((member, index) => (
                                                <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                    {member.name}
                                                    {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                </Text>
                                            ))}</Text></Text>
                                    </View>
                                    <View style={{ flex: 3.5, justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // navigation.navigate('ScheduleMeeting', {
                                                //     group: item.group_Id,
                                                // });
                                                setSelectedGroup(item)
                                            }}
                                        >
                                            <Text style={styles.WebmeetingButt}>Preview</Text>
                                        </TouchableOpacity>

                                        {!item?.evaluator1 && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('AssignEvaluator', {
                                                        group: item.group_Id,
                                                    });
                                                }}
                                            >
                                                <Text style={styles.WebevaluatorButt}>Assign Evaluator</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                        {selectedGroup && (
                            <View style={styles.Webpopup}>
                                <TouchableOpacity onPress={() => { setSelectedGroup(null) }}
                                    style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10 }}>
                                    <Image source={require('../resources/cancel.jpg')} style={{ height: 20, width: 20 }} />
                                </TouchableOpacity>
                                <ScrollView >

                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                        <Text> {selectedGroup.group_Id}</Text>
                                    </View>

                                    <View>
                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Idea:</Text>
                                            {selectedGroup.idea ? (<View>
                                                <Text> {selectedGroup.idea}</Text>
                                            </View>) : (<View>
                                                <Text>Not yet Selected</Text>
                                            </View>)}
                                        </View>

                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Group Leader: </Text>
                                            <Text>{selectedGroup.groupLeader}</Text>
                                        </View>

                                        <View style={{ marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Group Members: </Text>
                                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                                {selectedGroup.groupMembers.map((member, index) => (
                                                    <Text key={index}>
                                                        {'\t\u2022'} {member.name}
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Status:</Text>
                                            {selectedGroup.status ? (<View>
                                                <Text style={{ color: 'green' }}> On Going</Text>
                                            </View>) : (<View>
                                                <Text> FYP not registered yet</Text>
                                            </View>)}
                                        </View>
                                    </View>

                                    {selectedGroup.evaluator1 && (
                                        <View style={{ paddingBottom: 15 }}>
                                            <View>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 1</Text>
                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                                    <Text> {selectedGroup.evaluator1.name}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                                    <Text> {selectedGroup.evaluator1.facultyID}</Text>
                                                </View>

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                                {selectedGroup.evaluator1.cap1 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator1.cap1.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator1.cap1.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator1.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                                {selectedGroup.evaluator1.cap2 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator1.cap2.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator1.cap2.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator1.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 2</Text>
                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                                    <Text> {selectedGroup.evaluator2.name}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                                    <Text> {selectedGroup.evaluator2.facultyID}</Text>
                                                </View>

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                                {selectedGroup.evaluator2.cap1 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator2.cap1.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator2.cap1.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator2.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                                {selectedGroup.evaluator2.cap2 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator2.cap2.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator2.cap2.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator2.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    <TouchableOpacity style={{ alignItems: "center", marginVertical: 10 }}
                                        onPress={() => {
                                            navigation.navigate('ScheduleMeeting', {
                                                group: (selectedGroup.group_Id + '')
                                            })
                                        }}
                                    >
                                        <Text style={styles.meetingButt}>Call Meeting</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        )}
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
                        <View style={{ width: '100%', }}>
                            <Text style={styles.heading}>Active Projects</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'lightgrey' }}>
                        <Text style={{ color: 'grey', textAlign: 'center', fontSize: 10, paddingTop: 15 }}>Total Projects ( {groups?.length} )</Text>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <View style={styles.list}>
                                    <View style={{ flex: 6.5 }}>
                                        <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                        <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                        <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                        <Text>Members: <Text style={{ color: 'rgb(110,110,110)' }}>
                                            {item.groupMembers.map((member, index) => (
                                                <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                    {member.name}
                                                    {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                </Text>
                                            ))}</Text></Text>
                                    </View>
                                    <View style={{ flex: 3.5, justifyContent: 'space-evenly' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                // navigation.navigate('ScheduleMeeting', {
                                                //     group: item.group_Id,
                                                // });
                                                setSelectedGroup(item)
                                            }}
                                        >
                                            <Text style={styles.meetingButt}>Preview</Text>
                                        </TouchableOpacity>

                                        {!item?.evaluator1 && (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('AssignEvaluator', {
                                                        group: item.group_Id,
                                                    });
                                                }}
                                            >
                                                <Text style={styles.evaluatorButt}>Assign Evaluator</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            )}
                        />
                        {selectedGroup && (
                            <View style={styles.popup}>
                                <TouchableOpacity onPress={() => { setSelectedGroup(null) }}
                                    style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10 }}>
                                    <Image source={require('../resources/cancel.jpg')} style={{ height: 20, width: 20 }} />
                                </TouchableOpacity>
                                <ScrollView >

                                    <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                        <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                        <Text> {selectedGroup.group_Id}</Text>
                                    </View>

                                    <View>
                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Idea:</Text>
                                            {selectedGroup.idea ? (<View>
                                                <Text> {selectedGroup.idea}</Text>
                                            </View>) : (<View>
                                                <Text>Not yet Selected</Text>
                                            </View>)}
                                        </View>

                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Group Leader: </Text>
                                            <Text>{selectedGroup.groupLeader}</Text>
                                        </View>

                                        <View style={{ marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Group Members: </Text>
                                            <View style={{ flexDirection: 'column', marginLeft: 5 }}>
                                                {selectedGroup.groupMembers.map((member, index) => (
                                                    <Text key={index}>
                                                        {'\t\u2022'} {member.name}
                                                    </Text>
                                                ))}
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Status:</Text>
                                            {selectedGroup.status ? (<View>
                                                <Text style={{ color: 'green' }}> On Going</Text>
                                            </View>) : (<View>
                                                <Text> FYP not registered yet</Text>
                                            </View>)}
                                        </View>
                                    </View>

                                    {selectedGroup.evaluator1 && (
                                        <View style={{ paddingBottom: 15 }}>
                                            <View>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 1</Text>
                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                                    <Text> {selectedGroup.evaluator1.name}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                                    <Text> {selectedGroup.evaluator1.facultyID}</Text>
                                                </View>

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                                {selectedGroup.evaluator1.cap1 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator1.cap1.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator1.cap1.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator1.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                                {selectedGroup.evaluator1.cap2 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator1.cap2.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator1.cap2.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator1.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View>
                                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>{'\n'}Evaluator 2</Text>
                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>Name:</Text>
                                                    <Text> {selectedGroup.evaluator2.name}</Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                                                    <Text style={{ fontWeight: 'bold' }}>ID:</Text>
                                                    <Text> {selectedGroup.evaluator2.facultyID}</Text>
                                                </View>

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 1:</Text>

                                                {selectedGroup.evaluator2.cap1 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator2.cap1.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator2.cap1.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator2.cap1.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}

                                                <Text style={{ fontWeight: 'bold' }}>Capstone 2:</Text>

                                                {selectedGroup.evaluator2.cap2 ? (
                                                    <View style={{ marginVertical: 2 }}>
                                                        <View style={{ marginBottom: 20, padding: 10, borderWidth: 1, borderColor: 'grey' }}>
                                                            {selectedGroup.evaluator2.cap2.reviews.questions.map((question, qIndex) => (
                                                                <View key={qIndex} style={{ marginVertical: 5, flexDirection: 'row' }}>
                                                                    <Text style={{ flex: 9.5 }}>{question.questionText}</Text>
                                                                    <Text style={{ flex: 0.5 }}>{question.value || 0}</Text>
                                                                </View>
                                                            ))}
                                                            <Text>Comments: {selectedGroup.evaluator2.cap2.reviews.comments}</Text>
                                                            <Text>Recommend for Future Competitions: {selectedGroup.evaluator2.cap2.reviews.recommend ? "Yes" : "No"}</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View>
                                                        <Text style={{}}>{'\t'}Evaluator Hasn't Evaluated Yet</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    <TouchableOpacity style={{ alignItems: "center", marginVertical: 10 }}
                                        onPress={() => {
                                            navigation.navigate('ScheduleMeeting', {
                                                group: (selectedGroup.group_Id + '')
                                            })
                                        }}
                                    >
                                        <Text style={styles.meetingButt}>Call Meeting</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        )}
                    </View>
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
        fontWeight: 'bold',

    },
    list: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 10,
        borderWidth: 1,
        padding: 8,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    preview: {
        borderWidth: 1,
        justifyContent: 'center',
        padding: 5,
        color: 'green',
        borderColor: 'green'
    },
    popup: {
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '80%',
        height: '80%',
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000'
    },
    Weblist: {
        marginHorizontal: 15,
        alignSelf: 'center',
        width: wp(60),
        marginVertical: 10,
        borderWidth: 1,
        padding: 8,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    Webpopup: {
        alignSelf: 'center',
        position: 'absolute',
        top: '20%',
        left: '25%',
        width: wp(50),
        // height: hp(50),
        maxHeight: '70%',
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000'
    },
    pdfButton: {
        alignSelf: 'flex-start',
        marginVertical: 4,
        padding: 4,
        paddingHorizontal: 5,
        height: 40,
        width: 40,
    },
    accept: {
        borderWidth: 1,
        padding: 4,
        borderColor: 'green',
        color: 'green'
    },
    reject: {
        borderWidth: 1,
        padding: 4,
        borderColor: 'red',
        color: 'red'
    },
    background: {
        height: hp(100),
        width: wp(100),
        //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,
        // paddingHorizontal:wp(40),

    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
    meetingButt: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: 'skyblue',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 6,
        marginBottom: 10
    },
    WebmeetingButt: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        fontSize: '15',
        width: wp(15),
        backgroundColor: 'skyblue',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 6,
        marginBottom: 10
    },
    evaluatorButt: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#244082',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 6,
        marginTop: 4,
        color: 'white'
    },
    WebevaluatorButt: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#244082',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 6,
        marginTop: 4,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,

    },
    WebmeetingButt: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: 'skyblue',
        textAlign: 'center',
        fontSize: 10,
        paddingVertical: 6,
        marginTop: 4,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 15,

    }

})

export default ViewActiveProjectsScreen;