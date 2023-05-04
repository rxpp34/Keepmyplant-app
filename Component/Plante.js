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
            <View style={[styles.cardContent, { borderColor: "lightgreen", borderWidth: 2 }]}>
                <View style={styles.photoCard}>
                    <Image source={{ uri: props.url }} style={styles.image} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.name}>{props.nom}</Text>
                    <Text style={styles.description}>{props.description}</Text>
                    <Text style={styles.libelle}>{libelle}</Text>
                </View>
            </View>

            <View style={styles.optionCard}>
                <TouchableOpacity title="Modifier" onPress={() => GoToModif()}>
                    <Text style={styles.modifierButton}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SupprimerPlante()} style={styles.supprimerButton}>
                    <Text style={styles.buttonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        backgroundColor: "white",
        padding: 10,
    },
    cardContent: {
        flexDirection: "column",
        marginBottom: 10,
        padding: 10,
    },
    photoCard: {
        marginRight: 10,
        width: "100%",
        height: 200,
        borderRadius: 8,
        overflow: "hidden",
    },
    image: {
        flex: 1,
        width: "100%",
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        marginTop: 20, // Ajustez l'espacement selon vos besoins
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        marginBottom: 5,
    },
    libelle: {
        color: "rgb(0, 151, 93)",
        fontSize: 16,
        fontWeight: "bold",
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    supprimerButton: {
        margin: 5,
        marginBottom: 10,
        paddingHorizontal: 16,
        height: 35,
        borderRadius: 7,
        backgroundColor: '#8C3A3A',
        color: '#fff',
        fontWeight: '400',
        fontSize: 14,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 4,
        justifyContent: 'center', // Centrer verticalement
        alignItems: 'center', // Centrer horizontalement
    },
    modifierButton: {
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 16,
        height: 35,
        lineHeight: 35, // Mise à jour de la valeur de lineHeight
        borderRadius: 7,
        backgroundColor: '#8E8E8E',
        color: '#fff',
        fontWeight: '400',
        fontSize: 16,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Plante;
