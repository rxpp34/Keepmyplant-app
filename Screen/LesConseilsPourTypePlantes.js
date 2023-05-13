import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable, ScrollView } from "react-native";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";

function LesConseilsPourTypePlantes() {
    const navigation = useNavigation();
    const route = useRoute();
    const [idTypePlante, setidTypePlante] = useState(route.params._idtype);
    const [libelle, setLibelle] = useState(route.params._libelle)
    const [AllConseils, setAllConseils] = useState([]);
    const [TypePlante, setTypePlante] = useState("");

    useEffect(() => {

        axios({
            method: 'GET',
            url: "http://codx.fr:8080/GetTypePlantById/" + idTypePlante
        }).then((resp) => {
            setTypePlante(resp.data[0])
        });

        axios({
            method: 'GET',
            url: "http://codx.fr:8080/GetConseilAndUserByTypePlant/" + idTypePlante
        }).then((resp) => {
            setAllConseils(resp.data)
        });
    }, [])

    function navigateToConseil(mail) {
        navigation.navigate("VisitProfil", {
            _mail: mail,
        });
    }

    return (
        <View>
            <Pressable style={styles.PressableRetourRecherche} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 22 }}> &lt; Retour </Text>
            </Pressable>
            <Text style={styles.title}> Conseil pour {libelle}</Text>
            <View style={styles.container}>
                <View style={styles.photoCard}>
                    <Image source={{ uri: TypePlante.urlPhoto }} style={styles.image} />
                </View>
                <Text style={styles.description}>{TypePlante.description}</Text>
            </View>

            <View style={styles.conseilsContainer}>
                <Text style={styles.conseilsTitle}>Liste des conseils</Text>
                <ScrollView>
                    {AllConseils.map((item, index) => (
                        <View key={index} style={styles.conseilCard}>
                            <View style={styles.conseilCardContent}>
                                <Text style={styles.conseilTitre}>{item.titre}</Text>
                                <Text style={styles.conseilDescription}>Conseil : {item.description}</Text>
                                <Text style={styles.conseilPseudo}>Posté par : {item.pseudo}</Text>
                            </View>
                            <TouchableOpacity style={styles.buttonEnSavoirPlus} onPress={() => navigateToConseil(item.mail)}>
                                <Text style={styles.buttonEnSavoirPlusText}>Visiter profil</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    title:
    {
        fontSize: 26,
        color: "#46a094",
        fontWeight: "bold",
        marginTop: 30,
        marginLeft: '3%',
    },

    PressableRetourRecherche:
    {
        marginTop: 60,
        marginLeft: '3%',
        borderWidth: 3,
        width: '26%',
        textAlign: 'center',
        backgroundColor: "#46a094",
        borderColor: "#46a094",
        borderRadius: 7,
    },
    container: {
        overflow: "hidden",
        backgroundColor: "white",
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "black",
    },
    photoCard: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    description: {
        color: "black",
        fontWeight: "normal",
        textAlign: "center",
        padding: 10,
    },
    conseilsTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: "#46a094",
    },
    conseilsContainer: {
        marginVertical: 10,
    },
    conseilCard: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 8,
        borderColor: "black",
        borderWidth: 1,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    conseilCardContent: {
        flex: 1,
    },
    conseilTitre: {
        fontWeight: "bold",
        marginBottom: 5,
        color: "rgb(0, 151, 93)",
        fontSize: 16,
    },
    conseilDescription: {
        marginBottom: 5,
        color: "black",
    },
    conseilPseudo: {
        fontStyle: "italic",
        marginBottom: 5,
    },
    buttonEnSavoirPlus: {
        backgroundColor: "#F6F6F6",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonEnSavoirPlusText: {
        color: "black",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default LesConseilsPourTypePlantes;