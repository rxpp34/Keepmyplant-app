import React from "react";
import { Text, View,Image,StyleSheet,TextInput,Pressable,TouchableWithoutFeedback,Keyboard} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import axios from "axios";



function DemandeMdpOublie () 
{
    const navigation=useNavigation() 
    const [Mail,setMail]=useState("")
    const [ColorButton,setColorButton]=useState("#cfcecc")
    const [BorderButton,setBorderButton]=useState("#cfcecc")
    const [condition,setCondition]=useState(false)


    const handleChangeMail= (text) => 
    {
        setMail(text)
        if(Mail.includes("@") && Mail.includes("."))
        {
            setColorButton("#46a094")
            setBorderButton("#46a094")
            setCondition(true)
        }
        else
        {
            setColorButton("#cfcecc")
            setBorderButton("#cfcecc")
            setCondition(false)
        }

    }

    function Reset()
    {
        if(condition===true)
        {
            axios({
                method :'GET',
                url :"http://codx.fr:8080/GetUserByMail/"+Mail.toLowerCase()
            }).then((resp) =>{
                if (resp.data.length===0)
                {
                    alert("Votre compte n'existe pas ! Rentrez une adresse mail valide ou créez-vous un compte.")
                }
                else
                {
                    axios({
                        method :'POST',
                        url : "http://codx.fr:8080/SendMailConfirmationCode/"+Mail
                    }).then((resp) => {
                        navigation.navigate("ConfirmCodeByMail" , {_Mail :Mail, _Code : resp.data.Code})
                    })
                    
                }
            })
        }

    }

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <Text style={CSS.Title}> Mot de passe oublié </Text>
                <TextInput value={Mail} onChangeText={handleChangeMail} style={CSS.MailInput} />
                <Text style={CSS.TextConsigne}> Rentrez l'adresse e-mail de votre compte pour réinitialiser votre mot de passe. </Text>

                <Pressable style={[CSS.Button,{backgroundColor : ColorButton , borderColor : BorderButton}]} onPress={()=> {Reset()}}>
                    <Text style={{textAlign :'center',color : "white",fontSize : 26}}> Réinitialiser</Text>
                </Pressable>
            </View>
            
        </TouchableWithoutFeedback>
    )

}


const CSS=StyleSheet.create({
    BigView : {
        display : 'flex',
        flexDirection : 'column',
        justifyContent :'Center', 
        alignItems : 'center'
    },
    Title : {
        fontSize : 32, 
        color : "#46a094",
        fontWeight :'bold' , 
        marginTop : 80 , 
        marginLeft : "4%"
    },
    MailInput : 
    {
        width : "90%",
        fontSize : 22,
        borderWidth : 2,
        borderColor : "#46a094",
        borderRadius : 7 , 
        padding : 10 ,
        marginTop : 20 , 
        marginLeft : '5%'
    },
    TextConsigne : {
        width : '90%',
        marginLeft :'5%',
        textAlign :'center',
        marginTop : 10 ,
        color :'grey'
    },
    Button : {
        width :"45%" ,
        marginLeft :'27.5%',
        marginTop : 30,
        borderWidth : 3 ,
        padding : 5,
        borderRadius : 7
        }
})



export default DemandeMdpOublie ; 