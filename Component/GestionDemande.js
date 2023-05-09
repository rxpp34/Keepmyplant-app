import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

function Demande(props) {
    const [ReservationList, setReservation] = useState([]);
    const navigation = useNavigation();

    const AccepterReservation = (idReser) => {
        axios({
            method: "POST",
            url: "http://codx.fr:8080/UpdateReservationAccepter/" + idReser,
        })
            .then((resp) => {
                if (resp.data === "OK") {
                    navigation.navigate("MesAnnonces");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function ReservationAccepter(idReser) {
        if (props.validation === null) {
            Alert.alert(
                "Confirmation",
                "Êtes-vous sûr d'accepter cette réservation ?",
                [
                    {
                        text: "Oui",
                        onPress: () => AccepterReservation(idReser),
                    },
                    {
                        text: "Non",
                    },
                ]
            );
        } else {
            Alert.alert("Action non autorisée", "La réservation ne peut être acceptée que lorsqu'elle est en refusée.");
        }
    }

    const DeleteReservation = (idReser) => {
        axios({
            method: "POST",
            url: "http://codx.fr:8080/UpdateReservationRefuser/" + idReser,
        })
            .then((resp) => {
                if (resp.data === "OK") {
                    navigation.navigate("MesAnnonces");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function ReservationRefuser(idReser) {
        if (props.validation === null) {
            Alert.alert(
                "Confirmation",
                "Êtes-vous sûr de refuser cette réservation ?",
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
            Alert.alert("Action non autorisée", "La réservation ne peut être refuser que lorsqu'elle est en acceptée.");
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
                    <Text style={styles.numero}>Réservation N° {props.numero}</Text>
                </View>
                <View style={styles.contentCadre}>
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatar} source={{ uri: props.photo }} />
                    </View>
                    <View style={styles.labelsContainer}>
                        <Text style={styles.label}>{props.nom} {props.prenom}</Text>
                        <Text style={styles.label}>Téléphone : {props.telephone}</Text>
                    </View>
                </View>
            </View>

            {props.validation === null ? (
                <View style={{ flexDirection: "row", alignSelf: 'flex-end' }}>
                    <View style={styles.optionCard}>
                        <TouchableOpacity onPress={() => AccepterReservation(props.Reservation)} style={styles.supprimerButton}>
                            <Text style={styles.buttonAccept}>Accepter</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.optionCard}>
                        <TouchableOpacity onPress={() => ReservationRefuser(props.Reservation)} style={styles.supprimerButton}>
                            <Text style={styles.buttonRefuse}>refuser</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            ) : (
                <View style={styles.optionCard}>
                    <Text style={styles.messageText}>Vous ne pouvez plus modifier la réservation</Text>
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
    contentCadre: {
        flexDirection: 'row',
        alignItems: 'center',
        border: '1px solid black',
        marginTop: 10,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
    },
    avatarContainer: {
        marginRight: 16,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
    numero: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        alignSelf: "center",
        marginBottom: 8,
        marginTop: 5,
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 10,
    },
    buttonAccept: {
        backgroundColor: "lightgreen", // vert clair
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
        color: "white",
    },
    buttonRefuse: {
        backgroundColor: "red",
        borderRadius: 5,
        padding: 8,
        marginLeft: 10,
        color: "white",
    },
    messageText: {
        color: "black",
        fontStyle: "italic",
    },
});
export default Demande;