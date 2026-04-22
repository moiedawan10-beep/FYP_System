import React from "react";
import { Text, View, StyleSheet,ImageBackground,Platform,Image,TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TEST_ID } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomAlert from '../Components/CustomAlert';


const GuidelineScreen = ({navigation}) => {
    return(
        <SafeAreaView style={{flex:1}}>
            {Platform.OS === 'web' ? (
            <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
           
           <View style={{ flexDirection: 'row', justifyContent: 'space-around',backgroundColor:'white',opacity:0.8, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.Webheading}>Group Preview</Text>
                    </View>
                </View>

            <View style={styles.Webbox}>

                <Text style={styles.Websub}>Content for the PROPOSAL:</Text>
            
                <Text style={styles.Webtext}>{`\u2022`} Write down the brief introduction of your topic.</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write down the history and current terms (from traditional to modern transition) related to your topic.</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write about different inspirationally designers globally related to your topic, write about color scheming, compare and contrast, any specialty, important elements, style, different types, industry importance and comparison.</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write about the market growth and scope of that topic/area/product/service in Pakistan.</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write about 3 to 5 different designers in Pakistan related to your topic, career or scope of that topic.</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write in detail about your own project display (inspirational theme, target market, approach of advertising)</Text>
                <Text style={styles.Webtext}>{`\u2022`} Write proper references. (APA style)</Text>
                

                <Text style={styles.Websub}>Proposal acceptance policy:</Text>
                <Text style={styles.Webtext}>After the approval from Program Advisor and Subject Specialist, students will be allowed to start the FYP.  </Text>

                <Text style={styles.Websub}>Group formation and group size:</Text>
                <Text style={styles.Webtext}>It is an individual FYP display. Because, it is a 6-credit hour FYP. So, to justify the 6-credit hour it is mandatory to all of you to do FYP individually. </Text>

                <Text style={styles.Websub}>Grades and reviews (Displays):</Text>
                <Text style={styles.Webtext}>20 x 20 space will be allocated on-campus in the corridor to display your work. Along with display you will be writing down a thesis report. The plagiarism of your project must be less than 14percent otherwise it won’t be acceptable.  </Text>
            </View>
           </ImageBackground>
            ) :(
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
           
           <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image
                            style={styles.back}
                            source={require('../resources/back.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '100%' }}>
                        <Text style={styles.heading}>Group Preview</Text>
                    </View>
                </View>

            <ScrollView >
            <View style={styles.box}>

                <Text style={styles.sub}>Content for the PROPOSAL:</Text>
            
                <Text style={styles.bullet}>{`\u2022`} Write down the brief introduction of your topic.</Text>
                <Text style={styles.bullet}>{`\u2022`} Write down the history and current terms (from traditional to modern transition) related to your topic.</Text>
                <Text style={styles.bullet}>{`\u2022`} Write about different inspirationally designers globally related to your topic, write about color scheming, compare and contrast, any specialty, important elements, style, different types, industry importance and comparison.</Text>
                <Text style={styles.bullet}>{`\u2022`} Write about the market growth and scope of that topic/area/product/service in Pakistan.</Text>
                <Text style={styles.bullet}>{`\u2022`} Write about 3 to 5 different designers in Pakistan related to your topic, career or scope of that topic.</Text>
                <Text style={styles.bullet}>{`\u2022`} Write in detail about your own project display (inspirational theme, target market, approach of advertising)</Text>
                <Text style={styles.bullet}>{`\u2022`} Write proper references. (APA style)</Text>
                

                <Text style={styles.sub}>Proposal acceptance policy:</Text>
                <Text style={styles.text}>After the approval from Program Advisor and Subject Specialist, students will be allowed to start the FYP.  </Text>

                <Text style={styles.sub}>Group formation and group size:</Text>
                <Text style={styles.text}>It is an individual FYP display. Because, it is a 6-credit hour FYP. So, to justify the 6-credit hour it is mandatory to all of you to do FYP individually. </Text>

                <Text style={styles.sub}>Grades and reviews (Displays):</Text>
                <Text style={styles.text}>20 x 20 space will be allocated on-campus in the corridor to display your work. Along with display you will be writing down a thesis report. The plagiarism of your project must be less than 14percent otherwise it won’t be acceptable.  </Text>
            </View>
            </ScrollView>
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
        borderWidth: 1,
        backgroundColor: 'lightgrey',
        padding: 15,
        flex:1,
        paddingBottom: 30
    },
    Webbox: {
        flex:1,
        borderWidth: 1,
        backgroundColor: 'white',
        opacity:0.8,
        padding: 15,
        paddingBottom: 30
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
        textAlign:'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    meetingTime: {
        color: 'grey',
        marginHorizontal: 10,
        fontSize: 12,
        alignSelf: 'flex-end',
        fontStyle: 'italic'
    },
    main: {
        fontSize: 30,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold'
    },
    Webmain: {
        fontSize: 40,
        textAlign: 'center',
        margin: 5,
        fontWeight: 'bold'
    },
    sub: {
        margin: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    Websub: {
        margin: 10,
        fontSize: 23,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    text: {
        margin: 5,
        textAlign:'justify'
    },
    Webtext: {
        margin: 5,
        fontSize:17,
        textAlign:'justify'
    },
    bullet: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        textAlign:'justify'
        
    },
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

    },
    Webbullet: {
        marginLeft: 10,
        marginRight: 10,
        fontSize:12,
        marginTop: 5,
        textAlign:'justify'
        
    }
});

export default GuidelineScreen;