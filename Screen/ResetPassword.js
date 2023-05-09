import React from "react";
import { Text, View,Image,StyleSheet,TextInput,Pressable,TouchableWithoutFeedback,Keyboard} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";



function ResetPassword() 

{
    const navigation=useNavigation() ;
    const route=useRoute() ; 
    const [Password,setPassword]=useState("")
    const [ConfirmPassword,setConfirmPassword]=useState("")

    function UpdatePassword() 
    {
        if(Password===ConfirmPassword)
        {
            axios({
                methode :'get',
                url :"http://codx.fr:8080/GetUserByMail/"+route.params._Mail
            }).then((resp) => {
                axios({
                    method :'POST',
                    url :"http://codx.fr:8080/ResetPassword/"+Password+"/"+resp.data[0].idUser
                }).then((resp2) => {
                    if(resp2.data==="OK")
                    {
                        alert("Vote mot de passe a été changé avec succès ! ")
                        navigation.navigate("Authentification")
                    }
                })
            })
        }
        else
        {
            alert("Les deux mots de passe doivent correspondre !")
        }
        
    }

    return(
        <View style={CSS.BigView} >

            <Text style={CSS.title}> A'rose-je </Text>

            <View style={{marginTop : 50 }}>
                <Text style={CSS.TextReset}> Nouveau mot de passe : </Text>
                <TextInput value={Password} onChangeText={setPassword} secureTextEntry={true} style={CSS.InputReset}/>

                <Text style={CSS.TextReset}> confirmation mot de passe : </Text>
                <TextInput value={ConfirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={CSS.InputReset}/>
            </View>

            <Pressable style={CSS.Button} onPress={()=> {UpdatePassword()}}>
                    <Text style={{textAlign :'center',color : "white",fontSize : 26}}> Valider </Text>
            </Pressable>
        </View>
    )

}

const CSS=StyleSheet.create({
    BigView : 
    {
        marginTop : 100 , 
        width : '80%',
        marginLeft : '10%',
    },
    title : 
    {
        fontSize : 45,
        color: "#46a094" , 
        fontWeight :'bold'
    },
    TextReset : 
    {
        color: "#46a094" , 
        fontWeight : 'bold',
        fontSize : 22
    },
    InputReset : 
    {
        width : "100%",
        fontSize : 22,
        borderWidth : 2,
        borderColor : "#46a094",
        borderRadius : 7 , 
        padding : 10 ,
        marginBottom : 30 
    },
    Button : {
        width :"50%" ,
        marginLeft :'25%',
        marginTop : 30,
        borderWidth : 3 ,
        padding : 5,
        borderRadius : 7,
        backgroundColor :"#46a094",
        borderColor : "#46a094",
        }
})


export default ResetPassword ;