import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text,Platform, Image, ImageBackground, TouchableOpacity, Button } from 'react-native';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CustomAlert from '../Components/CustomAlert';



const EditCounsellingScreen = ({ navigation }) => {
    const [monFrom, setMonFrom] = useState('00');
    const [tueFrom, setTueFrom] = useState('00');
    const [wedFrom, setWedFrom] = useState('00');
    const [thuFrom, setThuFrom] = useState('00');
    const [friFrom, setFriFrom] = useState('00');
    const [satFrom, setSatFrom] = useState('00');

    const [monTo, setMonTo] = useState('00');
    const [tueTo, setTueTo] = useState('00');
    const [wedTo, setWedTo] = useState('00');
    const [thuTo, setThuTo] = useState('00');
    const [friTo, setFriTo] = useState('00');
    const [satTo, setSatTo] = useState('00')

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    const handleSave = async () => {
        const schedule = {
            Monday: monFrom + ":00 - " + monTo + ":00",
            Tuesday: tueFrom + ":00 - " + tueTo + ":00",
            Wednesday: wedFrom + ":00 - " + wedTo + ":00",
            Thursday: thuFrom + ":00 - " + thuTo + ":00",
            Friday: friFrom + ":00 - " + friTo + ":00",
            Saturday: satFrom + ":00 - " + satTo + ":00",
        };
        console.log(schedule);

        const docRef = doc(db, "Faculty", auth.currentUser.uid);
        await updateDoc(docRef, {
            "hours": schedule,
        }).then(navigation.navigate('ProfileFaculty'))
    };

    return (
        <View style={styles.container}>
            {Platform.OS === 'web' ? (

            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around',backgroundColor:'white',opacity:0.8, alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%', }}>
                        <Text style={styles.Webheading}>Counselling Hours</Text>
                    </View>
                </View>
                <View style={{flex:1,justifyContent: 'center', backgroundColor: 'white',opacity:0.8, padding: 10 }}>
                    <View style={{width:wp(50), alignSelf:'center'}}>
                    <View >
                        <Text style={{ alignSelf: 'center', fontSize: 14, marginTop: 10 }}>Enter in 24 hour style</Text>
                        <Text style={[styles.label, { marginTop: 20 }]}>Monday</Text>
                    </View>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={monFrom} onChangeText={setMonFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={monTo} onChangeText={setMonTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Tuesday</Text>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={tueFrom} onChangeText={setTueFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={tueTo} onChangeText={setTueTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Wednesday</Text>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={wedFrom} onChangeText={setWedFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={wedTo} onChangeText={setWedTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Thursday</Text>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={thuFrom} onChangeText={setThuFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={thuTo} onChangeText={setThuTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Friday</Text>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={friFrom} onChangeText={setFriFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={friTo} onChangeText={setFriTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Saturday</Text>
                    <View style={styles.Webrow}>
                        <TextInput style={styles.input} value={satFrom} onChangeText={setSatFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={satTo} onChangeText={setSatTo} placeholder="To" keyboardType="numeric" />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                        <View style={{ width: "55%" }}>
                            <TouchableOpacity style={styles.Webloginbutton} onPress={handleSave}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </View>
            </ImageBackground>
            ) :(
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%', }}>
                        <Text style={styles.heading}>Counselling Hours</Text>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'lightgrey', padding: 10 }}>
                    <View>
                        <Text style={{ alignSelf: 'center', fontSize: 14, marginTop: 10 }}>Enter in 24 hour style</Text>
                        <Text style={[styles.label, { marginTop: 20 }]}>Monday</Text>
                    </View>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={monFrom} onChangeText={setMonFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={monTo} onChangeText={setMonTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Tuesday</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={tueFrom} onChangeText={setTueFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={tueTo} onChangeText={setTueTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Wednesday</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={wedFrom} onChangeText={setWedFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={wedTo} onChangeText={setWedTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Thursday</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={thuFrom} onChangeText={setThuFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={thuTo} onChangeText={setThuTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Friday</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={friFrom} onChangeText={setFriFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={friTo} onChangeText={setFriTo} placeholder="To" keyboardType="numeric" />
                    </View>

                    <Text style={styles.label}>Saturday</Text>
                    <View style={styles.row}>
                        <TextInput style={styles.input} value={satFrom} onChangeText={setSatFrom} placeholder="From" keyboardType="numeric" />
                        <TextInput style={styles.input} value={satTo} onChangeText={setSatTo} placeholder="To" keyboardType="numeric" />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                        <View style={{ width: "55%" }}>
                            <TouchableOpacity style={styles.loginbutton} onPress={handleSave}>
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    label: {
        marginBottom: 5,
        fontSize: 16,
    },
    
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    Webloginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
        width: wp(15),
        alignSelf:'center',
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '45%'
    },
    button: {
        marginTop: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    Webrow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: wp(50),
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
});

export default EditCounsellingScreen;
