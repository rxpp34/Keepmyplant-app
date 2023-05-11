import React from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard} from "react-native";
import {REACT_SERVER_APP} from "@env"
import { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";


function SignUp () 
{
    const navigation=useNavigation() ;

    const [Nom,setNom]=useState("")
    const [Prenom,setPrenom]=useState("")
    const [Mail,setMail]=useState("")
    const [Telephone,setTelephone]=useState("")
    const [ConfirmMail,setConfirmMail]=useState("") 
    const [PasswordSignup,setPasswordSignup]=useState("") ;  
    const [ConfirmPasswordSignup,setConfirmPasswordSignup]=useState("") ;  
    const [Voie,setVoie]=useState("")
    const [Rue,setRue]=useState("")
    const [Ville,setVille]=useState("")
    const [CP,setCP]=useState("")

    const [PageNomPrenom,setPageNomPrenom]=useState(true)
    const [PageMail,setPageMail]=useState(false)
    const [PageAdresse,setPageAdresse]=useState(false)


    function Suivant_Mail() 
    {
        if(Nom==="" || Prenom==="" || Telephone==="")
        {
            alert("VEUILLEZ REMPLIR TOUT LES CHAMPS ! ")
        }
        else if(Telephone.length!=10)
        {
            alert("Numéro de téléphon invalide.")
        }
        else
        {
            setPageNomPrenom(false) ; setPageMail(true)
        }
    }


    function Suivant_Adresse() 
    {
        if(Mail==="" || ConfirmMail==="" || PasswordSignup==="" || ConfirmPasswordSignup==="")
        {
            alert("VEUILLEZ REMPLIR TOUT LES CHAMPS ! ")
        }
        else if(Mail!=ConfirmMail)
        {
            alert("Les deux adresses mails doivent être identiques")
        }
        else if(!Mail.includes("@") && !Mail.includes("."))
        {
            alert("Adresse mail invalide")
        }
        else if(PasswordSignup!=ConfirmPasswordSignup)
        {
            alert("Les deux mots de passe doivent être identiques")
        }
        
        else
        {
            axios({
                method : "post",
                url : "http://codx.fr:8080/VerifyExistingMail/"+Mail
            }).then((response) => {
                if (response.data.ExistingMail==="YES")
                {
                    alert("Votre adresse mail est déja utilisée par un compte tentez de vous connecter avec.")
                }
                else
                {
                    setPageNomPrenom(false) ; setPageMail(false) ; setPageAdresse(true)
                }
            })

            
        }
    }

    function Finish_inscription () 
    {
        if(Voie==="" || Rue==="" || Ville==="" || CP==="")
        {
            alert("VEUILLEZ REMPLIR TOUT LES CHAMPS ! ")
        }
        else
        {
            axios({
                method: 'POST',
                url: "http://codx.fr:8080/RegisterNewAccount/" + Nom +"/"+ Prenom +"/"+Mail +"/"+Telephone+"/"+PasswordSignup+"/"+Voie+"/"+Rue+"/"+CP+"/"+Ville
            }).then((response) => {
                if(response.data==="ok")
                {
                    axios({
                        method: 'POST',
                        url: "http://codx.fr:8080/SendMailConfirmationCode/" + Mail
                    }).then((response) => {
                        navigation.navigate("ConfirmCodeByMail", {_Code: response.data.Code, _Mail : Mail,_Mode : 'Register'}) ;
                    })
                }
            })

        }
    }

    return (
        <TouchableWithoutFeedback>
            {PageNomPrenom===true ? 
            
                <View style={CSS.BigView}>  
                    <View style={CSS.Bienvenue}>
                        <Image source={require("../assets/Logo.png")} style={CSS.LogoImage}/>
                        <Text style={CSS.BienvenueText}> Bienvenue chez A'Rosa-Je ! </Text>
                    </View>

                    <Text style={{fontSize : 22,color : "#46a094",textAlign :'center',fontWeight :'bold',marginTop : 30}}> Commençons ! </Text>

                    <View style={{marginTop : 50}}>
                        <TextInput vamue={Nom} onChangeText={setNom} style={CSS.TheInput} placeholder="Nom"/>
                        <TextInput vamue={Prenom} onChangeText={setPrenom} style={CSS.TheInput} placeholder="Prénom"/>
                        <TextInput vamue={Telephone} onChangeText={setTelephone} style={CSS.TheInput} placeholder="Téléphone mobile" keyboardType="numeric"/>
                    </View>

                    <View>
                        <Pressable style={CSS.ConnectButton} onPress={() => {Suivant_Mail()}}>
                            <Text style={CSS.TextConnectButton}> Suivant </Text>
                        </Pressable>

                        <Pressable style={[CSS.ConnectButton,{marginTop : 20}]} onPress={() => {navigation.navigate("Authentification")}}>
                            <Text style={CSS.TextConnectButton}> Annuler </Text>
                        </Pressable>
                    </View>
                    
                </View> 

            : 

            PageMail===true ? 

                <View style={CSS.BigView}>  
                    
                    <Text style={{fontSize : 22,color : "#46a094",textAlign :'center',fontWeight :'bold',marginTop : 30}}> Étape 2 . . . </Text>


                    <View style={{marginTop : 50}}>
                        <TextInput vamue={Mail} onChangeText={setMail} style={CSS.TheInput} placeholder="Adresse e-mail"/>
                        <TextInput vamue={ConfirmMail} onChangeText={setConfirmMail} style={CSS.TheInput} placeholder="Confirmation adresse e-mail"/>
                        <TextInput vamue={PasswordSignup} onChangeText={setPasswordSignup} style={CSS.TheInput} placeholder="Mot de passe" secureTextEntry={true} />
                        <TextInput vamue={ConfirmPasswordSignup} onChangeText={setConfirmPasswordSignup} style={CSS.TheInput} placeholder="Confirmation mot de passe" secureTextEntry={true}/>
                    </View>

                    <Pressable style={CSS.ConnectButton} onPress={() => {Suivant_Adresse()}}>
                        <Text style={CSS.TextConnectButton}> Suivant </Text>
                    </Pressable>

                    <Pressable style={[CSS.ConnectButton,{marginTop : 20}]} onPress={() => {setPageNomPrenom(true) ; setPageMail(false) ; setPageAdresse(false)}}>
                            <Text style={CSS.TextConnectButton}> Retour </Text>
                        </Pressable>
                    
                </View> 

            :

                <View style={CSS.BigView}>  
                        
                    <Text style={{fontSize : 22,color : "#46a094",textAlign :'center',fontWeight :'bold',marginTop : 30}}> On n'y est presque . . . </Text>

                    <View style={{marginTop : 50}}>

                    <Text style={CSS.TextInputTitle}> Adresse </Text>
                    <View style={[CSS.ViewAdresse1, { marginBottom: 20 }]}>
                            <TextInput value={Voie} onChangeText={setVoie} keyboardType="numeric" placeholder="N°"
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

                            <TextInput value={Rue} onChangeText={setRue} placeholder="Nom de la rue"
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
                            <TextInput value={CP} onChangeText={setCP} keyboardType="numeric" placeholder="CP"
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

                            <TextInput value={Ville} onChangeText={setVille} placeholder="Ville"
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
                    </View>

                    <Pressable style={CSS.ConnectButton} onPress={() => {Finish_inscription()}}>
                        <Text style={CSS.TextConnectButton}> Terminer </Text>
                    </Pressable>
                </View> 
        }
           
        </TouchableWithoutFeedback>
        


    )
}

const CSS=StyleSheet.create({
    BigView : {
        marginTop : 50,
        width : "100%",
        height : "100%"
    },
    Bienvenue : 
    {
        borderWidth : 2 ,
        borderColor : "#46a094",
        backgroundColor : "#46a094",
        width : "70%",
        height : 200,
        marginLeft :"15%",
        borderRadius : 7
    },
    LogoImage : {
        height : 120,
        width : 120,
        marginLeft : '30%' ,
        borderRadius : '50%',
        marginTop : 20,
        marginBottom : 20
    
    },
    BienvenueText : {
        color : "white",
        fontWeight :'bold',
        fontSize : 18,
        textAlign :'center'
    },
    TheInput : {
        borderBottomWidth :2 ,
        borderBottomColor : "#46a094",
        width : "80%",
        marginLeft : '10%',
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
    ViewAdresse1 : 
    {
        display :'flex',
        flexDirection : 'row',
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
})


export default SignUp ;