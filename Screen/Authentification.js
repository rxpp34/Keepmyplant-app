import React from "react";
import { Text, View, Image, StyleSheet, TextInput, Button, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native";
import { REACT_SERVER_APP } from "@env"
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';


function Authentification() {
    const navigation = useNavigation()
    const [Email, setEMail] = useState("")
    const [Password, setPassword] = useState("")

    function StoreUserMail(value) {
        try {
            AsyncStorage.setItem("UserMail", value);
        } catch (error) {
            alert(error);
        }
    };

    function Connect() {
        /*axios({
            method :'post',
            url : REACT_SERVER_APP+"Authentification/"+Email+"/"+Password
        }).then((resp) => {
            if(resp.data.Auth==="Done")
            {
                navigation.navigate('HomeTabs')
            }
            else
            {
                alert("Email ou mot de passe incorrecte ! ")
            }
        })*/

        StoreUserMail("hug.sastrepro@gmail.com");
        navigation.navigate('HomeTabs');

    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <Image source={require("../assets/Logo.png")} style={CSS.LogoImage} />
                <View style={CSS.ViewInput}>
                    <TextInput placeholder="Email" style={CSS.Input} value={Email} onChangeText={setEMail} />
                    <TextInput placeholder="Mot de passe" secureTextEntry={true} style={CSS.Input} value={Password} onChangeText={setPassword} />
                </View>

                <Pressable onPress={() => { navigation.navigate("DemandeMdpOublie") }}>
                    <Text style={CSS.ForgetPassword}> Mot de passe oublié</Text>
                </Pressable>


                <Pressable style={CSS.ConnectButton} onPress={Connect}>
                    <Text style={CSS.TextConnectButton}> Se connecter </Text>
                </Pressable>


                <Pressable style={CSS.SignupButton} onPress={() => { navigation.navigate("SignUp") }}>
                    <Text style={CSS.TextSignupButton}> Pas encore de compte ? Inscrivez-vous !  </Text>
                </Pressable>
            </View>
        </TouchableWithoutFeedback>

    )
}

const CSS = StyleSheet.create({
    BigView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'Center',
        alignItems: 'center'
    },
    LogoImage: {
        height: 200,
        width: 200,
        marginTop: 100,
        marginLeft: '25%',
        borderRadius: 50,
        borderWidth: 3,
        borderColor: "#46a094"
    },
    Input: {
        width: '100%',
        margin: 'auto',
        borderRadius: 7,
        borderWidth: 3,
        marginBottom: 20,
        borderColor: "#46a094",
        padding: 20,
        color: '#46a094'
    },
    ViewInput: {
        width: '80%',
        height: 'auto',
        margin: 'auto',
        marginLeft: '10%',
        marginTop: 20
    },
    ForgetPassword: {
        color: '#46a094',
        textAlign: 'center',
        textDecorationLine: 'underline'
    },
    ConnectButton: {
        marginTop: 80,
        borderWidth: 3,
        width: '40%',
        textAlign: 'center',
        backgroundColor: "#46a094",
        borderColor: "#46a094",
        borderRadius: 7,
        marginLeft: '30%'
    },
    TextConnectButton: {
        textAlign: 'center',
        color: "white",
        fontSize: 18,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        padding: 15

    },
    SignupButton: {
        marginTop: 80,
        borderWidth: 3,
        width: '90%',
        textAlign: 'center',
        backgroundColor: "transparent",
        borderColor: "#46a094",
        borderRadius: 7,
        marginLeft: '5%'
    },
    TextSignupButton:
    {
        textAlign: 'center',
        color: "#46a094",
        fontSize: 14,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        padding: 15
    }
})

export default Authentification;