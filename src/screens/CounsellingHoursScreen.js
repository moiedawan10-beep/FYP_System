import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { View, Text,Platform, StyleSheet, Button, Alert, SafeAreaView, ImageBackground, TouchableOpacity, Image } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CustomAlert from '../Components/CustomAlert';

const CounsellingHoursScreen = ({navigation}) => {
  const route = useRoute();
  const [id, setId] = useState("" + route?.params.id)
  const [data, setData] = useState(null)
  const [dataLoaded, setLoading] = useState(false)

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
      const docRef = doc(db, "Faculty", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data().email);
        setData(docSnap.data()?.hours);
        console.log(data)
        setLoading(true)
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    }
    getData()
  }, [dataLoaded])

  if (!data) {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.background} source={require('../resources/bg.jpg')}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around',backgroundColor:'white',opacity:0.8, alignItems: 'center', flex: 1, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => { navigation.goBack() }}>
              <Image
                style={styles.back}
                source={require('../resources/back.png')}
              />
            </TouchableOpacity>
            <View style={{ width:'100%' }}>
              <Text style={styles.heading}>Weekly Schedule</Text>
            </View>
          </View>

          <View style={{flex: 9, backgroundColor: 'white', opacity:0.8, justifyContent: 'center'}}>
            <Text style={{ fontWeight: 'bold', margin: 10,fontSize:15, textAlign: 'center' }}>Counselling hours not updated yet!</Text>
          </View>
      </ImageBackground>
      </View>
    )
  }

  const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const orderedSchedule = orderedDays.map(day => ({
    day,
    hours: data[day] || "Not specified", // Handle case where day might not exist in schedule
  }));

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
      <ImageBackground style={styles.background} source={require('../resources/bg.jpg')}>
        
        <View style={{ flexDirection: 'row', justifyContent:'space-around', backgroundColor: 'white', opacity: 0.8, alignItems: 'center',borderBottomWidth:1 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.Webheading}>Weekly Schedule</Text>
                        </View>
                    </View>

        <View style={{flex: 2,justifyContent: 'flex-end', backgroundColor: 'white', opacity:0.8}}>
          <Text style={styles.WebsubHeading}>Counselling hours of your Advisor are mentioned below:</Text>
        </View>

        <View style={styles.Webinner}>
          {orderedSchedule.map(({ day, hours }) => (
            <View key={day} style={styles.WebscheduleItem}>
              <Text style={styles.Webday}>{day}:</Text>
              <Text style={styles.Webhours}>{hours}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 2, backgroundColor: 'white', opacity:0.8 }}></View>


      </ImageBackground> 
      ) : (
        <ImageBackground style={styles.background} source={require('../resources/bg.jpg')}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flex: 1, borderBottomWidth: 1 }}>
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Image
              style={styles.back}
              source={require('../resources/back.png')}
            />
          </TouchableOpacity>
          <View style={{ width: '100%' }}>
            <Text style={styles.heading}>Weekly Schedule</Text>
          </View>
        </View>

        <View style={{flex: 2, backgroundColor: 'lightgrey', justifyContent: 'flex-end'}}>
          <Text style={styles.subHeading}>Counselling hours of your Advisor are mentioned below:</Text>
        </View>

        <View style={styles.inner}>
          {orderedSchedule.map(({ day, hours }) => (
            <View key={day} style={styles.scheduleItem}>
              <Text style={styles.day}>{day}:</Text>
              <Text style={styles.hours}>{hours}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 2, backgroundColor: 'lightgrey' }}></View>


      </ImageBackground>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    height: hp(100),
    width: wp(100),
  //  resizeMode: 'stretch', // or 'stretch' or 'contain'
    justifyContent: 'center',
    opacity: 0.8,
},
  inner: {
    padding: 25,
    paddingBottom: 40,
    backgroundColor: 'lightgrey',
    flex: 5
  },
  Webinner: {
    padding: 25,
    paddingBottom: 40,
    backgroundColor: 'white', // 50% transparent black
    opacity: 0.8,
    flex: 8
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: 'bold',
    marginVertical: 5,
},
  Webheading: {
    fontSize: 25,
    //textAlign: "center",
    fontWeight: 'bold',
   marginVertical: 5,
  // paddingHorizontal:wp(40),

},
  Webday: {
    fontSize: 30,
    paddingHorizontal:120,
    alignSelf:'flex-start'
  },
  Webhours: {
    fontSize: 30,
    paddingHorizontal:120,
  alignSelf:'flex-start'
  },

  subHeading: {
    fontSize: 15,
    paddingBottom: 35,
    textAlign: 'center',
  },
  WebsubHeading: {
    fontSize: 35,
    paddingBottom: 35,
    textAlign: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 15,
  },
  WebscheduleItem: {
    flexDirection: 'row',
    paddingHorizontal:120,
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: 35,
  },

  back: {
    width: 30,
    height: 30,
    marginHorizontal: 30,
    marginVertical: 10
  },
 

});

export default CounsellingHoursScreen;