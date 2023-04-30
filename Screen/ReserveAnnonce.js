import react from "react";
import { useEffect } from "react";
import { useState } from "react";
import {  Text,View,Image,StyleSheet,TextInput, Button,Pressable,ScrollView,Keyboard} from "react-native";
import axios from "axios";
import { useNavigation,useRoute } from "@react-navigation/native";


function ReserveAnnonce (props) 
{   
    const navigation=useNavigation() ;
    const route = useRoute();
    const [Plantes,setPlante]=useState([])

    useEffect(() => {
        axios({
            method :'GET',
            url : "http://codx.fr:8080/GetPlantByUser/"+route.params._mail
        }).then((resp) => {
            setPlante(resp.data)
        })
    } ,[])
    
    return(
        <ScrollView style={CSS.MainView}>
            <Pressable style={CSS.PressableRetourRetour} onPress={() => navigation.goBack()}>
                    <Text style={{color :"white",fontSize : 22}}> &lt; Retour </Text>
            </Pressable>

            <View style={CSS.PdpNomPrenom}>
                <Image source={{uri : route.params._urlPhoto}} style={{width: 100, height: 100 , borderRadius : '50%' , borderWidth : 2 , borderColor : "#46a094"}}/>
                <Text style={{color :"#46a094", fontWeight :'bold' ,marginLeft :'2%', fontSize : 26}}> {route.params._prenom} {route.params._nom}  </Text>
            </View>

            <View style={{marginTop : 30 ,marginLeft :'2%',fontSize : 20, color: "#46a094",fontWeight : "bold"}}> 
                <Text style={{color : "#7d7d7d",fontSize : 24,fontWeight : "bold"}}> Du <Text style={CSS.TextDate}>{route.params._date_debut}</Text> au <Text style={CSS.TextDate}>{route.params._date_fin}</Text></Text >
            </View>

            <View style={{backgroundColor : "#46a094" ,width :'90%',marginLeft :'2%',borderRadius : 5,marginTop : 50}}>
                <Text style={{color :"white", fontWeight :'bold' ,marginLeft :'2%', fontSize : 26}}> Niveau d'expertise requis : {route.params._expertise}</Text>
            </View>

            <View style={{backgroundColor : "#46a094" ,width :'63%',marginLeft :'2%',borderRadius : 5,marginTop : 20}}>
                <Text style={{color :"white", fontWeight :'bold' ,marginLeft :'2%', fontSize : 26}}> Nombre de cycle : {route.params._cycle}</Text>
            </View>

            <View style={{backgroundColor : "#46a094" ,width :'38%',marginLeft :'2%',borderRadius : 5,marginTop :100}}>
                <Text style={{color :"white", fontWeight :'bold' ,marginLeft :'2%', fontSize : 26}}> Description</Text>
            </View>
            <Text style={{color : "#7d7d7d",fontSize : 24,fontWeight : "bold",marginLeft :'8%',marginTop : 26}}>
                {route.params._description}
            </Text>
            
            <View style={{backgroundColor : "#46a094" ,width :'40%',marginLeft :'2%',borderRadius : 5,marginTop :100}}>
                <Text style={{color :"white", fontWeight :'bold' ,marginLeft :'2%', fontSize : 26}}> Mes Plantes</Text>
            </View>

            <ScrollView style={CSS.ViewPlantes}>
                {Plantes.map((item) => {
                    return (
                        <View style={CSS.Plante}>
                            <Image source={{uri : item.urlPhoto}} style={{width :'100%',height : 180}}/>
                            <Text style={{color : "#46a094",fontSize : 24,fontWeight : "bold",marginLeft :'2%',marginTop : 20}}> {item.nom }</Text>
                            <Text style={{color : "#46a094",fontSize : 24,fontWeight : "bold",marginLeft :'2%',marginTop : 20}}> {item.description }</Text>
                        </View>
                    )
                })}
            </ScrollView>

            <Text style={{color : "#7d7d7d",fontSize : 24,fontWeight : "light",marginLeft :'3%',marginTop : 22,fontStyle :'italic'}}> Vous voulez vous occuper de ces plantes ? Faites votre de demande dès maintenant ! </Text>

            <Pressable style={CSS.PressableButtonDemande} onPress={() => navigation.goBack()}>
                    <Text style={{color :"#18c924",fontSize : 22,padding : 5,fontWeight :'bold',textAlign :'center'}}> Faire ma demande </Text>
            </Pressable>

        </ScrollView>
    )
}


const CSS=StyleSheet.create({
    MainView : {
        marginTop : 50,
        width : '100%', 
        height : '100%',
        backgroundColor :'white'
    },
    PressableRetourRetour : 
    {
        marginTop : 10,
        marginLeft : '3%',
        borderWidth : 3 ,
        width :'25%',
        textAlign :'center',
        backgroundColor :"#46a094",
        borderColor : "#46a094",
        borderRadius :7,
    },
    PdpNomPrenom : {
        width : "90%",
        display : 'flex' , 
        flexDirection : 'row',
        alignItems : 'center' ,
        marginTop : 20,
        marginLeft : '2%',
    } ,

    TextDate : {
        color : "#46a094" , 
        fontSize : 20,fontWeight : "bold"
    },

    ViewPlantes : {
        width : "94%",
        height :"auto",
        marginLeft :"3%",
        marginTop : 20
    },

    Plante : {
        width : '100%',
        height : 300,
        shadowColor: '#46a094',
        shadowOffset: {width: 5, height: 5},
        shadowOpacity: 0.6,
        shadowRadius: 3,
        marginBottom : 30,
        borderWidth : 2,
        borderRadius : 5 ,
        borderColor :"#46a094"
    },

    PressableButtonDemande : 
    {
        marginTop : 30,
        marginLeft : '20%',
        borderWidth : 3 ,
        width :'60%',
        textAlign :'center',
        backgroundColor :"white",
        borderColor : "#18c924",
        borderRadius :7, 
        marginBottom : 70,
        
    }
})

export default ReserveAnnonce ;