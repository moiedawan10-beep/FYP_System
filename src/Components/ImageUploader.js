import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { storage } from "../../FirebaseConfig";
import { Alert } from "react-native";

const [image, setImage] = useState(null);
const [uploading, setUploading] = useState(false);

const ImageUploader = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        ratio: [1, 1]
    });

    if(!result.canceled){
        setImage(result.assets[0].uri);
    }
};

const uploadMedia = async ( refName ) => {
    setUploading(true)

    try{
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.onerror = (e) => {
                reject(new TypeError('Network Request Fail'))
            };
            xhr.responseType = 'blob';
            xhr.open('Get', uri, true);
            xhr.send(null);
        });

        const filename = image.substring(image.lastIndexOf('/') + 1);

        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref(storage, 'ProfilePictures');
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                switch (snapshot.state){
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch(error.code){
                    case 'storage/unauthorized':
                        console.log('User does not have permission to access the object');
                        break;
                    case 'storage/canceled':
                        console.log('User cancelled the upload')
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error');
                        break;
                }
            },
            () => {
                wait
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log(downloadURL);
                })
            }
        );
        setUploading(false);
        Alert.alert('Photo Uploaded');
        setImage(null);
    }
    catch (error){
        console.error(error);
        setUploading(false)
    }
}

export { ImageUploader, uploadMedia }