import react from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard } from "react-native";
import { useState } from "react";
import DateTimePicker from  "@react-native-community/datetimepicker" ;
import axios from "axios"

function RechercheMap ({navigation}) 
{   
    const [NiveauExpertise, setNiveauExpertise] = useState(0);
    const [Ville,setVille]=useState('')
    const [DateDebut,setDateDebut]=useState(new Date())
    const [DateFin,setDateFin]=useState(new Date())


    const [CSSDebutant,setCSSDebutant]=useState( 
    {
        width :'32%' ,
        borderWidth : 2,
        borderColor :"#46a094",
        borderRadius : 7,
        backgroundColor :'transparent',
        color : "#46a094",
        
    })

    const [CSSConnaisseur,setCSSConnaisseur]=useState( 
    {
        width :'32%' ,
        borderWidth : 2,
        borderColor :"#46a094",
        backgroundColor :'transparent',
        borderRadius : 7,
        color : "#46a094",
    })


    const [CSSExpert,setCSSExpert]=useState( 
        {
           width :'32%' ,
           borderWidth : 2,
           borderColor :"#46a094",
           backgroundColor :'transparent',
           borderRadius : 7,
           color : "#46a094",
        })

    function handleDebutant () {
        if(CSSDebutant.backgroundColor==="transparent")
        {
            setCSSDebutant({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'#46a094',color : "#46a094",})
            setCSSConnaisseur({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setCSSExpert({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setNiveauExpertise(1)
        }
        else
        {
            setCSSDebutant({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
        }
    }

    function handleConnaisseur () {
        if(CSSConnaisseur.backgroundColor==="transparent")
        {
            setCSSConnaisseur({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'#46a094',color : "#46a094",})
            setCSSDebutant({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setCSSExpert({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setNiveauExpertise(2)

        }
        else
        {
            setCSSConnaisseur({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
        }
    }

    function handleProfessionnel () {
        if(CSSExpert.backgroundColor==="transparent")
        {
            setCSSExpert({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'#46a094',color : "#46a094",})
            setCSSDebutant({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setCSSConnaisseur({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
            setNiveauExpertise(3)

        }
        else
        {
            setCSSExpert({width :'32%' ,borderWidth : 2,borderColor :"#46a094",borderRadius : 7,backgroundColor :'transparent',color : "#46a094",})
        }
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      };

    const onChangeDateDebut = (event, DateDebut) => {
        const currentDate = DateDebut || date;
        setDateDebut(currentDate);
      };

    
      const onChangeDateFin = (event, DateFin) => {
        const currentDate = DateFin || date;
        setDateFin(currentDate);
      };

      function GoMap() 
      {
        /*axios({
            method : "post",
            url :"https://maps.googleapis.com/maps/api/geocode/json?address="+Ville+"&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
        }).then((resp) => {
                navigation.navigate('Map', {
                    Lat  : resp.data.results[0].geometry.location.lat,
                    Lng : resp.data.results[0].geometry.location.lng
            })

        })*/
        axios({
            method : "post",
            url :"https://maps.googleapis.com/maps/api/geocode/json?address="+Ville+"&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
        }).then((resp) => {
                navigation.navigate('Map', { _DateDebut: formatDate(DateDebut), _DateFin : formatDate(DateFin) , _Niveau : NiveauExpertise , _Ville : Ville ,
                    Lat  : resp.data.results[0].geometry.location.lat,  Lng : resp.data.results[0].geometry.location.lng
            })

        })     }

    return (

        <View style={CSS.BigView}>
            <View style={CSS.ViewLabel}>
                <Image source={require("../assets/icons8-plantation-à-la-main-90.png")} style={{marginTop : '5%'}}/>
                <TextInput style={{color : 'white', textAlign : 'center', marginTop :'10%',fontSize :16}}> Trouver les plantes prés de chez vous ! </TextInput>
            </View>

            <View style={CSS.ViewInput}>
                <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginRight :'85%' }}> Ville</Text>
                <TextInput style={CSS.VilleInput} onChangeText={setVille} value={Ville}/>
                
                <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginRight :'37%',marginTop :20 }}> Niveau d'expertise</Text>
                <View style={CSS.NiveauExpertise}>
                    <Pressable style={CSSDebutant} name='Debutant'>
                        <Text style={{textAlign : 'center',marginTop : 10}} onPress={handleDebutant}> Débutant </Text>
                    </Pressable>

                    <Pressable style={CSSConnaisseur}>
                        <Text style={{textAlign : 'center',marginTop : 10}} onPress={handleConnaisseur}> Connaisseur </Text>
                    </Pressable>

                    <Pressable style={CSSExpert}>
                        <Text style={{textAlign : 'center',marginTop : 10}} onPress={handleProfessionnel}> Professionnel </Text>
                    </Pressable>
                </View>

                <View>
                    <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginRight :'62%',marginTop : 20 }}> Date début</Text>
                    <DateTimePicker mdoe="date" display="spinner" value={DateDebut} onChange={onChangeDateDebut} style={{height : 50}} format="YYYY-MM-DD"></DateTimePicker>

                    <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginRight :'62%',marginTop : 15 }}> Date Fin</Text>
                    <DateTimePicker mdoe="date" display="spinner" value={DateFin} onChange={onChangeDateFin} style={{height : 50}} format="YYYY-MM-DD"></DateTimePicker>
                </View>


                <Pressable style={CSS.GoButton} onPress={GoMap} >
                    <Text style={CSS.TextGoButton}> GO ! </Text>
                </Pressable>

            </View>
        </View>
    )
}


const CSS=StyleSheet.create({
    BigView : {
        width : "100%" , 
        height : "100%",
        marginTop : "12%",
        alignItems :'center'
    } ,
   ViewLabel : {
        borderWidth : 2, 
        borderRadius : 7 ,
        width :'80%',
        height : '25%',
        marginTop :30, 
        borderColor :"#46a094",
        backgroundColor :"#46a094",
        alignItems : 'center'
   },
   ViewInput : 
   {
    width :'90%',
    height : '25%',
    marginTop :10, 
    borderColor :"#46a094",
    alignItems : 'center',
    color : "#46a094",
   },
   VilleInput : 
   {
    borderWidth : 2, 
    borderRadius : 7 ,
    width :'100%',
    borderColor :"#46a094",
    fontSize : 26,
    padding : 5 , 
    color : "#46a094",

   },
   NiveauExpertise : 
   {
    width : '100%',
    height :50 ,
    marginTop : 10,
    justifyContent :'space-evenly',
    flexDirection : 'row'
   },
   GoButton : {
    marginTop : 20,
    borderWidth : 3 ,
    width :'30%',
    textAlign :'center',
    backgroundColor :"#46a094",
    borderColor : "#46a094",
    borderRadius :7,
},
TextGoButton : {
    textAlign  : 'center', 
    color :"white",
    fontSize: 18,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    padding : 15

}



})

export default RechercheMap ; 