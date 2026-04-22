import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Platform, SafeAreaView, Image, ImageBackground, Alert } from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable, uploadBytes } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from "../../FirebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";
import * as FileSystem from "expo-file-system";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


import LoadingIndicator from "../Components/LoadingIndicator";
import CustomAlert from '../Components/CustomAlert';


const EditScreen = ({ navigation }) => {
    const [data, setData] = useState({});
    const [name, setName] = useState("");
    const [dataLoaded, setLoading] = useState(false);
    const [area1, setArea1] = useState("");
    const [open1, setOpen1] = useState(false);
    const [area2, setArea2] = useState("");
    const [open2, setOpen2] = useState(false);
    const [area3, setArea3] = useState("");
    const [open3, setOpen3] = useState(false);
    const [categories, setCategories] = useState([
        { label: 'Application Development', value: 'Application Development' },
        { label: 'Web Development', value: 'Web Development' },
        { label: 'Information Security', value: 'Information Security' },
        { label: 'Cryptography', value: 'Cryptography' },
    ]);

    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [downloadableUrl, setDownloadableURL] = useState("https://firebasestorage.googleapis.com/v0/b/automated-fyp.appspot.com/o/ProfilePictures%2Fdefault-icon.jpg?alt=media&token=2af314cf-f8f4-4706-bafa-ecc9b9b4e654");
    const [temp, setTemp] = useState(null)
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
            const docRef = doc(db, "Faculty", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData(docSnap.data());
                setName(docSnap.data().name);
                setDownloadableURL(docSnap.data()?.pictureUrl)
                setArea1(docSnap.data()?.interest_area_1)
                setArea2(docSnap.data()?.interest_area_2)
                setArea3(docSnap.data()?.interest_area_3)
            } else {
                console.log("No such document!");
            }
        };
        getData().then(() => setLoading(true));
    }, []);

    const updateData = async () => {
        const docRef = doc(db, "Faculty", auth.currentUser.uid);
        await updateDoc(docRef, {
            name: name,
            interest_area_1: area1,
            interest_area_2: area2,
            interest_area_3: area3,
            pictureUrl: downloadableUrl
        }).then(
            () => navigation.navigate('ProfileFaculty'),
            setError('Profile Updates Successfully'),
            setShowAlert(true),
        );
    };

    const ImageUploader = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
                aspect: [1, 1],
            });

            if (!result.canceled) {
                const selectedImageUri = result.assets[0].uri;
                setImage(selectedImageUri);
                await uploadMedia(selectedImageUri);
            } else {
                console.log('Image selection canceled');
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const uploadMedia = async (uri) => {
        setUploading(true);

        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network Request Failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = uri.substring(uri.lastIndexOf('/') + 1);

            const metadata = {
                contentType: 'image/jpeg',
            };

            const storageRef = ref(storage, auth.currentUser.uid);
            const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            setError('User does not have permission to access the object');
                            setShowAlert(true);
                            break;
                        case 'storage/canceled':
                            setError('User canceled the upload');
                            setShowAlert(true);
                            break;
                        case 'storage/unknown':
                            setError('Unknown error occurred');
                            setShowAlert(true);
                            break;
                    }
                    setUploading(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        setDownloadableURL(downloadURL);
                    });
                    setUploading(false);
                    setImage(null);
                }
            );
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
            setError('Failed to upload image');
            setShowAlert(true);
        }
    };


    if (!dataLoaded) {
        return <LoadingIndicator />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {showAlert && (
                <CustomAlert
                    message={error}
                    //screenName="Main"
                    onClose={handleCloseAlert} // No screenName means it will just close
                />
            )}
            {Platform.OS === 'web' ? (

                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={{ flexDirection: 'row', justifyContent:'space-around', backgroundColor: 'white', opacity: 0.8, alignItems: 'center',borderBottomWidth:1 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.Webheading}>Edit Profile</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ backgroundColor: 'white', opacity: 0.8, padding: 10, paddingTop: 15 }}>
                            <View style={{ width: wp(50), alignSelf: 'center' }}>
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => { setFullImage(true) }}>
                                        <Image
                                            style={styles.profilePic}
                                            source={{ uri: data.pictureUrl }}
                                        />
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity onPress={ImageUploader}>
                                            <Text style={styles.Webtext}>Edit Picture</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <Text style={styles.titles}>ID:</Text>
                                <Text style={styles.WebnoChange}>{data.facultyID}</Text>

                                <Text style={styles.titles}>Email:</Text>
                                <Text style={styles.WebnoChange}>{data.email}</Text>

                                <Text style={styles.titles}>Name:</Text>
                                <TextInput
                                    onChangeText={value => setName(value)}
                                    style={styles.Webinput}
                                    autoCapitalize="none"
                                    placeholder="Name"
                                    value={name}
                                />

                                <View style={{ width: '80%', justifyContent: 'center' }}>
                                    <Text style={styles.titles}>Interest Area 1: </Text>
                                    <DropDownPicker
                                        open={open1}
                                        value={area1}
                                        items={categories}
                                        setValue={setArea1}
                                        setItems={setCategories}
                                        setOpen={setOpen1}
                                        style={styles.Webdropdown}
                                    />

                                    <Text style={styles.titles}>Interest Area 2: </Text>
                                    <DropDownPicker
                                        open={open2}
                                        value={area2}
                                        items={categories}
                                        setValue={setArea2}
                                        setItems={setCategories}
                                        setOpen={setOpen2}
                                        style={styles.Webdropdown}
                                    />

                                    <Text style={styles.titles}>Interest Area 3: </Text>
                                    <DropDownPicker
                                        open={open3}
                                        value={area3}
                                        items={categories}
                                        setValue={setArea3}
                                        setItems={setCategories}
                                        setOpen={setOpen3}
                                        style={styles.Webdropdown}
                                    />
                                </View>
                                <View style={{ alignItems: 'center',alignSelf:'center', justifyContent: 'center',width:wp(25), margin: 10 }}>
                                    <TouchableOpacity onPress={updateData}>
                                        <Text style={styles.Webupdate}>Update</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            ) : (
                <ImageBackground source={require('../resources/bg.jpg')} style={styles.background}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',borderBottomWidth:1 }}>
                        <TouchableOpacity onPress={() => { navigation.goBack() }}>
                            <Image
                                style={styles.back}
                                source={require('../resources/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.heading}>Edit Profile</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={{ backgroundColor: 'lightgrey', padding: 10, paddingTop: 15 }}>
                            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => { setFullImage(true) }}>
                                    <Image
                                        style={styles.profilePic}
                                        source={{ uri: data.pictureUrl }}
                                    />
                                </TouchableOpacity>
                                <View>
                                    <TouchableOpacity onPress={ImageUploader}>
                                        <Text style={styles.text}>Edit Picture</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <Text style={styles.titles}>ID:</Text>
                            <Text style={styles.noChange}>{data.facultyID}</Text>

                            <Text style={styles.titles}>Email:</Text>
                            <Text style={styles.noChange}>{data.email}</Text>

                            <Text style={styles.titles}>Name:</Text>
                            <TextInput
                                onChangeText={value => setName(value)}
                                style={styles.input}
                                autoCapitalize="none"
                                placeholder="Name"
                                value={name}
                            />

                            <View style={{ width: '80%', justifyContent: 'center' }}>
                                <Text style={styles.titles}>Interest Area 1: </Text>
                                <DropDownPicker
                                    open={open1}
                                    value={area1}
                                    items={categories}
                                    setValue={setArea1}
                                    setItems={setCategories}
                                    setOpen={setOpen1}
                                    style={styles.dropdown}
                                />

                                <Text style={styles.titles}>Interest Area 2: </Text>
                                <DropDownPicker
                                    open={open2}
                                    value={area2}
                                    items={categories}
                                    setValue={setArea2}
                                    setItems={setCategories}
                                    setOpen={setOpen2}
                                    style={styles.dropdown}
                                />

                                <Text style={styles.titles}>Interest Area 3: </Text>
                                <DropDownPicker
                                    open={open3}
                                    value={area3}
                                    items={categories}
                                    setValue={setArea3}
                                    setItems={setCategories}
                                    setOpen={setOpen3}
                                    style={styles.dropdown}
                                />
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', margin: 10 }}>
                                <TouchableOpacity onPress={updateData}>
                                    <Text style={styles.update}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            )}
        </SafeAreaView>
    );
};

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
    Webheading: {
        fontSize: 25,
        //textAlign: "center",
        fontWeight: 'bold',
       marginVertical: 5,
      // paddingHorizontal:wp(40),

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
        borderColor: 'grey',

    },
    Webinput: {
        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderColor: 'grey',
        width: wp(50),

    },
    noChange: {
        borderWidth: 1,
        padding: 15,
        margin: 10,
        borderColor: 'grey',

    },
    WebnoChange: {
        borderWidth: 1,
        padding: 15,
        margin: 10,
        borderColor: 'grey',
        width: wp(50),
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
    }, 
    edit: {
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
    dropdown: {
        backgroundColor: 'lightgrey',
        borderColor: 'grey',
        margin: 10,
        zIndex: 1
    },
    Webdropdown: {
        

        borderWidth: 1,
        padding: 10,
        margin: 10,
        borderColor: 'grey',
        width: wp(50),
    },
    update: {
        padding: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
    },
    Webupdate: {
        padding: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: 'skyblue',
        fontWeight: 'bold',
        margin: 25,
        width:wp(15),
        alignSelf:'center',
        textAlign:'center',
    },
    text: {
        color: '#244082',
        margin: 10,
        fontSize: 12
    },
    Webtext: {
        color: '#244082',
        margin: 10,
        fontSize: 14,
        fontWeight:'bold'
    }
});

export default EditScreen;