import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
// ...
import axios from "axios";
import Conseil from "../Component/Conseil";
import AsyncStorage from '@react-native-async-storage/async-storage';

function MesConseils() {
    const [ConseilsList, setConseils] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();
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
            ConseilBotanniste();
        }, [])
    );

    const ConseilBotanniste = () => {
        axios
            .get("http://codx.fr:8080/GetConseilsByBotaniste/" + User.mail)
            .then((response) => {
                setConseils(response.data);
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
            <Text style={styles.title}> Mes conseils</Text>
            <View style={[styles.addButtonContainer, { marginBottom: 20 }]}>
                <Pressable
                    style={styles.addButton}
                    onPress={() => {
                        navigation.navigate('CreateConseil');
                    }}
                >
                    <Text style={styles.addButtonLabel}>Ajouter un conseil</Text>
                </Pressable>
            </View>


            <ScrollView style={{ padding: 20 }}>
                {ConseilsList.map((item) => {
                    return (
                        <View key={item.idConseil} style={{ marginTop: 5 }}>
                            <Conseil
                                idConseil={item.idConseil}
                                titre={item.titre}
                                description={item.description}
                                libelle={item.libelle}
                                urlPhoto={item.urlPhoto}
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
    addButtonContainer: {
        marginTop: 50,
        alignItems: "center",
    },
    addButton: {
        cursor: "pointer",
        paddingHorizontal: 40,
        height: 45,
        borderRadius: 7,
        backgroundColor: "#6BBD99",
        justifyContent: "center", // Alignement vertical au centre
        alignItems: "center", // Alignement horizontal au centre
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 4,
    },
    buttonContent: {
        justifyContent: "center", // Alignement vertical au centre
        alignItems: "center", // Alignement horizontal au centre
    },
    addButtonLabel: {
        color: "#fff",
        fontWeight: "400",
        fontSize: 16,
        textAlign: "center",
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

export default MesConseils;
