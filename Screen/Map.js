import react from "react";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, View, Image, StyleSheet, TextInput, Button, Pressable, ScrollView, Keyboard } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Marker } from 'react-native-maps';
import MapView from "react-native-maps";
import axios from "axios";
import { REACT_APP_SERVER } from "@env"
import CardMap from "../Component/Card_Map";



function Map({ route }) {
    const navigation = useNavigation();
    const { _DateDebut, _DateFin, _Niveau, _Ville, Lat, Lng } = route.params
    const [_initialRegion, setinitialRegion] = useState({})
    const [Annonce, setAnnonce] = useState([])
    const [SwitcherMode, setSwitcherMode] = useState(false)

      const GetUserMail = async () => {
        try {
            const value = await AsyncStorage.getItem("UserMail");
            
        axios({  // POUR TROUVER UNE PLANTE SELON LA VILLE ET LES DATES
            method: "GET",
            url: "http://codx.fr:8080/Search_plante_by_location_and_date/"+_Ville+"/"+_Niveau+"/null/null/"+value
        }).then((response) => {
            if(response.data!='AUCUNE ANNONCE')
            {
                setAnnonce(response.data)
            }
        }).catch((err) => {
            console.log(url)
        })
        } catch (error) {
            alert(error);
        }

        
  
    };
    
    useEffect(() => {
        GetUserMail();
    }, []);







    function GoToReserve(data) {
        navigation.navigate("ReserveAnnonce",
            {
                _idAnnonce: data.idAnnonce,
                _iduser: data.idUser,
                _nom: data.nom,
                _prenom: data.prenom,
                _mail: data.mail,
                _urlPhoto: data.photodeprofil,
                _date_debut: data.dateDebut,
                _date_fin: data.dateFin,
                _description: data.description,
                _cycle: data.idCycleCompteRendu,
                _expertise: data.idNiveauExpertiseRequis
            })
    }

    return (
        <View style={CSS.MapView}>
            <Pressable style={CSS.PressableRetourRecherche} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 22 }}> &lt; Modifier ma recherche </Text>
            </Pressable>

            <View style={CSS.ViewSwitcher}>
                <Pressable style={{ borderRightWidth: 2, borderRightColor: "#46a094" }} onPress={() => { setSwitcherMode(false) }}>
                    <Text style={{ color: SwitcherMode ? "grey" : "#46a094", fontSize: 26, fontWeight: "bold" }}> Liste({Annonce.length}) </Text>
                </Pressable>

                <Pressable onPress={() => { setSwitcherMode(true) }}>
                    <Text style={{ color: SwitcherMode ? "#46a094" : "grey", fontSize: 26, fontWeight: "bold" }}> Carte({Annonce.length}) </Text>
                </Pressable>
            </View>


            {
                SwitcherMode ?

                    

                    <MapView style={CSS.map} initialRegion={{ latitude: Lat, longitude: Lng, latitudeDelta: 0.1, longitudeDelta: 0.1, }}>
                        {Annonce.map((item) => {
                            const desc = "Adresse: " + item.voie + " " + item.rue + " " + " - " + item.ville + '\n' + item.description
                            return (<Marker  onPress={() => { GoToReserve(item) }} key={item.idAnnonce} coordinate={{ latitude: item.lat, longitude: item.lgt }} title={item.nom + " " + item.prenom} description={desc} image={require("../assets/favicon-32x32.png")} />)
                        })}
                    </MapView>

                    :
                    Annonce.length===0 ? <Text style={CSS.AucuneAnnonce}> Aucune annonce trouvé </Text> : 
                    <ScrollView style={CSS.ViewCard}>
                        {Annonce.map((item) => {
                            return (<CardMap key={item.idAnnonce} Date_Fin={item.dateFin} Date_Debut={item.dateDebut} ville={item.ville} expertise={item.idNiveauExpertiseRequis}
                                url_pdp={item.photodeprofil} idUser={item.idUser} description={item.description} cycle={item.idCycleCompteRendu}
                                nom={item.nom} prenom={item.prenom} mail={item.mail} reference={item.reference} idAnnonce={item.idAnnonce} />)
                        })}

                    </ScrollView>

            }


        </View>
    )
}

const CSS = StyleSheet.create({
    MapView: {
        marginTop: 50,
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    PressableRetourRecherche:
    {
        marginTop: 10,
        marginLeft: '3%',
        borderWidth: 3,
        width: '62%',
        textAlign: 'center',
        backgroundColor: "#46a094",
        borderColor: "#46a094",
        borderRadius: 7,
    },
    map: {
        width: '100%',
        height: '95%',
        marginTop: 15,
        borderRadius: 5
    },

    ViewSwitcher:
    {
        width: '37%',
        display: 'flex',
        flexDirection: "row",
        marginLeft: '3%',
        marginTop: 20
    },

    ViewCard:
    {
        width: "100%",
        height: 'auto',
        marginLeft: '1.5%',
        marginTop: 15,
        marginBottom: 50
    },

    AucuneAnnonce : 
    {   
        textAlign : 'center',
        marginTop : 200,
        fontWeight : 'bold',
        fontSize : 26,
        color : "#46a094"
    }
})

export default Map; 