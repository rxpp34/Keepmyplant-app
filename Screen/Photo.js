import { Camera, CameraType } from 'expo-camera';
import { View, Text, Image, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Button from '../Component/Button';
import React, { useState, useEffect, useRef } from 'react';

function Photo() {
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const mediaLibraryStatus = await MediaLibrary.requestCameraPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus.status === 'granted');

            const cameraStatus = await Camera.requestPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                console.log(data);
                setImage(data.uri);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const saveImage = async () => {
        if (image) {
            try {
                await MediaLibrary.createAssetAsync(image);
                alert('Photo sauvegardé!');
                setImage(null);
            } catch (e) {
                console.log(e);
            }
        }
    };

    if (hasCameraPermission === false) {
        return <Text>No camera access</Text>;
    }

    return (
        <View style={styles.containerTest}>
            {!image ? (
                <Camera style={styles.camera} type={type} flashMode={flash} ref={cameraRef}>
                    <View style={styles.cameraButtonsContainer}>
                        <Button
                            icon="retweet"
                            onPress={() => {
                                setType(type === CameraType.back ? CameraType.front : CameraType.back);
                            }}
                        />
                        <Button
                            icon="flash"
                            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
                            onPress={() => {
                                setFlash(flash === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : Camera.Constants.FlashMode.off);
                            }}
                        />
                        <Button
                            icon="camera"
                            onPress={takePicture}
                        />
                    </View>
                </Camera>
            ) : (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="contain" />
                    <View style={styles.captureButtonsContainer}>
                        <Button title="Retake" icon="retweet" onPress={() => setImage(null)} />
                        <Button title="Save" icon="check" onPress={saveImage} />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    containerTest: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        paddingBottom: 50,
    },
    camera: {
        flex: 1,
        borderRadius: 20,
    },
    cameraButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 30,
    },
    imagePreviewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        flex: 1,
        width: '100%',
    },
    captureButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        marginTop: 20,
    },
});


export default Photo; 