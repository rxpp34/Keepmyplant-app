import React from "react";
import {REACT_SERVER_APP} from '@env' ; 
import { useState } from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard} from "react-native";



function Home ({navigation,route})
{
    return (
        <Text style={{marginTop : 100, marginLeft : "10%",fontSize : 32,fontWeight : "bold" ,color: "#46a094"}}>
            Accueil 
        </Text>
    )
}

const CSS=StyleSheet.create({
    HomeView : {
        borderWidth : 3 , 
        borderColor :'red' ,
        marginTop : 50,
        width : '100%', 
        height : '50%',
    },
})



export default Home ; 