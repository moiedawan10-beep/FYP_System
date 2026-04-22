import React, { useState, useEffect } from "react";
import { StyleSheet, Text, Platform, View, TextInput, TouchableOpacity, SafeAreaView, Image, ImageBackground, FlatList, Alert, ActivityIndicator } from "react-native";
import { collection, doc, getDocs, updateDoc, setDoc } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { auth, db } from "../../FirebaseConfig";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from "../Components/LoadingIndicator";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const GroupRegistrationScreen = ({ navigation }) => {

    const [data, setData] = useState(null);
    const [stdData, setStdData] = useState(null);
    const [error, setError] = useState('')

    const [searchInput, setSearchInput] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selected, setSelected] = useState([]);
    const [saveStatus, setStatus] = useState(false);
    const [inProgress, setProgress] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getStdData = async () => {
            const querySnapshot = await getDocs(collection(db, "Students"));
            const temp = [];
            querySnapshot.forEach((doc) => {
                if (doc.id == auth.currentUser.uid) {
                    setData(doc.data());
                } else {
                    if (doc.data().Group_Id == null) {
                        temp.push({
                            name: doc.data().name,
                            email: doc.data().email,
                            id: doc.data().StudentId,
                        });
                    }
                }
            });
            setStdData(temp);
        }
        getStdData();
    }, []);

    useEffect(() => {
        if (stdData && searchInput !== '') {
            const filteredResults = stdData.filter(item => {
                const emailMatch = item.email && item.email.toLowerCase().includes(searchInput.toLowerCase());
                return emailMatch;
            });
            setFilteredData(filteredResults);
        } else {
            setFilteredData([]);
        }
    }, [searchInput, stdData]);

    const selectUsers = (item) => {
        const isSelected = selected.find(selectedItem => selectedItem.id === item.id);
        if (!isSelected) {
            if (selected.length < 3) {
                setSelected(prevSelected => [...prevSelected, item]);
            } else {
                set('Max Number Reached');
                setShowAlert(true);
            }
        }
        console.log(selected);
    };

    const removeSelectedUser = (item) => {
        const updatedSelected = selected.filter(selectedItem => selectedItem.id !== item.id);
        setSelected(updatedSelected);
    };

    const resetList = () => {
        setSelected([]);
    };

    const saveData = async () => {
        setProgress(true);
        let random = Math.round(500000 + Math.random() * (500000 - 300000));
        if (selected.length === 0) {
            setError("Not enough members to register");
            setShowAlert(true);
            setProgress(false);
            return;
        } else {
            for (let i = 0; i < selected.length; i++) {
                const docRef = doc(db, "Students", selected[i].id);
                await updateDoc(docRef, {
                    "Group_Id": random,
                    "project_Id": random,
                    "message": 'Request to join the group by: ' + data.name,
                });
            }
            const docRef = doc(db, "Students", auth.currentUser.uid);
            await updateDoc(docRef, {
                "Group_Id": random,
                "project_Id": random
            });
            registerGroup(random);
        }
    };

    const registerGroup = async (ref) => {
        let members = [{ name: data.name, id: data.StudentId, email: data.email }];
        for (let i = 0; i < selected.length; i++) {
            members.push(selected[i]);
        }
        await setDoc(doc(db, "Groups", ref + ""), {
            group_Id: ref + "",
            groupMembers: members,
            idea: null,
            previousIdeas: null,
            groupLeader: data.name,
            advisor: null,
            status: false,
        });
        setError('Group Registered');
        setShowAlert(true);
        setProgress(false);
        navigation.navigate('StdInitial')
    };

    if (!data) {
        return (
            <LoadingIndicator />
        );
    }

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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', opacity: 0.8, alignItems: 'center', borderBottomWidth: 1 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.Webheading}>Group Registration  </Text>
                        </View>
                    </View>
                    <View style={{opacity:0.8, flex:1,paddingTop:hp(20),backgroundColor:'white'}}>
                    <View style={{ backgroundColor: 'white' }}>
                        <TextInput
                            placeholder="Search by email"
                            value={searchInput}
                            onChangeText={text => {
                                setSearchInput(text);
                            }}
                            style={styles.Websearch}
                        />
                    </View>
                    <View style={{ backgroundColor: 'white', flex: 1 }}>
                        <View style={{ marginHorizontal: 15, maxHeight: '30%' }}>
                            {filteredData.length > 0 ? (
                                <FlatList
                                    data={filteredData}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={{ borderWidth: 1 }} onPress={() => {
                                            selectUsers(item);
                                        }}>
                                            <View style={{ margin: 5, width: wp(40) }}>
                                                <Text>{item.name}</Text>
                                                <Text>{item.email}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <Text style={{ color: 'white', borderWidth: 0 }}>. . .</Text>
                            )}
                        </View>

                        <Text style={{ marginVertical: 15, marginHorizontal: 20,alignSelf:'center', fontWeight: 'bold', width: wp(40), }}>Selected People</Text>

                        <View>
                            <View style={{ marginHorizontal: 15, marginVertical: 5, borderWidth: 1, width: wp(40), borderColor: 'grey',alignSelf:'center', padding: 5 }}>
                                <Text style={{ color: 'grey' }}>{data.name} (Leader)</Text>
                                <Text style={{ color: 'grey' }}>{data.email}</Text>
                            </View>
                            {selected.length > 0 ? (
                                <FlatList
                                    data={selected}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <View style={{ flexDirection: 'row', marginHorizontal: 15, width: wp(40), alignSelf:'center', marginVertical: 5, borderWidth: 1, padding: 5 }}>
                                            <View style={{ flex: 9 }}>
                                                <Text>{item.name}</Text>
                                                <Text>{item.email}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignSelf: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}>
                                                <TouchableOpacity onPress={() => {
                                                    removeSelectedUser(item);
                                                }}>
                                                    <Image
                                                        source={require('../resources/cancel.jpg')} style={styles.img}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                            ) : (
                                <Text></Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            {inProgress && (
                                <ActivityIndicator size="small" color="grey" />
                            )}
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => { saveData(); }}
                            >
                                <Text style={{ padding: 5, marginHorizontal: 30,textAlign:'center', alignSelf: 'center', width: wp(10), fontSize: 16 }}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => { resetList(); }}
                            >
                                <Text style={{ padding: 5, marginHorizontal: 30, fontSize: 16,textAlign:'center', alignSelf: 'center', width: wp(10) }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
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
                            <Text style={styles.heading}>Group Registration  </Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: 'lightgrey' }}>
                        <TextInput
                            placeholder="Search by email"
                            value={searchInput}
                            onChangeText={text => {
                                setSearchInput(text);
                            }}
                            style={styles.search}
                        />
                    </View>
                    <View style={{ backgroundColor: 'lightgrey', flex: 1 }}>
                        <View style={{ marginHorizontal: 15, maxHeight: '30%' }}>
                            {filteredData.length > 0 ? (
                                <FlatList
                                    data={filteredData}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity style={{ borderWidth: 1 }} onPress={() => {
                                            selectUsers(item);
                                        }}>
                                            <View style={{ margin: 5 }}>
                                                <Text>{item.name}</Text>
                                                <Text>{item.email}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            ) : (
                                <Text style={{ color: 'grey', borderWidth: 0 }}>. . .</Text>
                            )}
                        </View>

                        <Text style={{ marginVertical: 15, marginHorizontal: 20, fontWeight: 'bold' }}>Selected People</Text>

                        <View>
                            <View style={{ marginHorizontal: 15, marginVertical: 5, borderWidth: 1, borderColor: 'grey', padding: 5 }}>
                                <Text style={{ color: 'grey' }}>{data.name} (Leader)</Text>
                                <Text style={{ color: 'grey' }}>{data.email}</Text>
                            </View>
                            {selected.length > 0 ? (
                                <FlatList
                                    data={selected}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) => (
                                        <View style={{ flexDirection: 'row', marginHorizontal: 15, marginVertical: 5, borderWidth: 1, padding: 5 }}>
                                            <View style={{ flex: 9 }}>
                                                <Text>{item.name}</Text>
                                                <Text>{item.email}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignSelf: 'center', alignItems: 'flex-end', paddingHorizontal: 10 }}>
                                                <TouchableOpacity onPress={() => {
                                                    removeSelectedUser(item);
                                                }}>
                                                    <Image
                                                        source={require('../resources/cancel.jpg')} style={styles.img}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                />
                            ) : (
                                <Text></Text>
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            {inProgress && (
                                <ActivityIndicator size="small" color="grey" />
                            )}
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => { saveData(); }}
                            >
                                <Text style={{ padding: 5, marginHorizontal: 20, fontSize: 16 }}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => { resetList(); }}
                            >
                                <Text style={{ padding: 5, marginHorizontal: 20, fontSize: 16 }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    search: {
        borderWidth: 1,
        padding: 5,
        fontSize: 16,
        margin: 15,
        color: 'grey',
    },
    Websearch: {
        borderWidth: 1,
        padding: 5,
        fontSize: 16,
        margin: 15,
        color: 'grey',
        width: wp(40),
        alignSelf: 'center',
    },
    img: {
        height: 25,
        width: 25,
    },
    background: {
        flex: 1,
        resizeMode: 'stretch',
        opacity: 0.8,
    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    heading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold'
    },
    loginbutton: {
        padding: 5,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    background: {
        height: hp(100),
        width: wp(100),
        //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
});

export default GroupRegistrationScreen;
