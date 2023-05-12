import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function Plante(props) {
    const navigation = useNavigation();
    const [libelle, setLibelle] = useState("libelle");
    const [listPlantes, setListPlantes] = useState([]);

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
            url: "http://codx.fr:8080/DeletePlanteById/" + props.idPlante,
        }).then(() => {
            // Gérer la suppression de la plante dans l'application React Native
            // Mettre à jour la liste des plantes en supprimant la plante supprimée
            const updatedList = listPlantes.filter(
                (plante) => plante.idPlante !== props.idPlante
            );
            setListPlantes(updatedList);
        });
    }

    function GoToModif() {
        navigation.navigate("ModifyPlante", {
            _nom: props.nom,
            _description: props.description,
            _url: props.url,
            _libelle: libelle,
            _idPlante: props.idPlante,
            ListTypePlant: props.ListTypePlant, // Passer la liste des types de plantes
        });
    }

    function navigateToConseil(idtype, libelle) {
        navigation.navigate("LesConseilsPourTypePlantes", {
            _idtype: idtype,
            _libelle: libelle
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
                    <Image source={{ uri: props.url }} style={styles.image} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{props.nom}</Text>
                    <Text style={styles.description}>{props.description}</Text>
                </View>

                <TouchableOpacity style={styles.buttonEnSavoirPlus} onPress={() => navigateToConseil(props.idtype, libelle)}>
                    <Text style={styles.buttonEnSavoirPlusText}>{libelle}</Text>
                </TouchableOpacity>
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
    buttonEnSavoirPlus: {
        backgroundColor: "#F6F6F6",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
        marginLeft: 10,
    },
    buttonEnSavoirPlusText: {
        color: "black",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
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
        flex: 1,
        width: "100%",
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        marginTop: 20, // Ajustez l'espacement selon vos besoins,
        paddingHorizontal: 10
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "rgb(0, 151, 93)",
    },
    description: {
        marginBottom: 5,
        color: "#6BBD99",
        fontWeight: "bold"
    },
    libelle: {
        color: "rgb(0, 151, 93)",
        fontSize: 16,
        fontWeight: "bold",
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginRight: 15,
        marginBottom: 10
    },
    supprimerButton: {
        height: 38,
        width: 38

    },
    modifierButton: {
        height: 38,
        width: 38
    }
});

export default Plante;
