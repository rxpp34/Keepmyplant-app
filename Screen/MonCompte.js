import react from "react";
import { Text, View, Image, StyleSheet, TextInput, Pressable, ScrollView, Keyboard, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import axios from "axios";

function MonCompte() {
    const navigation = useNavigation();
    const [User, setUser] = useState("")
    const [UserMail, setUserMail] = useState("")

    const [Annonce, setAnnonce] = useState("")
    const [AnnonceReserve, setAnnonceReserve] = useState("")
    const [AnnonceBotaniste, setAnnonceBotaniste] = useState("")


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
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetFollowAnnonce/" + value
            }).then((resp) => {
                setAnnonceBotaniste(resp.data[0])
            }).catch((err) => {
                alert(err)
            });
        } catch (error) {
            alert(error);
        }

        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetAnnoncesReserved/" + value
            }).then((resp) => {
                setAnnonceReserve(resp.data[0])
            }).catch((err) => {
                alert(err)
            });
        } catch (error) {
            alert(error);
        }

        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetAnnoncesActive/" + value
            }).then((resp) => {
                setAnnonce(resp.data[0])
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

    return (
        <ScrollView style={CSS.MainView}>
            <Text style={CSS.title}> Mon Compte </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Profil', { _UserMail: User.mail })}>
                <View style={CSS.ViewInfoPerso}>
                    <Image source={require('../assets/Info.png')} style={{ width: 48, height: 48 }} />
                    <Text style={CSS.TextInfoPerso} > Informations personnelles </Text>
                </View>
            </TouchableOpacity>

            <View style={CSS.VerticalLine} />

            {User.idRole === 2 &&

                <TouchableOpacity onPress={() => navigation.navigate('MesConseils')}>
                    <View style={CSS.ViewDemande}>
                        <Image source={require('../assets/Demande.png')} style={{ width: 96, height: 96 }} />
                        <Text style={CSS.TextDemande} > Mes conseils </Text>
                    </View>
                </TouchableOpacity>

            }

            {User.idRole === 2 && AnnonceBotaniste && AnnonceBotaniste.length !== 0 && AnnonceBotaniste.active == 1 && (

                <TouchableOpacity onPress={() => navigation.navigate('MonAnnonceSuivisBotanniste')}>
                    <View style={CSS.ViewDemande}>
                        <Image source={require('../assets/Demande.png')} style={{ width: 96, height: 96 }} />
                        <Text style={CSS.TextDemande} > Mon suivis annonce </Text>
                    </View>
                </TouchableOpacity>

            )}

            {User.idRole === 1 && AnnonceReserve && AnnonceReserve.length !== 0 && AnnonceReserve.active == 1 && (

                <TouchableOpacity onPress={() => navigation.navigate('MonAnnonceSuivis')}>
                    <View style={CSS.ViewDemande}>
                        <Image source={require('../assets/Demande.png')} style={{ width: 96, height: 96 }} />
                        <Text style={CSS.TextDemande} > Mon suivis annonce </Text>
                    </View>
                </TouchableOpacity>

            )}


            {User.idRole === 1 && Annonce && Annonce.length !== 0 && (

                <TouchableOpacity onPress={() => navigation.navigate('MesAnnonces')}>
                    <View style={CSS.ViewAnnonce}>
                        <Image source={require('../assets/Annonce.png')} style={{ width: 96, height: 96 }} />
                        <Text style={CSS.TextAnnonce} > Mes annonces postées</Text>
                    </View>
                </TouchableOpacity>
            )}


            {User.idRole === 1 &&

                <TouchableOpacity onPress={() => navigation.navigate('MesDemandes')}>
                    <View style={CSS.ViewDemande}>
                        <Image source={require('../assets/Demande.png')} style={{ width: 96, height: 96 }} />
                        <Text style={CSS.TextDemande} > Mes demandes de gardinages </Text>
                    </View>
                </TouchableOpacity>
            }


            {User.idRole === 1 &&
                <View style={CSS.ViewAnnonce}>
                    <Image source={require('../assets/PlanteGarder.png')} style={{ width: 96, height: 96 }} />
                    <Text style={CSS.TextAnnonce} > Plantes Gardées </Text>
                </View>
            }



            <View style={CSS.VerticalLine} />


            <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordFromProfil')}>
            <View style={CSS.ViewInfoPerso}>
                <Image source={require('../assets/Password.png')} style={{ width: 48, height: 48 }} />
                <Text style={CSS.TextInfoPerso} > Réinitialiser mot de passe</Text>
            </View>
            </TouchableOpacity>



            <Pressable style={CSS.Logout} >
                <Text style={CSS.TextGoButton}> Se déconnecter </Text>
            </Pressable>
        </ScrollView>
    )
}




const CSS = StyleSheet.create({
    MainView: {
        width: '100%',
        height: 'auto',
        marginTop: 70
    },

    title:
    {
        fontSize: 42,
        color: "#46a094",
        fontWeight: "bold"
    },

    ViewDemande:
    {
        width: '96%',
        height: 100,
        borderWidth: 3,
        marginLeft: '2%',
        borderColor: 'red',
        backgroundColor: 'white',
        borderColor: "white",
        borderRadius: 7,
        marginTop: 20,
        shadowColor: '#46a094',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.32,
        shadowRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',

    },
    TextDemande:
    {
        width: '70%',
        fontSize: 19,
        color: "#46a094",
        marginTop: 30,
        fontWeight: "bold",
        marginLeft: '3%'

    },

    ViewAnnonce: {
        width: '96%',
        height: 100,
        borderWidth: 3,
        marginLeft: '2%',
        borderColor: 'red',
        backgroundColor: 'white',
        borderColor: "white",
        borderRadius: 7,
        marginTop: 20,
        shadowColor: '#46a094',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.32,
        shadowRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    TextAnnonce: {
        width: '70%',
        fontSize: 19,
        color: "#46a094",
        marginTop: 10,
        fontWeight: "bold",
        marginLeft: '3%'
    },

    VerticalLine: {
        borderWidth: 1,
        borderColor: "#46a094",
        marginTop: 20,
        width: "90%",
        marginLeft: '5%'
    },

    ViewInfoPerso:
    {
        width: '96%',
        height: 50,
        borderWidth: 3,
        marginLeft: '2%',
        borderColor: 'red',
        backgroundColor: 'white',
        borderColor: "white",
        borderRadius: 7,
        marginTop: 20,
        shadowColor: '#46a094',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.32,
        shadowRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextInfoPerso:
    {
        width: '70%',
        fontSize: 19,
        color: "#46a094",
        fontWeight: "bold",
        marginLeft: '3%'

    },

    Logout: {
        marginTop: 40,
        borderWidth: 3,
        width: '50%',
        textAlign: 'center',
        backgroundColor: "transparent",
        borderColor: "#f71a0a",
        borderRadius: 7,
        marginLeft: '25%'
    },

    TextGoButton: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: '#f71a0a',
        paddingHorizontal: 10,
        paddingVertical: 5

    }
})

export default MonCompte; 