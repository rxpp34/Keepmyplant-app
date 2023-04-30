import react, { useEffect, useState } from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Dimensions} from "react-native";
import axios from "axios"

function CardMap(props) 
{
    const [Photo,setPhoto]=useState([])

    useEffect(() => {
        axios({
            method : 'GET',
            url :"http://codx.fr:8080/GetUrlPhotoByUserID/"+props.idUser
        }).then((resp) => {
            setPhoto(resp.data)
        })
    
    }, [])


    return(
        <View style={CSS.MainView}>
            <View style={CSS.ViewPhoto}>
                {Photo.map((item) => {
                    const temp=Dimensions.get('screen').width-(0.068*Dimensions.get('screen').width)
                    const widthPhoto =temp / Photo.length
                    return (<Image source={{uri : item.UrlPhoto}} style={{width : widthPhoto , height : "100%", borderRadius : 5}}/>)
                })}

            </View>
            <Text style={{color :'#c4e8c2' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :10,fontSize : 20,marginBottom : 10}}> {props.prenom} {props.nom} </Text>
            <Text style={{color :'#c4e8c2' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :10,fontSize : 20}}> {props.ville}</Text>
            <Text style={{color :'#c4e8c2' , 
                          fontWeight : 'bold' ,
                          marginLeft : "3%",
                          fontSize : 20}}> Du <Text style={CSS.DateText}> {props.Date_Debut} </Text> Au <Text style={CSS.DateText}> {props.Date_Fin}</Text> 
            </Text>
            <Text style={{color :'#c4e8c2' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :10,fontSize : 20}}> Nombre de plante à garder : <Text> {Photo.length} </Text> </Text>
            <Text style={{color :'#c4e8c2' , fontWeight : 'bold' ,marginLeft : "3%", marginTop :40,fontSize : 20}}> Reference : {props.reference}</Text>
        </View>
    )
}

const CSS=StyleSheet.create({
    MainView : {
        width : '96%' , 
        height : 380, 
        borderWidth : 3,
        borderColor : '#c4e8c2',
        marginBottom : 10,
        borderRadius : 5 , 
        backgroundColor : "white",
        shadowColor: '#171717',
        shadowOffset: {width: 2, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 3,
        
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
    }
})


export default CardMap ; 