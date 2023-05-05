import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import axios from "axios";
import Annonce from "../Component/Annonce";

function MesAnnonces() {
    const [annonceList, setAnnonces] = useState([]);

    useEffect(() => {
        TrouverAnnonces();
    }, []);

    const TrouverAnnonces = () => {
        axios
            .get("http://codx.fr:8080/LoadPostAnnonces/alicia.lefebvre@gmail.com")
            .then((response) => {
                setAnnonces(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes annonces</Text>

            <ScrollView>
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
});

export default MesAnnonces;
