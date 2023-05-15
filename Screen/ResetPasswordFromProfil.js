import react from "react";
import { Text, View, Image, StyleSheet, TextInput, Pressable, ScrollView, Keyboard, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import axios from "axios";


function ResetPasswordFromProfil() 
{
    const navigation=useNavigation() ; 
    const [Password,setPassword]=useState("")
    const [ConfirmPassword,setConfirmPassword]=useState("")
    const [User,setUser]=useState("")

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
        }}

    useEffect(() => {
        GetUserMail();
    }, []);



    function UpdatePassword() 
    {
        axios({
            method :'POST',
            url : "http://codx.fr:8080/ResetPassword/"+Password+"/"+User.idUser
        }).then((resp) => {
            if(resp.data==="OK")
            {
                navigation.navigate("MonCompte")
            }
        })
    }

    return(
        <View>
            <Pressable style={CSS.PressableRetour} onPress={() => navigation.goBack()}> 
                    <Text style={{color :"white",fontSize : 22}}> &lt; Retour </Text>
                </Pressable>
            <Text style={CSS.Title}> Réinitialiser mot de passe </Text>

            <View style={{marginTop : 50}}>
                <TextInput vamue={Password} onChangeText={setPassword} style={CSS.TheInput} placeholder="Mot de passe" secureTextEntry={true} />
                <TextInput vamue={ConfirmPassword} onChangeText={setConfirmPassword} style={CSS.TheInput} placeholder="Confirmation mot de passe" secureTextEntry={true}/>
            </View>

            <Pressable style={CSS.ConnectButton} onPress={() => {UpdatePassword()}}>
                <Text style={CSS.TextConnectButton}> Terminer </Text>
            </Pressable>

        </View>
    )
}

const CSS=StyleSheet.create({
    Title: 
    {
        fontSize: 32,
        color: "#46a094",
        fontWeight: "bold",
        marginTop : 30
    },
    PressableRetour : {
        marginTop : 60,
        marginLeft : '3%',
        borderWidth : 3 ,
        width :'27%',
        textAlign :'center',
        backgroundColor :"#46a094",
        position : "relative",
        borderColor : "#46a094",
        borderRadius :7,
    }
    ,
    TheInput : {
        borderBottomWidth :2 ,
        borderBottomColor : "#46a094",
        width : "90%",
        marginLeft : '5%',
        borderBottomLeftRadius : 15 , 
        borderBottomRightRadius : 15 , 
        fontSize : 22,
        paddingLeft : "5%",
        color :"#46a094",
        marginBottom : 30
    },
    ConnectButton : {
        marginTop : 80,
        borderWidth : 3 ,
        width :'40%',
        textAlign :'center',
        backgroundColor :"#46a094",
        borderColor : "#46a094",
        borderRadius :7,
        marginLeft : '30%'
    },
    TextConnectButton : {
        textAlign  : 'center', 
        color :"white",
        fontSize: 18,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        padding : 15

    },
})

export default ResetPasswordFromProfil ; 