import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TextInput, Platform, TouchableOpacity, SafeAreaView, FlatList, Image, ImageBackground, ScrollView } from "react-native";
import { collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import SelectDropdown from "react-native-select-dropdown";
import LoadingIndicator from "../Components/LoadingIndicator";
import { Picker } from "@react-native-picker/picker";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RadioButtonGroup from "expo-radio-button";
import { RadioButtonItem } from "expo-radio-button";

import { auth, db } from "../../FirebaseConfig";
import { Directions } from "react-native-gesture-handler";

import { CommonActions, useRoute } from "@react-navigation/native";
import CustomAlert from '../Components/CustomAlert';



const TeacherPortalScreen = ({ navigation }) => {

    const [dataLoaded, setLoading] = useState(false)
    const [groupData, setGroupData] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [dropDown, setDropDown] = useState(false)

    const [cap1, setCap1] = useState(null)
    const [cap2, setCap2] = useState(null)
    const [QuestionnaireType, setQuestionnaireType] = useState("")



    const route = useRoute()
    const data = route.params?.FactData

    const [comments, setComments] = useState('');
    const [recommend, setRecommend] = useState(false);

    const [groupDataCap1, setGroupDataCap1] = useState(null)
    const [groupDataCap2, setGroupDataCap2] = useState(null)


    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "Groups"));
            const cap1 = []
            const cap2 = []

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const evaluator1 = data?.evaluator1;
                const evaluator2 = data?.evaluator2;

                if (evaluator1?.facultyID == auth.currentUser.uid) {
                    if (evaluator1.cap1 == null) {
                        cap1.push(data);
                    }
                    if (evaluator2.cap2 == null) {
                        cap2.push(data)
                    }
                }
                if (evaluator2?.facultyID == auth.currentUser.uid) {
                    if (evaluator2.cap1 == null) {
                        cap1.push(data);
                    }
                    if (evaluator2.cap2 == null) {
                        cap2.push(data)
                    }
                }
            });
            setGroupDataCap1(cap1)
            setGroupDataCap2(cap2)
            setLoading(true)

            console.log(groupDataCap1);
            console.log(groupDataCap2);
        }
        getData();

    }, [dataLoaded])

    useEffect(() => {
        const getCap1 = async () => {
            const docRef = doc(db, "Questionnaire", "cap1");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCap1(docSnap.data().questions)
                console.log((cap2));
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        const getCap2 = async () => {
            const docRef = doc(db, "Questionnaire", "cap2");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCap2(docSnap.data().questions)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getCap1()
        getCap2()
    }, [dataLoaded, groupDataCap1, groupDataCap2])

    const handleSubmit = async () => {
        const docRef = doc(db, "Groups", selectedGroup.group_Id + '');
        if (QuestionnaireType == 'cap1') {
            if (selectedGroup.evaluator1.facultyID == auth.currentUser.uid) {
                await updateDoc(docRef, {
                    'evaluator1.cap1': { reviews: { questions: cap1, recommend: recommend, comments: comments, status: true } }
                })
            } else {
                await updateDoc(docRef, {
                    'evaluator2.cap1': { reviews: { questions: cap1, recommend: recommend, comments: comments, status: true } }
                })
            }
        }
        if (QuestionnaireType == 'cap2') {
            if (selectedGroup.evaluator1.facultyID == auth.currentUser.uid) {
                await updateDoc(docRef, {
                    'evaluator1.cap2': { reviews: { questions: cap2, recommend: recommend, comments: comments, status: true } }
                })
            } else {
                await updateDoc(docRef, {
                    'evaluator2.cap2': { reviews: { questions: cap2, recommend: recommend, comments: comments, status: true } }
                })
            }
        }

        setSelectedGroup(null)
        setLoading(false)
    }

    const handleValueChange1 = (index, value) => {
        const updatedQuestions = [...cap1];
        updatedQuestions[index].value = value !== null ? value : 0;
        setCap1(updatedQuestions);
    };

    const handleValueChange2 = (index, value) => {
        const updatedQuestions = [...cap2];
        updatedQuestions[index].value = value !== null ? value : 0;
        setCap2(updatedQuestions);
    };


    if (!dataLoaded) {
        return (
            <LoadingIndicator />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>

                <View style={styles.Webheader}>
                    <View style={{ flex: 2, alignItems: 'center', flexDirection: 'row', }}>
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
                    <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.Webheading}>Evaluator Portal</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                            <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                        </TouchableOpacity>
                    </View>

                    {dropDown && (
                        <View style={styles.popup1}>
                            <ImageBackground source={require('../resources/bg1.jpg')} style={styles.WebbackgroundPopup}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        style={styles.profilePic}
                                        source={{ uri: data.pictureUrl }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                                </View>
                                <View style={{ margin: 10, paddingBottom: 20 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('AdvisorPortal', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Advisor Portal</Text>
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

                </View>
                <View style={{ flex: 9, backgroundColor: 'white',opacity:0.8 }}>


                    <RadioButtonGroup
                        containerStyle={{ flexDirection: "row", justifyContent: 'center', marginBottom: '3%' }}
                        selected={QuestionnaireType}
                        onSelected={(value) => setQuestionnaireType(value)}
                        onChangeText={console.log(QuestionnaireType)}
                        radioBackground="#244082"
                    >
                        <RadioButtonItem value="cap1" label="Capstone-I" style={{ marginLeft: 5 }} />
                        <RadioButtonItem
                            value="cap2"
                            label={
                                <Text>Capstone-II</Text>
                            }
                            style={{ marginLeft: 10 }}
                        />
                    </RadioButtonGroup>

                    {QuestionnaireType == 'cap1' ? (<View>

                        {cap1 && (
                            <View>
                                {(!groupDataCap1[0]) ? (
                                    <View>
                                        <Text style={styles.heading}>Currently Not Evaluating!</Text>
                                    </View>
                                ) : (<View>
                                    <Text style={styles.heading1}>Projects To Evaluate</Text>
                                    <FlatList
                                        data={groupDataCap1}
                                        renderItem={({ item }) => (
                                            <View style={styles.Weblist}>
                                                <View style={{flex: 7.5}}>
                                                    <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                                    <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                                    <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                                    <Text>Members: <Text>

                                                        {item.groupMembers.map((member, index) => (
                                                            <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                                {member.name}
                                                                {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                            </Text>
                                                        ))}
                                                    </Text></Text>
                                                </View>
                                                <View style={styles.meeting}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setSelectedGroup(item)
                                                        }}
                                                    >
                                                        <Text style={styles.loginbutton}>Evaluate</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    />
                                </View>)}
                            </View>
                        )}
                        


                    </View>) : QuestionnaireType == 'cap2' ? (<View>

                        {cap2 && (
                            <View>
                                    {(!groupDataCap2[0]) ? (
                                        <View>
                                            <Text style={styles.heading}>Currently Not Evaluating!</Text>
                                        </View>
                                    ) : (<View>
                                        <Text style={styles.heading1}>Projects To Evaluate</Text>

                                        <FlatList
                                            data={groupDataCap2}
                                            renderItem={({ item }) => (
                                                <View style={styles.Weblist}>
                                                    <View style={{ flex: 7.5 }}>
                                                        <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                                        <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                                        <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                                        <Text>Members: <Text>
                                                        
                                                        {item.groupMembers.map((member, index) => (
                                                            <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                                {member.name}
                                                                {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                            </Text>
                                                        ))}
                                                        </Text></Text>

                                                    </View>
                                                    <View style={styles.meeting}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedGroup(item)
                                                            }}
                                                        >
                                                            <Text style={styles.loginbutton}>Evaluate</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    </View>)}
                            </View>
                        )}

                    </View>) : (<View>
                        <Text style={styles.heading}>Select Capstone Type</Text>
                    </View>)}

                    {selectedGroup && (
                        <View style={styles.popup}>
                            <TouchableOpacity onPress={() => { setSelectedGroup(false) }}>
                                <Image source={require('../resources/cancel.jpg')} style={{ width: 20, height: 20, alignSelf: 'flex-end' }} />
                            </TouchableOpacity>
                            <Text>Project ID: {selectedGroup.group_Id}</Text>
                            <Text>Project Title: {selectedGroup.idea}</Text>
                            <Text></Text>

                            <ScrollView>
                                <Text style={{ textAlign: 'center', marginVertical: 5, marginBottom: 15, flex: 1, fontWeight: 'bold' }}>Score (5 is the highest score)</Text>

                                {QuestionnaireType == 'cap1' ? (
                                    <View>
                                        {cap1.map((question, index) => (
                                            <View key={index} style={styles.pickerContainer}>
                                                <Text style={styles.label}>{question.questionText}</Text>
                                                <Picker
                                                    selectedValue={question.value}
                                                    onValueChange={(value) => handleValueChange1(index, value)}
                                                    style={styles.picker}

                                                >
                                                    <Picker.Item label="0" value={0} />
                                                    <Picker.Item label="1" value={1} />
                                                    <Picker.Item label="2" value={2} />
                                                    <Picker.Item label="3" value={3} />
                                                    <Picker.Item label="4" value={4} />
                                                    <Picker.Item label="5" value={5} />
                                                </Picker>
                                            </View>
                                        ))}
                                    </View>
                                ) : QuestionnaireType == 'cap2' ? (
                                    <View>
                                        {cap2 != null ? (
                                            <View>
                                                {cap1.map((question, index) => (
                                                    <View key={index} style={styles.pickerContainer}>
                                                        <Text style={styles.label}>{question.questionText}</Text>
                                                        <Picker
                                                            selectedValue={question.value}
                                                            onValueChange={(value) => handleValueChange1(index, value)}
                                                            style={styles.picker}

                                                        >
                                                            <Picker.Item label="0" value={0} />
                                                            <Picker.Item label="1" value={1} />
                                                            <Picker.Item label="2" value={2} />
                                                            <Picker.Item label="3" value={3} />
                                                            <Picker.Item label="4" value={4} />
                                                            <Picker.Item label="5" value={5} />
                                                        </Picker>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <View>
                                                <Text>Questionnaire not Uploaded</Text>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View>

                                    </View>
                                )}

                                <Text style={styles.label}>Comments:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={comments}
                                    onChangeText={setComments}
                                    multiline
                                />

                                <View style={styles.checkboxContainer}>
                                    <Text style={styles.label}>Recommend for Competition:</Text>
                                    <Picker
                                        selectedValue={recommend}
                                        onValueChange={(value) => setRecommend(value)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="No" value={false} />
                                        <Picker.Item label="Yes" value={true} />
                                    </Picker>
                                </View>

                                <TouchableOpacity onPress={() => { handleSubmit() }} style={{ margin: 25, alignItems: 'center' }}>
                                    <Text style={styles.button}>Submit</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ImageBackground>
            ):(
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
                    <View style={{ flex: 4.5, alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={styles.heading}>Evaluator Portal</Text>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { setDropDown(!dropDown) }}>
                            <Image source={require('../resources/dropdown.png')} style={styles.drop} />
                        </TouchableOpacity>
                    </View>

                    {dropDown && (
                        <View style={styles.popup1}>
                            <ImageBackground source={require('../resources/bg1.jpg')} style={styles.backgroundPopup}>
                                <View style={{ alignItems: 'center' }}>
                                    <Image
                                        style={styles.profilePic}
                                        source={{ uri: data.pictureUrl }}
                                    />
                                    <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                                </View>
                                <View style={{ margin: 10, paddingBottom: 20 }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('AdvisorPortal', {
                                                FactData: data,
                                            });
                                        }}
                                    >
                                        <Text style={styles.dropText}>Advisor Portal</Text>
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

                </View>
                <View style={{ flex: 9, backgroundColor: 'lightgrey' }}>


                    <RadioButtonGroup
                        containerStyle={{ flexDirection: "row", justifyContent: 'center', marginBottom: '3%' }}
                        selected={QuestionnaireType}
                        onSelected={(value) => setQuestionnaireType(value)}
                        onChangeText={console.log(QuestionnaireType)}
                        radioBackground="#244082"
                    >
                        <RadioButtonItem value="cap1" label="Capstone-I" style={{ marginLeft: 5 }} />
                        <RadioButtonItem
                            value="cap2"
                            label={
                                <Text>Capstone-II</Text>
                            }
                            style={{ marginLeft: 10 }}
                        />
                    </RadioButtonGroup>

                    {QuestionnaireType == 'cap1' ? (<View>

                        {cap1 && (
                            <View>
                                {(!groupDataCap1[0]) ? (
                                    <View>
                                        <Text style={styles.heading}>Currently Not Evaluating!</Text>
                                    </View>
                                ) : (<View>
                                    <Text style={styles.heading1}>Projects To Evaluate</Text>
                                    <FlatList
                                        data={groupDataCap1}
                                        renderItem={({ item }) => (
                                            <View style={styles.list}>
                                                <View style={{flex: 7.5}}>
                                                    <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                                    <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                                    <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                                    <Text>Members: <Text>

                                                        {item.groupMembers.map((member, index) => (
                                                            <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                                {member.name}
                                                                {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                            </Text>
                                                        ))}
                                                    </Text></Text>
                                                </View>
                                                <View style={styles.meeting}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setSelectedGroup(item)
                                                        }}
                                                    >
                                                        <Text style={styles.loginbutton}>Evaluate</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    />
                                </View>)}
                            </View>
                        )}
                        


                    </View>) : QuestionnaireType == 'cap2' ? (<View>

                        {cap2 && (
                            <View>
                                    {(!groupDataCap2[0]) ? (
                                        <View>
                                            <Text style={styles.heading}>Currently Not Evaluating!</Text>
                                        </View>
                                    ) : (<View>
                                        <Text style={styles.heading1}>Projects To Evaluate</Text>

                                        <FlatList
                                            data={groupDataCap2}
                                            renderItem={({ item }) => (
                                                <View style={styles.list}>
                                                    <View style={{ flex: 7.5 }}>
                                                        <Text>Group ID: <Text style={{ color: 'rgb(110,110,110)' }}>{item.group_Id}</Text></Text>
                                                        <Text>Idea: <Text style={{ color: 'rgb(110,110,110)' }}>{item.idea}</Text></Text>
                                                        <Text>Leader: <Text style={{ color: 'rgb(110,110,110)' }}>{item.groupLeader}</Text></Text>
                                                        <Text>Members: <Text>
                                                        
                                                        {item.groupMembers.map((member, index) => (
                                                            <Text key={index} style={{ color: 'rgb(110,110,110)' }}>
                                                                {member.name}
                                                                {index < item.groupMembers.length - 1 ? ', ' : ''}
                                                            </Text>
                                                        ))}
                                                        </Text></Text>

                                                    </View>
                                                    <View style={styles.meeting}>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setSelectedGroup(item)
                                                            }}
                                                        >
                                                            <Text style={styles.loginbutton}>Evaluate</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        />
                                    </View>)}
                            </View>
                        )}

                    </View>) : (<View>
                        <Text style={styles.heading}>Select Capstone Type</Text>
                    </View>)}

                    {selectedGroup && (
                        <View style={styles.popup}>
                            <TouchableOpacity onPress={() => { setSelectedGroup(false) }}>
                                <Image source={require('../resources/cancel.jpg')} style={{ width: 20, height: 20, alignSelf: 'flex-end' }} />
                            </TouchableOpacity>
                            <Text>Project ID: {selectedGroup.group_Id}</Text>
                            <Text>Project Title: {selectedGroup.idea}</Text>
                            <Text></Text>

                            <ScrollView>
                                <Text style={{ textAlign: 'center', marginVertical: 5, marginBottom: 15, flex: 1, fontWeight: 'bold' }}>Score (5 is the highest score)</Text>

                                {QuestionnaireType == 'cap1' ? (
                                    <View>
                                        {cap1.map((question, index) => (
                                            <View key={index} style={styles.pickerContainer}>
                                                <Text style={styles.label}>{question.questionText}</Text>
                                                <Picker
                                                    selectedValue={question.value}
                                                    onValueChange={(value) => handleValueChange1(index, value)}
                                                    style={styles.picker}

                                                >
                                                    <Picker.Item label="0" value={0} />
                                                    <Picker.Item label="1" value={1} />
                                                    <Picker.Item label="2" value={2} />
                                                    <Picker.Item label="3" value={3} />
                                                    <Picker.Item label="4" value={4} />
                                                    <Picker.Item label="5" value={5} />
                                                </Picker>
                                            </View>
                                        ))}
                                    </View>
                                ) : QuestionnaireType == 'cap2' ? (
                                    <View>
                                        {cap2 != null ? (
                                            <View>
                                                {cap1.map((question, index) => (
                                                    <View key={index} style={styles.pickerContainer}>
                                                        <Text style={styles.label}>{question.questionText}</Text>
                                                        <Picker
                                                            selectedValue={question.value}
                                                            onValueChange={(value) => handleValueChange1(index, value)}
                                                            style={styles.picker}

                                                        >
                                                            <Picker.Item label="0" value={0} />
                                                            <Picker.Item label="1" value={1} />
                                                            <Picker.Item label="2" value={2} />
                                                            <Picker.Item label="3" value={3} />
                                                            <Picker.Item label="4" value={4} />
                                                            <Picker.Item label="5" value={5} />
                                                        </Picker>
                                                    </View>
                                                ))}
                                            </View>
                                        ) : (
                                            <View>
                                                <Text>Questionnaire not Uploaded</Text>
                                            </View>
                                        )}
                                    </View>
                                ) : (
                                    <View>

                                    </View>
                                )}

                                <Text style={styles.label}>Comments:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={comments}
                                    onChangeText={setComments}
                                    multiline
                                />

                                <View style={styles.checkboxContainer}>
                                    <Text style={styles.label}>Recommend for Competition:</Text>
                                    <Picker
                                        selectedValue={recommend}
                                        onValueChange={(value) => setRecommend(value)}
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="No" value={false} />
                                        <Picker.Item label="Yes" value={true} />
                                    </Picker>
                                </View>

                                <TouchableOpacity onPress={() => { handleSubmit() }} style={{ margin: 25, alignItems: 'center' }}>
                                    <Text style={styles.button}>Submit</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ImageBackground>
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        backgroundColor: 'black',
    },
    dropdownBtnStyle: {

        backgroundColor: 'lightgrey',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#444',
        margin: 15,
        alignSelf: 'center',
        width: 120
    },
    Webpopup1: {
        position: 'absolute',
        //height: '400%',
        width: wp(50),
        height: hp(25),
        zIndex: 1,
        right: 0,
        alignItems:'flex-start'
    },
    profilePic: {
        borderWidth: 1,
        height: 55,
        width: 55,
        margin: 10,
        borderRadius: 5000,
    },
    dropdownText: {
        fontSize: 14
    },
    drop: {
        height: 25,
        width: 25,
        marginRight: 10
    },
    dropdown1DropdownStyle: {
        backgroundColor: '#EFEFEF'
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
        zIndex: 1,
        borderBottomWidth: 1
    },
    Webheader: {
        flex: 1,
        backgroundColor:'white',
        opacity:0.8,
        flexDirection: 'row',
        marginVertical: 5,
        justifyContent: 'space-between',
        zIndex: 1,
        borderBottomWidth: 1
    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,


    },
    heading1: {
        padding: 15,
        fontSize: 15,
        textAlign: "center",
        // marginVertical: 5

    },
    Webheading1: {
        padding: 15,
        width: wp(40),
        fontSize: 15,
        textAlign: "center",
        marginVertical: 5
    },
    name: {
        margin: 20,
        fontSize: 24
    },

    list: {
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
   
    Weblist: {
        borderWidth: 1,
        width: wp(60),
        alignSelf:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    meeting: {
        justifyContent: 'center',
        flex: 2.5
    },
    Webheader: {
        flex: 1,
        backgroundColor: 'white',
        opacity: 0.8,

        flexDirection: 'row',
        //marginVertical: 5,
        //justifyContent: 'space-between',
        zIndex: 1,
        borderBottomWidth: 1
    },
    meetingButt: {
        borderWidth: 1,
        textAlign: 'center',
        padding: 5,
        margin: 3,
        borderColor: 'green',
        color: 'green'
    },
    evaluatorButt: {
        borderWidth: 1,
        textAlign: 'center',
        padding: 5,
        margin: 3,
        borderColor: 'red',
        color: 'red'
    },
    
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 0,
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),
    
    },
    popup: {
        position: 'absolute',
        top: '30%',
        left: 0,
        width: '100%',
        backgroundColor: '#FFF',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000',
        zIndex: 1,
        maxHeight: '50%'
    },
    popup1: {
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
    WebbackgroundPopup: {
        flex: 1,
        // resizeMode: 'stretch', // or 'stretch' or 'contain',
        height:hp(28),
        width: wp(25), 
        right: 0,
         position: 'absolute'
     },
    label: {
        marginBottom: 5,
        textAlignVertical: 'center',
        flex: 7
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 15
    },
    pickerContainer: {
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    background: {
        height: hp(100),
        width: wp(100),
        //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    picker: {
        height: 20,
        width: 100,
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 100,
        flex: 3
    },
    checkboxContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    button: {
        textAlign: 'center',
        borderWidth: 1,
        color: 'green',
        borderColor: 'green',
        paddingHorizontal: 5,
        paddingVertical: 2
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
      //  width:wp(25),
      //  height:hp(28),
        resizeMode: 'stretch', // or 'stretch' or 'contain',
        right: 0,
        position: 'absolute'
    },
    popup1: {
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
    popup1: {
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
})

export default TeacherPortalScreen;