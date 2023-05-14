import react from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableOpacity,Keyboard ,ScrollView} from "react-native";
import { useState ,useEffect} from "react";
import DateTimePicker from  "@react-native-community/datetimepicker" ;
import axios from "axios"
import { useNavigation,useRoute } from "@react-navigation/native";
import LogoEdit from "../assets/Edit.png"
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EditProfil() 
{
    const navigation=useNavigation() ;
    const route=useRoute() ; 
    const [idUser,setidUser]=useState(route.params._IdUser)
    const [Nom,setNom]=useState(route.params._Nom) ;
    const [Prenom,setPrenom]=useState(route.params._Prenom)
    const [Telephone,setTelephone]=useState(route.params._Telephone)
    const [Pseudo,setPseudo]=useState(route.params._Pseudo)
    const [Photodeprofil,setPhotodeprofil]=useState(route.params._PhotoDeProfil)
    const [IdAdresse,setIdAdresse]=useState(route.params._IdAdresse)
    const [Voie,setVoie]=useState(route.params._Voie)
    const [Rue,setRue]=useState(route.params._Rue)
    const [Ville,setVille]=useState(route.params._Ville)
    const [CP,setCP]=useState(route.params._CP)

    const handleChoosePhoto = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            console.log('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (!pickerResult.canceled) {
            setPhotodeprofil(pickerResult.uri); // Enregistre le lien de la photo sélectionnée

            // Enregistrer le lien dans le stockage local de l'application
            try {
                await AsyncStorage.setItem('selectedPhotoUri', pickerResult.uri);
            } catch (error) {
                console.log('Error saving selected photo URI:', error);
            }
        }
    };


    function UpdateInfoProfil()
    {
        axios({
            method :"POST" ,
            url :"http://codx.fr:8080/UpdateInfoProfil/"+Nom+"/"+Prenom+"/"+Telephone+"/"+Pseudo+'/'+idUser
        }).then((resp) => {
            if(resp.data==="OK")
            {
                axios({
                    method : 'POST',
                    url : "http://codx.fr:8080/UpdateAdresse/" + Voie+"/"+Rue+"/"+Ville+"/"+CP+"/"+IdAdresse
                })
            }
        })


        navigation.goBack() ; 
    }



    return(
        <View style={CSS.MainView}>
            <Pressable style={CSS.PressableRetourRecherche} onPress={() => navigation.goBack()}>
                <Text style={{ color: "white", fontSize: 22 }}> &lt; Retour </Text>
            </Pressable>

            <ScrollView style={{marginBottom :100}}>
                <Image source={{uri :Photodeprofil}} style={CSS.PhotoDeProfil}/>
                <TouchableOpacity title="Modifier" onPress={handleChoosePhoto}>
                        <Image source={LogoEdit} style={CSS.supprimerButton}/>
                </TouchableOpacity>

                <Text style={CSS.TextInputTitle}> Nom </Text>
                <TextInput value={Nom} onChangeText={setNom} style={CSS.TextInputData}/>

                <Text style={CSS.TextInputTitle}> Prénom </Text>
                <TextInput value={Prenom} onChangeText={setPrenom} style={CSS.TextInputData}/>

                <Text style={CSS.TextInputTitle}> Téléphone </Text>
                <TextInput value={Telephone} onChangeText={setTelephone} style={CSS.TextInputData} keyboardType="numeric"/>

                <View style={CSS.VerticalLine} />

                <Text style={CSS.TextInputTitle}> Adresse </Text>
                <View style={[CSS.ViewAdresse1, { marginBottom: 20 }]}>
                    <TextInput value={Voie} onChangeText={setVoie} keyboardType="numeric" 
                                style={{
                                    borderWidth : 2 , 
                                    borderColor : "#46a094",
                                    width : "15%",
                                    marginLeft :"5%",
                                    fontSize : 22 , 
                                    borderRadius : 8,
                                    padding : 8 ,
                                    color : "grey",
                                    textAlign :'center'
                                }}/>

                    <TextInput value={Rue} onChangeText={setVoie} 
                                style={{
                                    borderWidth : 2 , 
                                    borderColor : "#46a094",
                                    width : "70%",
                                    marginLeft :"5%",
                                    fontSize : 22 , 
                                    borderRadius : 8,
                                    padding : 8 ,
                                    color : "grey",
                                }}/>
                </View>

                <View style={CSS.ViewAdresse1}>
                    <TextInput value={CP} onChangeText={setCP} keyboardType="numeric" 
                                style={{
                                    borderWidth : 2 , 
                                    borderColor : "#46a094",
                                    width : "25%",
                                    marginLeft :"5%",
                                    fontSize : 22 , 
                                    borderRadius : 8,
                                    padding : 8 ,
                                    color : "grey",
                                    textAlign :'center'
                                }}/>

                    <TextInput value={Ville} onChangeText={setVille} 
                                style={{
                                    borderWidth : 2 , 
                                    borderColor : "#46a094",
                                    width : "60%",
                                    marginLeft :"5%",
                                    fontSize : 22 , 
                                    borderRadius : 8,
                                    padding : 8 ,
                                    color : "grey",
                                }}/>
                </View>

                <Pressable style={CSS.Modifier} onPress={() => {UpdateInfoProfil()}}>
                    <Text style={CSS.TextGoButton}> Valider </Text>
                </Pressable>
            </ScrollView>
            

        </View>
    )
}

const CSS=StyleSheet.create({
    MainView: {
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
        width: '26%',
        textAlign: 'center',
        backgroundColor: "#46a094",
        borderColor: "#46a094",
        borderRadius: 7,
    },

    PhotoDeProfil : 
    {
        width : 150 , 
        height : 150,
        marginTop : 30 ,
        marginLeft : "33%",
        borderRadius :'50%' 
    },

    supprimerButton: {
        height: 38,
        width : 38,
        marginLeft : '45%',
        marginBottom : 30
      
    },

    TextInputTitle : 
    {
        fontSize : 26,
        color : "#46a094",
        marginLeft : "5%",
        fontWeight : 'bold',
        marginTop : 20,
        marginBottom : 10
    }
    ,
    TextInputData :  
    {
        borderWidth : 2 , 
        borderColor : "#46a094",
        width : "90%",
        marginLeft :"5%",
        fontSize : 22 , 
        borderRadius : 8,
        padding : 8 ,
        color : "grey"
    },
    VerticalLine: {
        borderWidth: 1,
        borderColor: "grey",
        marginTop: 20,
        width: "96%",
        marginLeft: '2%'
    },
    ViewAdresse1 : 
    {
        display :'flex',
        flexDirection : 'row',
    },
    Modifier: {
        marginTop: 50,
        marginBottom: 50,
        borderWidth: 3,
        width: '50%',
        textAlign: 'center',
        backgroundColor: "transparent",
        borderColor: "#53ba4e",
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
        color: '#53ba4e',
        paddingHorizontal: 10,
        paddingVertical: 5

    }
})

export default EditProfil ; 

