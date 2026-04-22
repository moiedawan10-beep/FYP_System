import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View,Platform, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image, ImageBackground } from "react-native";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { db, auth } from "../../FirebaseConfig";
import CustomAlert from '../Components/CustomAlert';
import DropDownPicker from "react-native-dropdown-picker";

const ProfileFacultyScreen = ({ navigation }) => {
    const [data, setData] = useState({});
    const [fullImage, setFullImage] = useState(false);
    const [name, setName] = useState("")

    //dropdown
    const [area1, setArea1] = useState(null)
    const [open1, setOpen1] = useState(false)

    const [area2, setArea2] = useState(null)
    const [open2, setOpen2] = useState(false)

    const [area3, setArea3] = useState(null)
    const [open3, setOpen3] = useState(false)

    const [categories, setCategories] = useState([
        { label: 'Application Development', value: 'Application Development' },
        { label: 'Web Development', value: 'Web Development' },
        { label: 'Information Security', value: 'Information Security' },
        { label: 'Cryptography', value: 'Cryptography' },
    ])

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
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getData()
        console.log(data)
        setName(data.name)
    }, [])

    const updateData = async () => {
        const docRef = doc(db, "Faculty", auth.currentUser.uid);
        await updateDoc(docRef, {
            "name": name,
            "interest_area_1": area1,
            "interest_area_2": area2,
            "interest_area_3": area3,
        })
    }


    const back = "<-"

    if (fullImage == true) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <TouchableOpacity style={{ justifyContent: 'flex-end' }} onPress={() => { setFullImage(false) }}>
                    <View style={{ opacity: 1 }}>
                        <Image
                            source={require('../resources/cancel.jpg')}
                            style={{ height: 30, width: 30 }}
                        />
                    </View>
                </TouchableOpacity>

                <View style={{ flex: 1 }}>
                    <Image
                        source={{ uri: data.pictureUrl }}
                        style={{
                            flex: 1,
                            width: 400,
                            height: 400,
                            resizeMode: 'contain'
                        }}
                    />
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{
                    flexDirection: 'row',backgroundColor:'white',opacity:0.8, justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Personal Details</Text>
                    </View>
                </View>


                <View style={{  flex: 1, backgroundColor: 'white',opacity:0.8 }}>
                    <View style={{  padding: 10, paddingTop: 35 }}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { setFullImage(true) }}>
                                <Image
                                    style={styles.profilePic}
                                    source={{ uri: data.pictureUrl }}
                                //source={require('../resources/default-icon.jpg')}
                                />
                            </TouchableOpacity>
                            <Text style={{ margin: 10 }}>{data.name}</Text>
                        </View>
                        <Text style={[styles.titles, { borderWidth: 2, width:wp(40), alignSelf:'center', padding: 5 }]}>ID:  {data.facultyID}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, width:wp(40), alignSelf:'center', padding: 5 }]}>Email:  {data.email}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, width:wp(40), alignSelf:'center', padding: 5 }]}>Current Active Projects:  {5 - data.project_counter}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, width:wp(40), alignSelf:'center', padding: 5 }]}>Active Chats:  {data.chats?.length}</Text>

                        <View style={{ borderWidth: 2, width:wp(40), alignSelf:'center', }}>
                            <Text style={{ margin: 20, fontWeight: 'bold' }}>Interest Areas</Text>
                            <Text style={styles.titles}>Interest Area 1:  {data.interest_area_1}</Text>
                            <Text style={styles.titles}>Interest Area 2:  {data.interest_area_2}</Text>
                            <Text style={styles.titles}>Interest Area 3:  {data.interest_area_3}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Edit') }} style={styles.imageView}>
                    <Image
                        source={require('../resources/edit_profile.jpg')}
                        style={styles.edit}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('EditCounselling') }} style={styles.imageView2}>
                    <Image
                        source={require('../resources/edit-time.png')}
                        style={styles.edit2}
                    />
                </TouchableOpacity>
            </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{
                    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Personal Details</Text>
                    </View>
                </View>


                <View style={{  flex: 1, backgroundColor: 'lightgrey' }}>
                    <View style={{  padding: 10, paddingTop: 35 }}>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { setFullImage(true) }}>
                                <Image
                                    style={styles.profilePic}
                                    source={{ uri: data.pictureUrl }}
                                //source={require('../resources/default-icon.jpg')}
                                />
                            </TouchableOpacity>
                            <Text style={{ margin: 10 }}>{data.name}</Text>
                        </View>
                        <Text style={[styles.titles, { borderWidth: 2, padding: 5 }]}>ID:  {data.facultyID}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, padding: 5 }]}>Email:  {data.email}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, padding: 5 }]}>Current Active Projects:  {5 - data.project_counter}</Text>
                        <Text style={[styles.titles, { borderWidth: 2, padding: 5 }]}>Active Chats:  {data.chats?.length}</Text>

                        <View style={{ borderWidth: 2 }}>
                            <Text style={{ margin: 20, fontWeight: 'bold' }}>Interest Areas</Text>
                            <Text style={styles.titles}>Interest Area 1:  {data.interest_area_1}</Text>
                            <Text style={styles.titles}>Interest Area 2:  {data.interest_area_2}</Text>
                            <Text style={styles.titles}>Interest Area 3:  {data.interest_area_3}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate('Edit') }} style={styles.imageView}>
                    <Image
                        source={require('../resources/edit_profile.jpg')}
                        style={styles.edit}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('EditCounselling') }} style={styles.imageView2}>
                    <Image
                        source={require('../resources/edit-time.png')}
                        style={styles.edit2}
                    />
                </TouchableOpacity>
            </ImageBackground>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        borderWidth: 2,

    },
    heading: {
        fontSize: 25,
        textAlign: "center",
        fontWeight: 'bold',
        marginVertical: 5,
    },
    subHeading: {
        fontSize: 10,
        textAlign: "center",
        marginVertical: 7
    },
    input: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
    },
    noChange: {
        borderWidth: 1,
        padding: 15,
        margin: 10,
        color: 'lightgrey',
        borderColor: 'grey'
    },
    titles: {
        margin: 10,
        color: 'black'
    },
    profilePic: {
        height: 100,
        width: 100,
        borderRadius: 1000,
        resizeMode: 'contain',
    }, edit: {
        height: 60,
        width: 60,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "black"
    },
    edit2: {
        height: 60,
        width: 60,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "black",

    },
    imageView: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 15,
        right: 15,
    },
    imageView2: {
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 80,
        right: 15,
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
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
});

export default ProfileFacultyScreen;