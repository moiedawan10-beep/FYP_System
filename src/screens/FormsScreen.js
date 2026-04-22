import React, {useState} from 'react';
import { View, Button, Alert, Text, Linking, TouchableOpacity,Platform, StyleSheet, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomAlert from '../Components/CustomAlert';


const FormsScreen = ({navigation}) => {

    //const linkUrl = 'https://admin.umt.edu.pk/Media/Site/SPA/FileManager/Posts/Final%20Year%20Project%20Guidelines%20(MCS).pdf';

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const handleCloseAlert = () => {
        setShowAlert(false);
    };


    const openLink = (option) => {
        switch (option) {
            case 1:
                Linking.openURL('https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/Templates%2FFYP_Proposal_Template%20.docx?alt=media&token=46865040-ead1-45e7-99ff-0fcfb889ceec')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 2:
                Linking.openURL('https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/Templates%2FFYP_Game%20based_Template.docx?alt=media&token=211a0c37-9c97-4565-85f8-06112af38665')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 3:
                Linking.openURL('https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/Templates%2FFYP_Research-Based_Template.docx?alt=media&token=6c33fc6b-04d8-4a02-bd73-32be5941eacc')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 4:
                Linking.openURL('https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/Templates%2FFYP_Product-Based_Template%20.docx?alt=media&token=aba2f11b-0727-4714-b437-0274a5f316b6')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
            case 5:
                Linking.openURL('https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/Templates%2FAdvisor_Consent%20Form_FYP.docx?alt=media&token=5558bf8e-072e-4728-a03f-165d8d83a2be')
                    .catch((err) =>
                        console.error('An error occurred', err)
                    );
                break;
        }

    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around',backgroundColor:'white', opacity:0.8, alignItems: 'center' ,borderBottomWidth:1}}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Templates</Text>
                    </View>
                </View>
                <View style={styles.Webbox}>
                    <TouchableOpacity style={{ flexDirection: 'row',  borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: wp(50), alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(1)}>
                        <Text style={styles.doc}>Proposal Template</Text>
                        <Image style={{height: 20, width: 20, alignSelf: 'center'}} source={require('../resources/new-tab.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: wp(50), alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(2)}>
                        <Text style={styles.doc}>Documentation Template (Game Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: wp(50), alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(3)}>
                        <Text style={styles.doc}>Documentation Template (Research Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: wp(50), alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(4)}>
                        <Text style={styles.doc}>Documentation Template (Product Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: wp(50), alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(5)}>
                        <Text style={styles.doc}>Advisor Consent Form</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    

                </View>
            </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' ,borderBottomWidth:1}}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Templates</Text>
                    </View>
                </View>
                <View style={styles.box}>
                    <TouchableOpacity style={{ flexDirection: 'row',  borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(1)}>
                        <Text style={styles.doc}>Proposal Template</Text>
                        <Image style={{height: 20, width: 20, alignSelf: 'center'}} source={require('../resources/new-tab.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(2)}>
                        <Text style={styles.doc}>Documentation Template (Game Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(3)}>
                        <Text style={styles.doc}>Documentation Template (Research Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(4)}>
                        <Text style={styles.doc}>Documentation Template (Product Base)</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 5, justifyContent: 'space-between', width: '80%', alignSelf: 'center', marginVertical: 15 }} onPress={() => openLink(5)}>
                        <Text style={styles.doc}>Advisor Consent Form</Text>
                        <Image style={{ height: 20, width: 20, alignSelf: 'center' }} source={require('../resources/new-tab.png')} />
                    </TouchableOpacity>
                    

                </View>
            </ImageBackground>
            )}
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        
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
    box: {
        borderWidth: 0,
        backgroundColor: 'lightgrey',
        padding: 15,
        paddingVertical: 50,
        justifyContent: 'center',
        width: '100%',
        alignSelf : 'center',
        flex: 1
    },
    Webbox: {
        borderWidth: 0,
        backgroundColor: 'white',
        opacity:0.8,
        padding: 15,
        paddingVertical: 50,
        justifyContent: 'center',
        width: '100%',
        alignSelf : 'center',
        flex: 1
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
    doc: {
        textAlign: 'center',
        marginVertical: 5
    }
});

export default FormsScreen;