import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Pressable } from "react-native";
import axios from "axios";
import Annonce from "../Component/Annonce";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MesAnnonces() {
    const [annonceList, setAnnonces] = useState([]);
    const navigation = useNavigation();
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
        TrouverAnnonces();
        GetUserMail();
    }, []);

    const TrouverAnnonces = () => {
        axios
            .get("http://codx.fr:8080/LoadPostAnnonces/" + User.mail)
            .then((response) => {
                setAnnonces(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <View style={styles.container}>
            <Pressable style={styles.PressableRetourRecherche} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 22 }}> &lt; Retour </Text>
            </Pressable>
            <Text style={styles.title}> Mes annonces postés</Text>


            <ScrollView style={{ marginTop: 30 }}>
                {annonceList.map((item) => (
                    <View key={item.idAnnonce} style={styles.annonceContainer}>
                        <Annonce
                            idUser={item.idUser}
                            dateDebut={item.dateDebut}
                            dateFin={item.dateFin}
                            reference={item.reference}
                            description={item.description}
                            niveauExpertiseRequis={item.idNiveauExpertiseRequis}
                            pseudoTest={item.pseudoTest}
                            niveauExpertiseString={
                                item.idNiveauExpertiseRequis === 1
                                    ? "Débutant"
                                    : item.idNiveauExpertiseRequis === 2
                                        ? "Connaisseur"
                                        : item.idNiveauExpertiseRequis === 3
                                            ? "Professionnel"
                                            : ""
                            }
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginTop: 100,
        marginLeft: "10%",
        fontSize: 32,
        fontWeight: "bold",
        color: "#46a094",
    },
    annonceContainer: {
        marginTop: 10,
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

export default MesAnnonces;
