import React from "react";
import axios from "axios";
import react, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

function Annonce(props) {

    const [Photo, setPhoto] = useState([])

    useEffect(() => {
        axios({
            method: 'GET',
            url: "http://codx.fr:8080/GetUrlPhotoByUserID/" + props.idUser
        }).then((resp) => {
            setPhoto(resp.data)
        })

    }, [])
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
                    <Text style={styles.label}>Gardée par: {props.pseudoTest}</Text>
                    <Text style={styles.expertise}>{props.niveauExpertiseString}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: "black",
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
        marginBottom: 10,
        alignSelf: "center",
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
    },
    separator: {
        height: 1,
        backgroundColor: "green",
        marginVertical: 5,
    },
});

export default Annonce;
