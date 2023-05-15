import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, StyleSheet, Pressable } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


function CreatePlante() {
    const navigation = useNavigation();
    const [Titre, setTitre] = useState('');
    const [Description, setDescription] = useState('');
    const [urlPhoto, setUrlPhoto] = useState('');
    const [TypePlante, setTypePlante] = useState('');
    const [TypesPlante, setTypesPlante] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTypePlante, setSelectedTypePlante] = useState(null);

    const [User, setUser] = useState("")

    const GetUserMail = async () => {
        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetUserByMail/" + value
            }).then((resp) => {
                setUser(resp.data[0])
            }).catch((err) => {
                alert(err)
            });
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        GetUserMail();
    }, []);

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

    const submitConseil = () => {
        axios({
            method: 'get',
            url: `http://codx.fr:8080/GetTypesPlantsByName/${selectedTypePlante}`,
        })
            .then((resp) => {
                axios({
                    method: 'POST',
                    url: "http://codx.fr:8080/CreateConseil/" + User.mail + "/${selectedTypePlante.idTypePlante}",
                    data: {
                        titre: Titre,
                        description: Description,
                    },
                }).then((resp) => {
                    if (resp.data === 'OK') {
                        navigation.navigate('MesConseils');
                    }
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 100 }}>
            <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#46a094', marginBottom: 20 }}>
                    Création conseil
                </Text>
                <View style={styles.formContainer}>
                    <View>
                        <Text style={styles.label}>Titre</Text>
                        <TextInput
                            value={Titre}
                            onChangeText={(text) => setTitre(text)}
                            style={styles.input}
                            placeholder="Titre"
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
                        <TouchableOpacity onPress={submitConseil} style={styles.button}>
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
