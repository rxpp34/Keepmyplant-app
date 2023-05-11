import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function Conseil(props) {
    const navigation = useNavigation();
    const [libelle, setLibelle] = useState("libelle");
    const [listConseil, setListConseil] = useState([]);

    useEffect(() => {
        axios({
            method: "GET",
            url: "http://codx.fr:8080/GetTypePlantById/" + props.idtype,
        }).then((response) => {
            setLibelle(response.data[0].libelle);
        });
    }, []);

    function deletePlante() {
        axios({
            method: "DELETE",
            url: "http://codx.fr:8080/DeleteConseilById/" + props.idConseil,
        }).then(() => {
            // Gérer la suppression de la plante dans l'application React Native
            // Mettre à jour la liste des plantes en supprimant la plante supprimée
            const updatedList = listConseil.filter(
                (conseil) => conseil.idConseil !== props.idConseil
            );
            setListConseil(updatedList);
        });
    }

    function GoToModif() {
        navigation.navigate("ModifyConseil", {
            _idConseil: props.idConseil,
            _titre: props.titre,
            _description: props.description,
            _libelle: libelle,
            _urlPhoto: props.urlPhoto,
            ListTypePlant: props.ListTypePlant, // Passer la liste des types de plantes
        });
    }

    function SupprimerPlante() {
        Alert.alert(
            "Confirmation",
            "Etes-vous sûr de supprimer cette plante ?",
            [
                {
                    text: "Oui",
                    onPress: () => deletePlante(),
                },
                {
                    text: "Non",
                },
            ]
        );
    }

    return (
        <View style={[styles.container, { marginBottom: 20 }]}>
            <View style={styles.cardContent}>
                <View style={styles.photoCard}>
                    <Image source={{ uri: props.urlPhoto }} style={styles.image} />
                </View>

                <Text style={styles.libelle}>{props.libelle}</Text>

                <View style={styles.content}>
                    <Text style={styles.name}>{props.titre}</Text>
                    <Text style={styles.description}>{props.description}</Text>
                </View>


            </View>

            <View style={styles.optionCard}>
                <TouchableOpacity title="Supprimer" onPress={() => SupprimerPlante()}>
                    <Image source={require('../assets/delete.png')} style={styles.modifierButton} />
                </TouchableOpacity>

                <TouchableOpacity title="Modifier" onPress={() => GoToModif()}>
                    <Image source={require('../assets/Edit.png')} style={styles.supprimerButton} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: "white",
        shadowColor: '#46a094',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    cardContent: {
        flexDirection: "column",
        marginBottom: 10,
        borderColor: '#46a094',
    },
    photoCard: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    content: {
        paddingHorizontal: 10,
        marginTop: 5,
    },
    libelle: {
        paddingHorizontal: 10,
        paddingTop: 5,
        color: "rgb(0, 151, 93)",
        fontSize: 16,
        fontWeight: "bold",
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "rgb(0, 151, 93)",
    },
    description: {
        marginBottom: 5,
        color: "black",
        fontWeight: "bold",
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 15,
        marginBottom: 10,
    },
    supprimerButton: {
        height: 38,
        width: 38,
    },
    modifierButton: {
        height: 38,
        width: 38,
    }
});

export default Conseil;
