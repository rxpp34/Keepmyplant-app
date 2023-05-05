import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


function CreatePlante() {
    const navigation = useNavigation();
    const [Nom, setNom] = useState('');
    const [Description, setDescription] = useState('');
    const [urlPhoto, setUrlPhoto] = useState('');
    const [TypePlante, setTypePlante] = useState('');
    const [TypesPlante, setTypesPlante] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTypePlante, setSelectedTypePlante] = useState(null);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelectTypePlante = (typePlante) => {
        setSelectedTypePlante(typePlante);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://codx.fr:8080/TypePlantes',
        })
            .then((resp) => {
                setTypesPlante(resp.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleChoosePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (!pickerResult.cancelled) {
            setImageUrl(pickerResult.uri); // Enregistre le lien de la photo sélectionnée

            // Enregistrer le lien dans le stockage local de l'application
            try {
                await AsyncStorage.setItem('selectedPhotoUri', pickerResult.uri);
            } catch (error) {
                console.log('Error saving selected photo URI:', error);
            }
        }
    };

    const SubmitPlante = async () => {
        const selectedPhotoUri = await AsyncStorage.getItem('selectedPhotoUri'); // Récupère l'URL enregistrée

        axios
            .post(`http://codx.fr:8080/CreatePlanteByUser/alicia.lefebvre@gmail.com/${Nom}/${Description}/${selectedTypePlante.idTypePlante}`, {
                url: selectedPhotoUri,
            })
            .then((resp) => {
                if (resp.data === 'OK') {
                    navigation.navigate('Mes Plantes');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 100 }}>
            <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#46a094', marginBottom: 20 }}>
                    Création Plante
                </Text>
                <View style={styles.formContainer}>
                    <View style={styles.photoCard}>
                        <Image source={{ uri: imageUrl || '../assets/no-image.jpg' }} style={styles.image} />
                    </View>

                    <View>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            value={Nom}
                            onChangeText={(text) => setNom(text)}
                            style={styles.input}
                            placeholder="Nom"
                        />
                    </View>
                    <View>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            value={Description}
                            onChangeText={(text) => setDescription(text)}
                            style={styles.input}
                            placeholder="Description"
                        />
                    </View>
                    <View style={styles.selectContainer}>
                        <Text style={styles.label}>Type Plante</Text>
                        <Pressable onPress={handleToggleDropdown} style={styles.select}>
                            <Text style={styles.selectText}>
                                {selectedTypePlante ? selectedTypePlante.libelle : 'Sélectionner un type de plante'}
                            </Text>
                        </Pressable>

                        {isDropdownOpen && (
                            <ScrollView style={styles.dropdown}>
                                {TypesPlante.map((typePlante) => (
                                    <Pressable
                                        key={typePlante.idTypePlante}
                                        onPress={() => handleSelectTypePlante(typePlante)}
                                        style={{ marginBottom: 10 }}
                                    >
                                        <Text>{typePlante.libelle}</Text>
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Photo')} style={styles.button}>
                            <Text style={styles.buttonText}>Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleChoosePhoto} style={styles.button}>
                            <Text style={styles.buttonText}>Choisir photo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={SubmitPlante} style={styles.button}>
                            <Text style={styles.buttonText}>Créer</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                            <Text style={styles.buttonText}>Retour</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingTop: 100,
    },
    formContainer: {
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: '#e0f3e0',
        borderRadius: 10,
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#46a094',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    photoCard: {
        width: 200,
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 20,
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#46a094',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    selectContainer: {
        marginBottom: 10,
    },
    select: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 8,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    selectText: {
        color: '#46a094',
    },
    dropdown: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#46a094',
        borderRadius: 8,
    },
    dropdownItem: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#46a094',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});


export default CreatePlante;
