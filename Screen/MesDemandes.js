import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
// ...
import axios from "axios";
import Demande from "../Component/Demande";

function MesDemandes() {
    const [DemandeList, setDemandes] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            Reservation();
        }, [])
    );

    const Reservation = () => {
        axios
            .get("http://codx.fr:8080/GetReservation/alicia.lefebvre@gmail.com")
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
                Mes demandes
            </Text>

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
    },
});

export default MesDemandes;
