import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Linking, StyleSheet, Alert, Platform, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { collection, addDoc, doc, getDoc, getDocs, updateDoc, FieldValue, arrayUnion, query, where, writeBatch } from "firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { auth, db } from "../../FirebaseConfig";
import CustomAlert from '../Components/CustomAlert';
import LoadingIndicator from '../Components/LoadingIndicator';


const RequestMeeting = ({navigation}) => {
    const route = useRoute();
    const id = route.params?.id

    const [to, setTo] = useState('');
    const [cc, setCc] = useState('cod@gmail.com');
    const [bcc, setBcc] = useState('hod@gmail.com');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dataLoaded, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "Faculty", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // console.log("Document data:", docSnap.data().email);
                setTo(docSnap.data().email);
                setLoading(true)
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
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
        <View style={styles.container}>
            {showAlert && (
                <CustomAlert
                    message={error}
                    //screenName="Main"
                    onClose={handleCloseAlert} // No screenName means it will just close
                />
            )}
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row',backgroundColor:'white',opacity:0.8, justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Request Meeting</Text>
                    </View>
                </View>
                <View style={styles.Webbox} >
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
                    <View style={{ flexDirection: 'row',alignSelf:'center' }}>
                        <Text style={{textAlign:'center',alignSelf:'center'}}>Selected Date and Time: </Text>
                        <Text style={styles.WebmeetingTime}>{formatDate(date)}</Text>
                    </View>
                    <View style={styles.WebbuttonContainer}>
                        <TouchableOpacity onPress={showDatepicker}>
                            <Text style={styles.Webbutton}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker}>
                            <Text style={styles.Webbutton}>Select Time</Text>
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
                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <View style={{ width: "55%"}}>
                        <TouchableOpacity onPress={sendEmail}>
                            <Text style={styles.Webloginbutton}>Send Email</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </ImageBackground >
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
                        <Text style={styles.heading}>Request Meeting</Text>
                    </View>
                </View>
                <View style={styles.box} >
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
                            <Text style={styles.button}>Select Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker}>
                            <Text style={styles.button}>Select Time</Text>
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
                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                    <View style={{ width: "55%"}}>
                        <TouchableOpacity onPress={sendEmail}>
                            <Text style={styles.loginbutton}>Send Email</Text>
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
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    Webinput: {
        height: 40,
        width: wp(40),
        borderColor: 'gray',
        alignSelf:'center',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    box: {
        borderWidth: 1,
        backgroundColor: 'lightgrey',
        padding: 15,
        flex: 1,
        justifyContent: 'center'
    },
    Webbox: {
        borderWidth: 1,
        backgroundColor: 'white',
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        opacity: 0.8
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
    inputBody: {
        height: 150,
        maxHeight: 200,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
    },
    WebinputBody: {
        height: 150,
        maxHeight: 200,
        borderColor: 'gray',
        width: wp(40),
alignSelf:'center',
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
    WebbuttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        margin: 10
    },
    button: {
        borderWidth: 1,
        padding: 5,
        fontSize: 12
    },
    Webbutton: {
        borderWidth: 1,
        padding: 5,
        fontSize: 12,
        alignSelf:'center',
        marginHorizontal:100
    },
    loginbutton: {
        padding: 10,
        borderWidth: 1,
        alignItems: 'center',
        textAlign:'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    Webloginbutton: {
        padding: 10,
        borderWidth: 1,
        alignSelf: 'center',
        textAlign:'center',
        borderRadius: 100,
        width: wp(20),
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
    meetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 12,
        alignSelf: 'flex-end',
        fontStyle: 'italic'
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    WebmeetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        paddingHorizontal:40,
        fontSize: 12,
        alignSelf: 'center',
        
        textAlign:'center',
        fontStyle: 'italic'
    }
});

export default RequestMeeting;
