import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function Demande(props) {
    const [ReservationList, setReservation] = useState([]);
    const navigation = useNavigation();

    const DeleteReservation = (idReser) => {
        axios({
            method: "DELETE",
            url: "http://codx.fr:8080/DeleteReservationById/" + idReser,
        })
            .then((resp) => {
                // Mettre à jour la liste des réservations après la suppression
                setReservation(ReservationList.filter((item) => item.idReservation !== idReser));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function SupprimerReservation(idReser) {
        if (props.validation === null) {
            Alert.alert(
                "Confirmation",
                "Êtes-vous sûr de supprimer cette réservation ?",
                [
                    {
                        text: "Oui",
                        onPress: () => DeleteReservation(idReser),
                    },
                    {
                        text: "Non",
                    },
                ]
            );
        } else {
            Alert.alert("Action non autorisée", "La réservation ne peut être supprimée que lorsqu'elle est en attente.");
        }
    }

    let statusText = "";
    let statusColor = "";
    let statusBorderColor = "";

    if (props.validation === null) {
        statusText = "En attente";
        statusColor = "black";
        statusBorderColor = "black";
    } else if (props.validation === 0) {
        statusText = "Refusée";
        statusColor = "red";
        statusBorderColor = "red";
    } else if (props.validation === 1) {
        statusText = "Acceptée";
        statusColor = "lightgreen";
        statusBorderColor = "lightgreen";
    }

    return (
        <View style={[styles.container, { marginBottom: 20, borderColor: statusBorderColor }]}>
            <View style={[styles.cardContent, { borderColor: statusBorderColor }]}>
                <View style={styles.statusContainer}>
                    <Text style={[styles.statusText, { color: statusColor, fontWeight: 'bold' }]}>{statusText}</Text>
                </View>
                <View style={styles.referenceContainer}>
                    <Text style={styles.reference}>Annonce N° {props.reference}</Text>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.dateBox}>
                        <Text style={[styles.dateText]}>
                            Du {props.dateDebut} au {props.dateFin}
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <Text style={styles.label}>{props.description}</Text>
                </View>
            </View>

            {props.validation === null ? (
                <View style={styles.optionCard}>
                    <TouchableOpacity onPress={() => SupprimerReservation(props.idReservation)} style={styles.supprimerButton}>
                        <Text style={styles.buttonText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.optionCard}>
                    <Text style={styles.messageText}>Vous ne pouvez plus supprimer la réservation</Text>
                </View>
            )}
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "white",
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    statusContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    statusText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    cardContent: {
        flexDirection: "column",
        padding: 10,
    },
    referenceContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    reference: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 10,
    },
    dateBox: {
        backgroundColor: "#E0F2E9",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        padding: 5,
    },
    dateText: {
        fontSize: 14,
        color: "black",
        textAlign: "center",
        marginTop: 5,
    },
    content: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
    },
    description: {
        fontSize: 16,
        marginBottom: 5,
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 10,
    },
    supprimerButton: {
        backgroundColor: "red",
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    messageText: {
        color: "black",
        fontStyle: "italic",
    },
});
export default Demande;