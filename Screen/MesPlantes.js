import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import Plante from "../Component/Plante";

function MesPlantes() {
    const [PlantesList, setPlantes] = useState([]);
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

        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios
                .get("http://codx.fr:8080/GetPlantByUser/" + value)
                .then((response) => {
                    setPlantes(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        GetUserMail();
    }, []);


    const handleModifyPlante = (plante) => {
        navigation.navigate('ModifyPlante', { plante, typesPlante: ListTypePlant });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}> Mes Plantes </Text>
            <View style={[styles.addButtonContainer, { marginBottom: 20 }]}>
                <Pressable
                    style={styles.addButton}
                    onPress={() => {
                        navigation.navigate('CreatePlante');
                    }}
                >
                    <Text style={styles.addButtonLabel}>Ajouter une plante</Text>
                </Pressable>
            </View>


            <ScrollView style={{ padding: 20 }}>
                {PlantesList.map((item) => {
                    return (
                        <View key={item.idPlante} style={{ marginTop: 5 }}>
                            <Plante
                                idPlante={item.idPlante}
                                url={item.urlPhoto}
                                nom={item.nom}
                                description={item.description}
                                idtype={item.idTypePlante}
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
        fontSize: 42,
        color: "#46a094",
        fontWeight: "bold",
        marginTop: 50,
        paddingTop: 20
    },
});

export default MesPlantes;
