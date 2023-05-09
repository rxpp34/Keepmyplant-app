import react, { useEffect, useState } from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Dimensions} from "react-native";
import axios from "axios"
import {useNavigation} from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

function CardMap(props) 
{
    const navigation  = useNavigation();

    
    const [Photo,setPhoto]=useState([])

    useEffect(() => {
        axios({
            method : 'GET',
            url :"http://codx.fr:8080/GetUrlPhotoByUserID/"+props.idUser
        }).then((resp) => {
            setPhoto(resp.data)
        })
    
    }, [])

    function GoToReserve() 
    {
        navigation.navigate("ReserveAnnonce",
                            {
                            _idAnnonce : props.idAnnonce,
                            _iduser : props.idUser,
                            _nom : props.nom,
                            _prenom : props.prenom,
                            _mail : props.mail,
                            _urlPhoto : props.url_pdp,
                            _date_debut: props.Date_Debut,
                            _date_fin : props.Date_Fin,
                            _description : props.description,
                            _cycle : props.cycle,
                            _expertise : props.expertise})
    }

    return(
        <Pressable style={CSS.MainView} onPress={() => {GoToReserve()}}>
            <View style={CSS.ViewPhoto}>
                {Photo.map((item) => {
                    const temp=Dimensions.get('screen').width-(0.068*Dimensions.get('screen').width)
                    const widthPhoto =temp / Photo.length
                    return (<Image source={{uri : item.UrlPhoto}} style={{width : widthPhoto , height : "100%", borderRadius : 5}}/>)
                })}

            </View>
            <Text style={{color :'#46a094' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :10,fontSize : 20,marginBottom : 10}}> {props.prenom} {props.nom} </Text>
            <Text style={{color :'#46a094' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :10,fontSize : 20}}> {props.ville}</Text>
            <Text style={{color :'#c4e8c2' , 
                          fontWeight : 'bold' ,
                          marginLeft : "3%",
                          fontSize : 20}}> Du <Text style={CSS.DateText}> {props.Date_Debut} </Text> Au <Text style={CSS.DateText}> {props.Date_Fin}</Text> 
            </Text>
            <Text style={{color :'#46a094' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :70,fontSize : 20}}> Nombre de plante à garder : <Text> {Photo.length} </Text> </Text>
            <Text style={{color :'#46a094' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :40,fontSize : 20}}> Reference : {props.reference}</Text>

            <Pressable style={CSS.PressableButtonDemande} onPress={() => {GoToReserve()}}>
                    <Text style={{color :"#18c924",fontSize : 22,padding : 5,fontWeight :'bold',textAlign :'center'}}> Détail et Réservation</Text>
            </Pressable>
             
        </Pressable>
    )
}

const CSS=StyleSheet.create({
    MainView : {
        width : '96%' , 
        height : 480, 
        borderWidth : 3,
        borderColor : 'white',
        marginBottom : 20,
        borderRadius : 5 , 
        backgroundColor : "white",
        shadowColor: '#46a094',
        shadowOffset: {width: 0, height: 18},
        shadowOpacity: 0.32,
        shadowRadius: 20,

    } ,

    PdpNomPrenom : {
        width : "70%",
        display : 'flex' , 
        flexDirection : 'row',
        alignItems : 'center' ,
        marginTop : 10,
        marginLeft : '2%'
    } ,
    DateText : {

        color : "#46a094" , 
        padding : 5,
        borderRadius : 5

    },
    ViewPhoto : {
        width : "98%",
        height : 100 ,
        marginTop : 3 ,
        marginLeft :'1%',
        display : "flex",
        flexDirection : "row",
        justifyContent :"space-around"
    }, 
    PressableButtonDemande : 
    {
        marginTop : 30,
        marginLeft : '20%',
        borderWidth : 3 ,
        width :'65%',
        textAlign :'center',
        backgroundColor :"white",
        borderColor : "#18c924",
        borderRadius :7, 
        marginBottom : 70,
        
    }
})


export default CardMap ; 