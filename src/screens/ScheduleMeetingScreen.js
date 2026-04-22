import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Linking, StyleSheet, Alert, Platform, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, FieldValue, arrayUnion, query, where, writeBatch } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from '../Components/LoadingIndicator';
import { SafeAreaView } from 'react-native-safe-area-context';


const ScheduleMeetingScreen = ({navigation}) => {
    const route = useRoute();
    const group = route.params?.group

    const [to, setTo] = useState('');
    const [cc, setCc] = useState('cod@gmail.com');
    const [bcc, setBcc] = useState('hod@gmail.com');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dataLoaded, setLoading] = useState(false)
    const [error,setError ]= useState('')

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            console.log(group)
            const querySnapshot = await getDocs(collection(db, "Students"));
            let temp = ''
            querySnapshot.forEach((doc) => {
                if (doc.data().Group_Id == group) {
                    if (temp == '') {
                        temp = doc.data().email
                    }
                    else {
                        temp = temp + ',' + doc.data().email
                    }
                }
            });
            setTo(temp);
            setLoading(true)
        }
        getData()
        console.log(to)
    }, [dataLoaded])

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || date;
        setShowTimePicker(Platform.OS === 'ios');
        setDate(currentTime);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const formatDate = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + strTime;
    };

    const sendEmail = () => {
        const email = to.trim();
        const ccEmails = cc.trim();
        const bccEmails = bcc.trim();
        const emailSubject = encodeURIComponent(subject.trim());
        const emailBody = encodeURIComponent(`${body.trim()} \n\n Meeting Date and Time: ${formatDate(date)}`);

        let emailUrl = `mailto:${email}`;

        const params = [];

        if (ccEmails) {
            params.push(`cc=${ccEmails}`);
        }
        if (bccEmails) {
            params.push(`bcc=${bccEmails}`);
        }
        if (emailSubject) {
            params.push(`subject=${emailSubject}`);
        }
        if (emailBody) {
            params.push(`body=${emailBody}`);
        }

        if (params.length > 0) {
            emailUrl += `?${params.join('&')}`;
        }

        Linking.openURL(emailUrl)
            .catch(err => {
                console.error('Error sending email:', err);
                setError('Error', 'No email client is installed on this device.');
                setShowAlert(true);
            });
    };

    if (!dataLoaded) {
        <LoadingIndicator />
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',backgroundColor:'white',opacity:0.8, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%', }}>
                        <Text style={styles.Webheading}>Schedule Meeting</Text>
                    </View>
                </View>
                <View style={styles.Webcontainer}>
                    <TextInput
                        style={styles.Webinput}
                        placeholder="To (comma separated)"
                        value={to}
                        onChangeText={setTo}
                    />
                    <TextInput
                        style={styles.Webinput}
                        placeholder="CC (comma separated)"
                        value={cc}
                        onChangeText={setCc}
                    />
                    <TextInput
                        style={styles.Webinput}
                        placeholder="BCC (comma separated)"
                        value={bcc}
                        onChangeText={setBcc}
                    />
                    <TextInput
                        style={styles.Webinput}
                        placeholder="Subject"
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <TextInput
                        style={styles.WebinputBody}
                        placeholder="Body"
                        value={body}
                        onChangeText={setBody}
                        multiline
                    />
                    <View style={{ flexDirection: 'row',alignItems:'center',alignSelf:'center' }}>
                        <Text>Selected Date and Time: </Text>
                        <Text style={styles.meetingTime}>{formatDate(date)}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={showDatepicker}>
                            <Text style={[styles.loginbutton, { color: 'white', backgroundColor: '#244082' }]}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker}>
                            <Text style={[styles.loginbutton, { color: 'white', backgroundColor: '#244082'}]}>Select Time</Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                            
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={sendEmail}>
                        <Text style={styles.loginbutton}>Send Email</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            ):(
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%', }}>
                        <Text style={styles.heading}>Schedule Meeting</Text>
                    </View>
                </View>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="To (comma separated)"
                        value={to}
                        onChangeText={setTo}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="CC (comma separated)"
                        value={cc}
                        onChangeText={setCc}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="BCC (comma separated)"
                        value={bcc}
                        onChangeText={setBcc}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Subject"
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <TextInput
                        style={styles.inputBody}
                        placeholder="Body"
                        value={body}
                        onChangeText={setBody}
                        multiline
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <Text>Selected Date and Time: </Text>
                        <Text style={styles.meetingTime}>{formatDate(date)}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={showDatepicker}>
                            <Text style={[styles.loginbutton, { color: 'white', backgroundColor: '#244082' }]}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker}>
                            <Text style={[styles.loginbutton, { color: 'white', backgroundColor: '#244082'}]}>Select Time</Text>
                        </TouchableOpacity>
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                    {showTimePicker && (
                        <DateTimePicker
                            value={date}
                            mode="time"
                            display="default"
                            onChange={handleTimeChange}
                        />
                    )}
                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={sendEmail}>
                        <Text style={styles.loginbutton}>Send Email</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            )}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'lightgrey',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    Webcontainer: {
        padding: 20,
        backgroundColor: 'white',
        opacity:0.8,
        flex: 1,
        justifyContent: 'space-evenly'
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
    },
    Webinput: {
        height: 40,
        width:wp(40),
        alignSelf:'center',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    inputBody: {
        height: 150,
        maxHeight: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    WebinputBody: {
        
        width:wp(40),
        alignSelf:'center',
        height: 150,
        maxHeight: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20,
        margin: 10
    },
    button: {
        borderWidth: 1,
        padding: 5,
        fontSize: 12
    },
    buttonSend: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 7,
        borderColor: 'green',
        color: 'green'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    meetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 12,
        alignSelf: 'flex-end',
        fontStyle: 'italic'
    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 10,
        marginHorizontal: 50,
        paddingHorizontal: 12
    },
    background: {
        height: hp(100),
        width: wp(100),
      //  resizeMode: 'stretch', // or 'stretch' or 'contain'
        justifyContent: 'center',
        opacity: 0.8,
    },
});

export default ScheduleMeetingScreen;
