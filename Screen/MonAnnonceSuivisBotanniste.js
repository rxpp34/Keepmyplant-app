import React from "react";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



function AnnonceSuivisBotanniste() {
    const navigation = useNavigation();
    const route = useRoute();
    const [AnnonceReserve, setAnnonceReserve] = useState("")
    const [Photos, setPhotos] = useState([])
    const [Proprio, setProprio] = useState("")
    const [_description, setDescription] = useState("")
    const currentDate = new Date(); // pour controle lors de l'ajout de la photo 
    const [User, setUser] = useState("")

    const GetUserMail = async () => {
        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetUserByMail/" + value
            }).then((resp) => {
                setUser(resp.data[0])
            }).catch((err) => {
                alert(err)
            });
        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        GetUserMail();
    }, []);

    // comportement
    useEffect(() => {
        axios({
            method: 'GET',
            url: "http://codx.fr:8080/GetFollowAnnonce/" + User.mail
        }).then((resp) => {
            setAnnonceReserve(resp.data[0])
        });
    }, [])

    useEffect(() => {
        if (AnnonceReserve.idAnnonce) {
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetPhotosByAnnoncesWithComments/" + AnnonceReserve.idAnnonce
            }).then((resp) => {
                setPhotos(resp.data);
            });
        }
    }, [AnnonceReserve.idAnnonce])

    useEffect(() => {
        if (AnnonceReserve.idAnnonce) {
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetProprioByAnnonce/" + AnnonceReserve.idAnnonce
            }).then((resp) => {
                setProprio(resp.data[0]);
            });
        }
    }, [AnnonceReserve.idAnnonce]);


    function UpdatePhotos(idPhoto) {
        axios({
            method: "POST",
            url: "http://codx.fr:8080/AddCommentsForFollow/" + User.mail + "/" + AnnonceReserve.idAnnonce + "/" + idPhoto,
            data: {
                description: _description,
            }
        }).then((resp) => {
            if (resp.data === 'OK') {
            }
        })
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.PressableRetourRecherche} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 22 }}> &lt; Retour </Text>
            </Pressable>
            <Text style={styles.title}> Suivis Annonce</Text>
            <View style={styles.panel}>
                <Text style={styles.reservation}> N° {AnnonceReserve.reference}</Text>
                <View style={styles.dateContainer}>
                    <View style={styles.dateBox}>
                        <Text style={styles.dateText}>
                            Du {AnnonceReserve.dateDebut} au {AnnonceReserve.dateFin}
                        </Text>
                    </View>
                </View>
                <Text style={styles.panelText}>Propriétaire des plantes : {Proprio.pseudo}</Text>
                <Text style={styles.panelText}>Nom : {Proprio.nom}</Text>
                <Text style={styles.panelText}>Prénom : {Proprio.prenom}</Text>
                <Text style={styles.panelText}>Téléphone : {Proprio.telephone}</Text>

                <View style={styles.separator}></View>
                <Text style={styles.panelText}>{AnnonceReserve.description}</Text>
                <View style={styles.separator}></View>

                <Text style={styles.NiveauExeprtise}>{
                    AnnonceReserve.idNiveauExpertiseRequis === 1 ? "Débutant" :
                        AnnonceReserve.idNiveauExpertiseRequis === 2 ? "Intermédiaire" :
                            AnnonceReserve.idNiveauExpertiseRequis === 3 ? "Expert" : ""
                }</Text>
            </View>
            <Text style={styles.conseilsTitle}>Détail</Text>
            <ScrollView>
                {Photos.map((item) => (
                    <View style={styles.photoContainer}>
                        <View key={item.idPhoto}>
                            <Text style={styles.photoText}>Date postée : {item.datePoste}</Text>
                            {item.urlPhoto ? (
                                <View style={styles.imageContainer}>
                                    <Image style={styles.image} source={{ uri: item.urlPhoto }} />
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.photoText}>Aucune photo pour cette date !</Text>
                                </View>
                            )}
                            {item.description ? (
                                <Text style={styles.photoText}>Commentaire : {item.description}</Text>
                            ) : (
                                <View>
                                    {item.urlPhoto ? (
                                        <View>
                                            <Text style={styles.panelText}>Description</Text>
                                            <TextInput style={styles.input} value={_description} onChangeText={setDescription} placeholder="Description" />
                                            <View style={styles.buttonContainer}>
                                                <TouchableOpacity style={styles.button} onPress={() => UpdatePhotos(item.idPhoto)}>
                                                    <Text style={styles.buttonText}>Enregistrer</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    ) : (
                                        <View>
                                            {new Date(item.datePoste).toDateString() < currentDate.toDateString() ? (
                                                <Text style={styles.photoText}>Date limite pour poster la photo dépassée !</Text>
                                            ) : (
                                                <Text style={styles.photoText}>Revenez le {item.datePoste} pour ajouter une photo.</Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    reservation: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'right',
        marginRight: 10,
        textAlign: 'right',
    },
    conseilsTitle: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: "#46a094",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        marginTop: 10,
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
    selectedImageContainer: {
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        overflow: 'hidden',
        alignItems: 'center',
    },
    selectedImage: {
        width: '100%',
        height: 200,
    },
    panel: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
    },
    panelText: {
        marginBottom: 5,
    },
    NiveauExeprtise: {
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'flex-start'
    },

    imageContainer: {
        height: 200,
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    photoContainer: {
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'black',
        padding: 5,
        width: 300,
    },
    photoText: {
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
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
    separator: {
        height: 1,
        backgroundColor: "green",
        marginVertical: 5,
    },
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
});

export default AnnonceSuivisBotanniste; 
