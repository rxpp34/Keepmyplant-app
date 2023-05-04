import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
// ...
import axios from "axios";
import Plante from "../Component/Plante";

function MesPlantes() {
    const [PlantesList, setPlantes] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            fetchPlantes();
        }, [])
    );

    const handleModifyPlante = (plante) => {
        navigation.navigate('ModifyPlante', { plante, typesPlante: ListTypePlant });
    };

    const fetchPlantes = () => {
        axios
            .get("http://codx.fr:8080/GetPlantByUser/alicia.lefebvre@gmail.com")
            .then((response) => {
                setPlantes(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 75, marginLeft: "5%", fontSize: 32, fontWeight: "bold", color: "#46a094" }}>
                Mes plantes
            </Text>
            <View style={[styles.addButtonContainer, { marginBottom: 5 }]}>
                <Pressable
                    style={styles.addButton}
                    onPress={() => {
                        navigation.navigate('CreatePlante');
                    }}
                >
                    <Text style={styles.addButtonLabel}>Ajouter une plante</Text>
                </Pressable>
            </View>


            <ScrollView>
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
        padding: 20,
    },
    addButtonContainer: {
        marginTop: 50,
        alignItems: "center",
    },
    addButton: {
        cursor: "pointer",
        paddingHorizontal: 56,
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
});

export default MesPlantes;
