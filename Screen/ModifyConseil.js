import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, TextInput, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

function ModifyPlante() {
    const navigation = useNavigation();
    const route = useRoute();
    const [titre, setTitre] = useState(route.params._titre);
    const [description, setDescription] = useState(route.params._description);
    const [idConseil, setIdConseil] = useState(route.params._idConseil);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTypePlante, setSelectedTypePlante] = useState(null);
    const [TypesPlante, setTypesPlante] = useState([]);

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

    function UpdateConseil() {
        axios({
            method: 'get',
            url: "http://codx.fr:8080/GetTypesPlantsByName/" + selectedTypePlante
        }).then((resp) => {
            axios({
                method: 'POST',
                url: "http://codx.fr:8080/UpdateConseil/" + titre + "/" + description + "/" + selectedTypePlante.idTypePlante + "/" + idConseil
            }).then((resp) => {
                if (resp.data === 'OK') {
                    navigation.navigate('MesConseils')
                }
            })
        })

    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modification Conseil</Text>
            <View style={styles.formContainer}>
                <View>
                    <Text style={styles.label}>Titre</Text>
                    <TextInput style={styles.input} value={titre} onChangeText={setTitre} placeholder="Titre" />
                </View>
                <View>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description" />
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
                    <TouchableOpacity style={styles.button} onPress={UpdateConseil}>
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