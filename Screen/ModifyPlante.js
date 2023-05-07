import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, TextInput, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';

function ModifyPlante() {
    const navigation = useNavigation();
    const route = useRoute();
    const [nom, setNom] = useState(route.params._nom);
    const [description, setDescription] = useState(route.params._description);
    const [_url, setUrl] = useState(route.params._url);
    const [typePlante, setTypePlante] = useState(route.params._libelle);
    const [idPlante, setIdPlante] = useState(route.params._idPlante);
    const [listTypePlante, setListTypePlante] = useState([]);
    const [selectedTypePlante, setSelectedTypePlante] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPhotoUri, setSelectedPhotoUri] = useState("");

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSelectTypePlante = (typePlante) => {
        setSelectedTypePlante(typePlante);
        setTypePlante(typePlante.libelle);
        setIsDropdownOpen(false);
    };

    const handleChoosePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (!pickerResult.cancelled) {
            setSelectedPhotoUri(pickerResult.uri); // Enregistre le lien de la photo sélectionnée

            // Enregistrer le lien dans le stockage local de l'application
            try {
                await AsyncStorage.setItem('selectedPhotoUri', pickerResult.uri);
            } catch (error) {
                console.log('Error saving selected photo URI:', error);
            }
        }
    };

    useEffect(() => {
        axios.get("http://codx.fr:8080/TypePlantes/").then((resp) => {
            setListTypePlante(resp.data);
        });
    }, []);

    useEffect(() => {
        setSelectedTypePlante({
            idTypePlante: route.params._idTypePlante,
            libelle: route.params._libelle,
        });
    }, []);

    function UpdatePlante() {
        axios
            .get("http://codx.fr:8080/GetTypesPlantsByName/" + selectedTypePlante.libelle)
            .then((resp) => {
                const idTypePlante = resp.data[0].idTypePlante;
                axios
                    .post(`http://codx.fr:8080/UpdatePlante/${idPlante}/${nom}/${description}/${idTypePlante}`, {
                        url: selectedPhotoUri || _url,
                    })
                    .then((resp) => {
                        if (resp.data === "OK") {
                            navigation.navigate("Mes Plantes");
                        }
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modification Plante</Text>
            <View style={styles.formContainer}>
                <View style={styles.photoCard}>
                    <Image source={{ uri: selectedPhotoUri || _url }} style={styles.image} />
                </View>
                <View>
                    <Text style={styles.label}>Nom</Text>
                    <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom" />
                </View>
                <View>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
                </View>

                <View style={styles.selectContainer}>
                    <Text style={styles.label}>Type Plante</Text>
                    <Pressable onPress={handleToggleDropdown} style={styles.select}>
                        <Text style={styles.selectText}>{typePlante ? typePlante : "Sélectionner un type de plante"}</Text>
                    </Pressable>
                    {isDropdownOpen && (
                        <ScrollView style={styles.dropdown}>
                            {listTypePlante.map((typePlante) => (
                                <Pressable
                                    key={typePlante.idTypePlante}
                                    onPress={() => handleSelectTypePlante(typePlante)}
                                    style={styles.dropdownItem}
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
                    <TouchableOpacity style={styles.button} onPress={UpdatePlante}>
                        <Text style={styles.buttonText}>Enregistrer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Annuler</Text>
                    </TouchableOpacity>
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
        borderColor: '#e0f3e0',
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

export default ModifyPlante;