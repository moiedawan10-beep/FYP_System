import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity,Platform, SafeAreaView, Image, ImageBackground, FlatList, ActivityIndicator, TextInput, Alert } from "react-native";
import { doc, getDoc, updateDoc, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { auth, db } from "../../FirebaseConfig";
import LoadingIndicator from "../Components/LoadingIndicator";
import CustomAlert from '../Components/CustomAlert';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const EditGroupScreen = ({ navigation }) => {
    const route = useRoute();
    const [data, setData] = useState(null);
    const [group_Id, setGroupId] = useState("" + route.params?.gId || "");
    const [currentUser, setCurrentUser] = useState("" + route.params?.currentUser || '');
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usersToRemove, setUsersToRemove] = useState([]);
    const [inProcess, setProcess] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('')

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useLayoutEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "Groups", group_Id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
                setMembers(docSnap.data().groupMembers || []);
                setLoading(false);
            } else {
                console.log("No such document!");
            }
        }
        getData();
    }, [loading]);

    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length > 2) {
                const q = query(collection(db, "Students"), where("name", ">=", searchQuery), where("name", "<=", searchQuery + '\uf8ff'));
                const querySnapshot = await getDocs(q);
                const results = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => user.Group_Id == null); 
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
        };
        searchUsers();
        console.log(searchResults);
    }, [searchQuery]);

    const leave = async () => {
        setProcess(true);
        const newMembers = members.filter(user => user.name !== currentUser);

        // Update the members state first and then perform Firestore operations
        setMembers(newMembers);

        // Perform Firestore updates in a separate function
        await handleFirestoreUpdates(newMembers);
    }

    const handleFirestoreUpdates = async (updatedMembers) => {
        const docRefUser = doc(db, "Students", auth.currentUser.uid);
        await updateDoc(docRefUser, {
            "Group_Id": null,
            "project_Id": null
        });

        if (currentUser === data.groupLeader) {
            const docRefGroup = doc(db, "Groups", group_Id);
                newLeader = updatedMembers[0]?.name || null
            await updateDoc(docRefGroup, {
                "groupLeader": newLeader,
                "groupMembers": updatedMembers
            });
            setError('Group updated');
            setShowAlert(true);

            navigation.navigate('StdInitial');
        } else {
            await saveData(updatedMembers);
            setError('Group updated');
            setShowAlert(true);

            navigation.navigate('StdInitial');
        }

        console.log(updatedMembers[0].name)
        setProcess(false);
    }

    const saveData = async (updatedMembers) => {
        setProcess(true);
        const docRefGroup = doc(db, "Groups", group_Id);
        await updateDoc(docRefGroup, {
            "groupMembers": updatedMembers
        });
        updateUserList();
    }

    const updateUserList = async () => {
        console.log('Users to remove:', usersToRemove); // Log the current state of usersToRemove

        if (usersToRemove.length > 0) { // Corrected the check for empty array
            try {
                const batch = writeBatch(db);

                // Iterate through selected users and add update operations to the batch
                usersToRemove.forEach((userId) => {
                    const userDocRef = doc(db, 'Students', userId);
                    console.log('Updating user:', userId); // Log each user ID being updated
                    batch.update(userDocRef, {
                        Group_Id: null,
                        project_Id: null
                    });
                });

                // Commit the batch
                await batch.commit();

                setError('Group successfully updated');
                setShowAlert(true);

            } catch (error) {
                console.error('Error updating users:', error);
            }
        } else {
            try {
                const batch = writeBatch(db);

                // Iterate through selected users and add update operations to the batch
                members.forEach((user) => {
                    const userDocRef = doc(db, 'Students', user.id);
                    console.log('Updating user:', user.id); // Log each user ID being updated
                    batch.update(userDocRef, {
                        Group_Id: parseInt(group_Id, 10)
                    });
                });

                // Commit the batch
                await batch.commit();

                setError('Group successfully updated');
                setShowAlert(true);

                navigation.navigate('StdInitial');
            } catch (error) {
                console.error('Error updating users:', error);
            }
        }
        setProcess(false);
    };

    const addMember = (newMember) => {
        if(members.length <= 3){
            if (!members.some(member => member.id === newMember.id)) {
                const tempMember = { email: newMember.email, id: newMember.StudentId, name: newMember.name }
                setMembers([...members, tempMember]);
                setSearchQuery("");
                setSearchResults([]);
            } else {
                setError('User is already a member of the group.');
                setShowAlert(true);

            }
        }
        else{
            setError('Max Limit Reached')
            setShowAlert(true);

        }
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
            {showAlert && (
                <CustomAlert
                    message={error}
                    //screenName="Main"
                    onClose={handleCloseAlert} // No screenName means it will just close
                />
            )}
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row',backgroundColor:'white',opacity:0.8, justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image style={styles.back} source={require('../resources/back.png')} />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Edit Group</Text>
                    </View>
                </View>

                <View style={styles.Webbox}>
                    <View>
                        <View style={{ marginHorizontal: 15,width:wp(40),alignSelf:'center', borderWidth: 1, borderColor: 'grey', }}>
                            <Text>Group Info</Text>
                            <Text style={{ color: 'grey' }}>Leader: {data.groupLeader}</Text>
                            <Text style={{ color: 'grey' }}>Group ID: {data.group_Id}</Text>
                            <Text style={{ color: 'grey' }}>Members: {members.length}</Text>
                        </View>
                        <TextInput
                            style={styles.Webinput}
                            placeholder="Search for users to add"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => addMember(item)}>
                                    <Text style={styles.WebsearchResult}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <FlatList
                            data={members}
                            keyExtractor={(members?.id)}
                            renderItem={({ item }) => (
                                <View style={{ width:wp(40),alignSelf:'center', flexDirection: 'row', marginHorizontal: 15, marginVertical: 5, borderWidth: 1, padding: 5 }}>
                                    {item.name === currentUser ? (
                                        <View style={{ flex: 9 }}>
                                            <Text>{item.name} <Text style={{ color: 'grey' }}>(You)</Text></Text>
                                        </View>
                                    ) : (
                                        <View style={{ flex: 9, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{item.name}</Text>
                                            {currentUser === data.groupLeader && (
                                                <TouchableOpacity onPress={() => {
                                                    setMembers(members.filter(user => user !== item));
                                                    setUsersToRemove([...usersToRemove, item.id]); // Use state setter to update usersToRemove
                                                    console.log('Users to remove:', usersToRemove);
                                                }}>
                                                    <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/cancel.jpg')} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                    <View style={{ alignSelf:'center',flexDirection: 'row', alignSelf: 'center', marginHorizontal: 25 }}>
                        <View>
                            <TouchableOpacity
                                style={styles.Webloginbutton}
                                onPress={() => { saveData(members) }}
                            >
                                <Text style={{ color: 'green', textAlign:'center'  }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {inProcess && (
                            <ActivityIndicator size="small" color="grey" />
                        )
                        }

                        <View>
                            <TouchableOpacity
                                style={styles.Webloginbutton1}
                                onPress={() => { leave() }}
                            >
                                <Text style={{ color: 'red', textAlign:'center'}}>Leave</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image style={styles.back} source={require('../resources/back.png')} />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Edit Group</Text>
                    </View>
                </View>

                <View style={styles.box}>
                    <View>
                        <View style={{ marginHorizontal: 15, marginVertical: 5, borderWidth: 1, borderColor: 'grey', padding: 5 }}>
                            <Text>Group Info</Text>
                            <Text style={{ color: 'grey' }}>Leader: {data.groupLeader}</Text>
                            <Text style={{ color: 'grey' }}>Group ID: {data.group_Id}</Text>
                            <Text style={{ color: 'grey' }}>Members: {members.length}</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Search for users to add"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => addMember(item)}>
                                    <Text style={styles.searchResult}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <FlatList
                            data={members}
                            keyExtractor={(members?.id)}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', marginHorizontal: 15, marginVertical: 5, borderWidth: 1, padding: 5 }}>
                                    {item.name === currentUser ? (
                                        <View style={{ flex: 9 }}>
                                            <Text>{item.name} <Text style={{ color: 'grey' }}>(You)</Text></Text>
                                        </View>
                                    ) : (
                                        <View style={{ flex: 9, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text>{item.name}</Text>
                                            {currentUser === data.groupLeader && (
                                                <TouchableOpacity onPress={() => {
                                                    setMembers(members.filter(user => user !== item));
                                                    setUsersToRemove([...usersToRemove, item.id]); // Use state setter to update usersToRemove
                                                    console.log('Users to remove:', usersToRemove);
                                                }}>
                                                    <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/cancel.jpg')} />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginHorizontal: 25 }}>
                        <View>
                            <TouchableOpacity
                                style={styles.loginbutton}
                                onPress={() => { saveData(members) }}
                            >
                                <Text style={{ color: 'green' }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {inProcess && (
                            <ActivityIndicator size="small" color="grey" />
                        )
                        }

                        <View>
                            <TouchableOpacity
                                style={styles.loginbutton1}
                                onPress={() => { leave() }}
                            >
                                <Text style={{ color: 'red' }}>Leave</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            )}
        </SafeAreaView>
    )
}

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
        flex: 1,
        resizeMode: 'stretch', // or 'stretch' or 'contain'
        opacity: 0.8,
    },
    input: {
        height: 40,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        marginHorizontal: 15,
        marginTop: 15
    },
    Webinput: {
        height: 40,
        width: wp(40),
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        marginHorizontal: 15,
        marginTop: 15,
        alignSelf:'center'
    },
    box: {
        backgroundColor: 'lightgrey',
        padding: 15,
        flex: 5,
        justifyContent: 'center'
    },
    Webbox: {
        backgroundColor: 'white',
        opacity:0.8,
        padding: 15,
        paddingTop: hp(10),
        flex: 5,
        justifyContent: 'center'
    },
    loginbutton: {
        padding: 5,
        paddingHorizontal: 30,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    loginbutton1: {
        padding: 5,
        paddingHorizontal: 30,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        color: 'red',
        margin: 25,
    },
    Webloginbutton1: {
        padding: 5,
        paddingHorizontal: 30,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        color: 'red',
        margin: 25,
        width:wp(10),
    },
    Webloginbutton: {
        padding: 5,
        paddingHorizontal: 30,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        color: 'red',
        margin: 25,
        width:wp(10),
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
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    button: {
        borderWidth: 1,
        padding: 5,
        fontSize: 12
    },
    meetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 12,
        alignSelf: 'flex-end',
        fontStyle: 'italic'
    },
    searchResult: {
        marginHorizontal: 25, 
        color: '#244082',
        marginBottom: 10
    },
    WebsearchResult: {
        width: wp(40),
        marginHorizontal: 25, 
        color: '#244082',
        marginBottom: 10,
        alignSelf:'center'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
});

export default EditGroupScreen;
