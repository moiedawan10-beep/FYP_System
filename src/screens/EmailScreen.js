import React, { useState } from 'react';
import { View, TextInput, Button, Linking, StyleSheet, Alert, Text, Image,Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import CustomAlert from '../Components/CustomAlert';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const EmailScreen = ({ navigation }) => {
    const [to, setTo] = useState('');
    const [cc, setCc] = useState('cordinator@gmail.com');
    const [bcc, setBcc] = useState('cod@gmail.com');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState('')
    
    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    const sendEmail = () => {
        const email = to.trim();
        const ccEmails = cc.trim();
        const bccEmails = bcc.trim();
        const emailSubject = encodeURIComponent(subject.trim());
        const emailBody = encodeURIComponent(body.trim());

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
                setError('Error No email client is installed on this device.');
                setShowAlert(true);
            });
    };

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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',backgroundColor:'white',opacity:0.8, borderBottomWidth: 1 }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%', }}>
                        <Text style={styles.Webheading}>Generate Email   </Text>
                    </View>
                </View>


                <View style={styles.Webbox}>
                    <View>
                    <Text style={{width:wp(40),alignSelf:'center', margin:10}}>To</Text>
                    <TextInput
                        style={styles.Webinput}
                        placeholder="(comma separated)"
                        value={to}
                        onChangeText={setTo}
                    />
                    <Text style={{width:wp(40),alignSelf:'center', margin:10}}>CC</Text>
                    <TextInput
                        style={styles.Webinput}
                        placeholder="(comma separated)"
                        value={cc}
                        onChangeText={setCc}
                    />
                    <Text style={{width:wp(40),alignSelf:'center', margin:10}}>BCC</Text>
                    <TextInput
                        style={styles.Webinput}
                        placeholder="(comma separated)"
                        value={bcc}
                        onChangeText={setBcc}
                    />
                    <Text style={{width:wp(40),alignSelf:'center', margin:10}}>Subject</Text>
                    <TextInput
                        style={styles.Webinput}
                        value={subject}
                        onChangeText={setSubject}
                    />
                    <Text style={{width:wp(40),alignSelf:'center', margin:10}}>Body</Text>
                    <TextInput
                        style={[styles.Webinput, { height: '20%' }]}
                        value={body}
                        onChangeText={setBody}
                        multiline

                    />
                    </View>

                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={sendEmail}>
                        <Text style={styles.Webbutton}>Send Mail</Text>
                    </TouchableOpacity>

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
                        <Text style={styles.heading}>Generate Email   </Text>
                    </View>
                </View>


                <View style={styles.box}>
                    <Text>To</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="(comma separated)"
                        value={to}
                        onChangeText={setTo}
                    />
                    <Text>CC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="(comma separated)"
                        value={cc}
                        onChangeText={setCc}
                    />
                    <Text>BCC</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="(comma separated)"
                        value={bcc}
                        onChangeText={setBcc}
                    />
                    <Text>Subject</Text>
                    <TextInput
                        style={styles.input}
                        value={subject}
                        onChangeText={setSubject}
                    />
                    <Text>Body</Text>
                    <TextInput
                        style={[styles.input, { height: '20%' }]}
                        value={body}
                        onChangeText={setBody}
                        multiline

                    />

                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={sendEmail}>
                        <Text style={styles.button}>Send Mail</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold',

    },
    container: {
        flex: 1,
    },
    container2: {
        backgroundColor: '#525B51',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom: 10

    },
    box: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 0,
        borderColor: '#525B51',
        backgroundColor: 'lightgrey',
        paddingBottom: 30
    },
    Webbox: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        borderRadius: 0,
        borderColor: '#525B51',
        backgroundColor: 'white',
        opacity:0.8,
       // alignItems:'center',
        paddingBottom: 30
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
        color: 'black',
        backgroundColor: 'lightgrey',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 15
    },
    Webinput: {
        height: 40,
        borderColor: 'gray',
        color: 'black',
        backgroundColor: 'lightgrey',
        width:wp(40),
        alignSelf:'center',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 15
    },
    button1: {
        borderRadius: 20,
    },
    button: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        backgroundColor: 'skyblue',
        textAlign: 'center',
        paddingVertical: 6,
        marginBottom: 4,
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    Webbutton: {
        borderWidth: 1,
        borderRadius: 10,
        width:wp(15),
        padding: 5,
        backgroundColor: 'skyblue',
        textAlign: 'center',
        paddingVertical: 6,
        marginBottom: 4,
    },
    back: {
        width: 30,
        height: 30,
        marginHorizontal: 30,
        marginVertical: 10
    },
});

export default EmailScreen;
