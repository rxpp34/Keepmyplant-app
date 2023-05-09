import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
// ...
import axios from "axios";
import GestionDemande from "../Component/GestionDemande";

function GestionDemandeAnnonce() {
    const [DemandeList, setDemandes] = useState([]);
    const navigation = useNavigation();
    const route = useRoute();

    useFocusEffect(
        React.useCallback(() => {
            Reservation();
        }, [])
    );

    const Reservation = () => {
        axios
            .get("http://codx.fr:8080/GetReservationAnnonce/alicia.lefebvre@gmail.com")
            .then((response) => {
                setDemandes(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={{ marginTop: 100, marginLeft: "10%", fontSize: 32, fontWeight: "bold", color: "#46a094" }}>
                Gestion demande
            </Text>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {DemandeList.map((item) => {
                    return (
                        <View key={item.idReservation} style={{ marginTop: 5 }}>
                            <GestionDemande
                                Reservation={item.idReservation}
                                photo={item.photodeprofil}
                                nom={item.nom}
                                prenom={item.prenom}
                                telephone={item.telephone}
                                numero={item.numero}
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
    },
});

export default GestionDemandeAnnonce;
