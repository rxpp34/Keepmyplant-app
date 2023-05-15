import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
// ...
import axios from "axios";
import Demande from "../Component/Demande";

function MesDemandes() {
    const [DemandeList, setDemandes] = useState([]);
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
        GetUserMail();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            Reservation();
        }, [])
    );

    const Reservation = () => {
        axios
            .get("http://codx.fr:8080/GetReservation/" + User.mail)
            .then((response) => {
                setDemandes(response.data);
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
            <Text style={styles.title}> Mes demandes de gardinages</Text>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {DemandeList.map((item) => {
                    return (
                        <View key={item.idPlante} style={{ marginTop: 5 }}>
                            <Demande
                                idReservation={item.idReservation}
                                reference={item.reference}
                                description={item.description}
                                dateDebut={item.dateDebut}
                                dateFin={item.dateFin}
                                validation={item.validation}
                            />
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
        marginTop: 30,
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

export default MesDemandes;
