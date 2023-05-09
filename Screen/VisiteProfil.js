import react from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard } from "react-native";
import { useState ,useEffect} from "react";
import DateTimePicker from  "@react-native-community/datetimepicker" ;
import axios from "axios"
import { useNavigation,useRoute } from "@react-navigation/native";



function VisitProfil () 
{
    const navigation=useNavigation() ; 
    const route=useRoute() ; 

    const [idUser,setidUser]=useState()
    const [Nom,setNom]=useState("") ;
    const [Mail,setMail]=useState("")
    const [Prenom,setPrenom]=useState("")
    const [Telephone,setTelephone]=useState("")
    const [Pseudo,setPseudo]=useState("")
    const [Photodeprofil,setPhotodeprofil]=useState("")
    const [IdAdresse,setIdAdresse]=useState()
    const [Voie,setVoie]=useState("")
    const [Rue,setRue]=useState("")
    const [Ville,setVille]=useState("")
    const [CP,setCP]=useState("")


    useEffect(() => {
        axios({
            method : 'GET',
            url : "http://codx.fr:8080/GetUserByID/"+route.params._IdUser
        }).then((resp) => {
            setidUser(resp.data[0].idUser)
            setNom(resp.data[0].nom)
            setPrenom(resp.data[0].prenom)
            setMail(resp.data[0].mail)
            setPseudo(resp.data[0].pseudo)
            setTelephone(resp.data[0].telephone)
            setPhotodeprofil(resp.data[0].photodeprofil)
        });

        axios({
            method : 'GET',
            url : "http://codx.fr:8080/GetAdresse/"+route.params._Mail
        }).then((resp) => {
            setVoie(resp.data[0].voie)
            setRue(resp.data[0].rue)
            setVille(resp.data[0].ville)
            setCP(resp.data[0].CP)
            setIdAdresse(resp.data[0].idAdresse)
        });

}, [])


    return(
        <View style={{width : "100%",height: '100%'}}>
            <View style={CSS.ViewBackGround}>
                <Pressable style={CSS.PressableRetour} onPress={() => navigation.goBack()}> 
                    <Text style={{color :"#46a094",fontSize : 22}}> &lt; Retour </Text>
                </Pressable>
            </View>

            <View style={CSS.ViewProfil}>
                <Image source={{uri : Photodeprofil}} style={CSS.PhotoProfil}/>
                <Text style={{textAlign :'center',color :'grey',fontSize : 18}}>{Pseudo} </Text>
                <Text style={CSS.NomPrenom}>{Prenom} {Nom} </Text>

                <View style={{marginBottom : 30}}>
                    <Text style={CSS.ViewTitle}> Adresse mail</Text>
                    <Text style={CSS.ViewData}> alicia.lefebvre@gmail.com </Text>
                </View>
                

                <View style={{marginBottom : 30}}>
                    <Text style={CSS.ViewTitle}> Téléphone </Text>
                    <Text style={CSS.ViewData}> {Telephone} </Text>
                </View>

                <View style={{marginBottom : 30}}>
                    <Text style={CSS.ViewTitle}> Adresse </Text>
                    <Text style={CSS.ViewData}> {Voie} {Rue} {CP} - {Ville} </Text>
                </View>

                <View style={{marginBottom : 30}}>
                    <Text style={CSS.ViewTitle}> Expertise </Text>
                    <Text style={CSS.ViewData}> 
                        {route.params._Expertise===3 ? "Professionnel" : route.params._Expertise===2 ? "Connaisseur" : "Débutant"} 
                    </Text>
                </View>
                
            </View>
        </View>
        
    )
}


const CSS= StyleSheet.create({
    ViewBackGround : 
    {
        width : '100%',
        height : 600,
        backgroundColor : '#46a094',
        borderBottomLeftRadius : '50%',
        borderBottomRightRadius : '50%'
    },

    PressableRetour : {
        marginTop : 60,
        marginLeft : '3%',
        borderWidth : 3 ,
        width :'27%',
        textAlign :'center',
        backgroundColor :"white",
        position : "relative",
        borderColor : "white",
        borderRadius :7,
    },

    ViewProfil : 
    {
        backgroundColor : 'white',
        width : "94%",
        height : 650,
        position : "absolute",
        top : 150,
        marginLeft : '3%', 
        borderRadius : 10
    },

    PhotoProfil : 
    {
        width : 150,
        height : 150,
        borderRadius : "50%",
        alignItems : 'center',
        marginLeft : "30%",
        position : "relative" , 
        top : -50
    },

    NomPrenom : {   
        fontSize : 27,
        color : "#46a094",
        fontWeight : 'bold',
        textAlign :'center',
        marginTop : 0,
        marginBottom : 40
        
    },

    ViewTitle : 
    {
        color : 'grey',
        fontSize : 26,
        marginLeft : '3%'
    },

    ViewData : {
        color : "#46a094",
        fontSize : 24,
        marginLeft : "10%"
    },
    Modifier: {
        marginTop: 40,
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

export default VisitProfil ; 