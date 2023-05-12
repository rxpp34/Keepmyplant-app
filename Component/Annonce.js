import React from "react";
import axios from "axios";
import react, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

function Annonce(props) {
    const navigation = useNavigation();
    const [Photo, setPhoto] = useState([])

    useEffect(() => {
        axios({
            method: 'GET',
            url: "http://codx.fr:8080/GetUrlPhotoByUserID/" + props.idUser
        }).then((resp) => {
            setPhoto(resp.data)
        })

    }, [])

    function GoToModif() {
        navigation.navigate("GestionDemandeAnnonce", {
            _idAnnonce: props.idAnnonce,
        });
    }
    return (
        <View style={styles.container}>
            <View style={styles.cardContent}>
                <Text style={styles.reference}>{props.reference}</Text>
                <View style={styles.dateContainer}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateText}>
                            Du {props.dateDebut} au {props.dateFin}
                        </Text>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.separator}></View>
                    <Text style={styles.label}>{props.description}</Text>
                    <View style={styles.separator}></View>

                    <View style={styles.ViewPhoto}>
                        {Photo.map((item) => {
                            const temp = Dimensions.get('screen').width - (0.068 * Dimensions.get('screen').width)
                            const widthPhoto = temp / Photo.length
                            return (<Image source={{ uri: item.UrlPhoto }} style={{ width: widthPhoto, height: "100%", borderRadius: 5 }} />)
                        })}

                    </View>
                    <View style={styles.separator}></View>
                    <Text style={styles.label}> <Text style={{ fontWeight: 'bold' }}> Gardée par: </Text> {props.pseudoTest}</Text>
                    <Text style={styles.expertise}>{props.niveauExpertiseString}</Text>
                </View>
                <View style={styles.separator}></View>
                <View style={[styles.optionCard, { alignSelf: 'flex-end' }]}>
                    <TouchableOpacity title="GestionDemande" onPress={() => GoToModif()}>
                        <Text style={styles.modifierButton}>Gestion reservation</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 10,
        backgroundColor: "white",
        marginBottom: 20,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: '#46a094',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    optionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
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
    },
    ViewPhoto: {
        width: "98%",
        height: 100,
        marginTop: 3,
        marginLeft: '1%',
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    cardContent: {
        flexDirection: "column",
        padding: 10,
    },
    reference: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#46a094",
        alignSelf: "center",
        marginBottom: 10,
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 5,
    },
    dateBox: {
        backgroundColor: "#46a094",
        borderWidth: 1,
        borderColor: "#46a094",
        borderRadius: 5,
        padding: 5,
    },
    dateText: {
        fontSize: 14,
        color: "white",
        textAlign: "center",
        marginTop: 5,
    },
    content: {
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    expertise: {
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 16,
        color: "black",
        marginTop: 10
    },
    separator: {
        height: 1,
        backgroundColor: "green",
        marginVertical: 5,
    },
});

export default Annonce;
