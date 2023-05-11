import react from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard,ScrollView} from "react-native";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from  "@react-native-community/datetimepicker" ;
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"


function AddAnnonce() 
{   
    const navigation=useNavigation() ; 

    const [DateDebut,setDateDebut]=useState(new Date())
    const [DateFin,setDateFin]=useState(new Date())
    const [Description,setDescription]=useState("")
    const [SelectedNiveau, setSelectedNiveau] = useState("Connaisseur");
    const [SelectedCycle,setSelectedCycle]=useState("2") 

    const onChangeDateDebut = (event, DateDebut) => {
        const currentDate = DateDebut || date;
        setDateDebut(currentDate);
      };

    
      const onChangeDateFin = (event, DateFin) => {
        const currentDate = DateFin || date;
        setDateFin(currentDate);
      };

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
      };

      function PosterAnnonce () {
        var temp_niveau = 0

        if(SelectedNiveau==="Débutant")
        {
            temp_niveau=1
        }
        else if(SelectedNiveau==="Connaisseur")
        {
            temp_niveau=2
        }
        else if(SelectedNiveau==="Professionnel")
        {
            temp_niveau=3
        }


        if(formatDate(DateDebut)===formatDate(DateFin))
        {
            alert("La date de début et de fin doivent être différentes")
        }
        else
        {
            axios({
                method: "POST",
                url :"http://codx.fr:8080/CreateAnnonceByUser/alicia.lefebvre@gmail.com/"+formatDate(DateDebut)+"/"+formatDate(DateFin)+"/"+Description+"/"+temp_niveau+"/"+SelectedCycle
            }).then((resp) => {
                if(resp.data==="OK")
                {
                    navigation.navigate("BravoAnnonce")
                }
    
                
            })
        }
        
      }


    return (
        <ScrollView>
            <Text style={CSS.title}> Dépôt d'une annonce </Text>
            <Image source={require("../assets/annoncer.png")} style={CSS.ImageAnnonce}/>

            <View>
                <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginLeft :'2%',marginTop : 20 }}> Date début</Text>
                <DateTimePicker mdoe="date" display="spinner" value={DateDebut} onChange={onChangeDateDebut} style={{height : 50}} format="YYYY-MM-DD"></DateTimePicker>

                <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginLeft :'2%',marginTop : 15 }}> Date Fin</Text>
                <DateTimePicker mdoe="date" display="spinner" value={DateFin} onChange={onChangeDateFin} style={{height : 50}} format="YYYY-MM-DD"></DateTimePicker>
            </View>

            <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginLeft :'2%',marginTop : 50 }}> Niveau d'expertise</Text>
            <Picker selectedValue={SelectedNiveau} style={{ height: 150, width: "100%"}} itemStyle={{height: 150,color :"#46a094"}} onValueChange={(itemValue, itemIndex) => setSelectedNiveau(itemValue)}>
                <Picker.Item label="Débutant" value="Débutant" />
                <Picker.Item label="Connaisseur" value="Connaisseur"/>
                <Picker.Item label="Professionnel" value="Professionnel"/>
            </Picker>

            <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginLeft :'2%' }}> Cycle compte rendu</Text>
            <Picker selectedValue={SelectedCycle} style={{ height: 150, width: "100%"}} itemStyle={{height: 150,color :"#46a094"}} onValueChange={(itemValue, itemIndex) => setSelectedCycle(itemValue)}>
                <Picker.Item label="1" value="1" />
                <Picker.Item label="2" value="2"/>
                <Picker.Item label="3" value="3"/>
                <Picker.Item label="4" value="4"/>
                <Picker.Item label="5" value="5"/>
                <Picker.Item label="6" value="6"/>
                <Picker.Item label="7" value="7"/>
            </Picker>

            <Text style={{color : '#46a094',fontSize : 26 , fontWeight : 'bold',marginLeft :'2%' ,marginTop : 10,marginBottom :20}} multiline = {true} numberOfLines={12}> Description</Text>
            <TextInput value={Description} onChangeText={setDescription} style={CSS.InputDescription}/>

            <Pressable style={CSS.ConnectButton} onPress={() => {PosterAnnonce()}}>
                <Text style={CSS.TextConnectButton}> Valider </Text>
            </Pressable>
        </ScrollView>
    )
}

const CSS=StyleSheet.create({
    title : 
    {
        marginTop : 70,
        fontSize : 26,
        textAlign : 'center',
        color :"#46a094",
        fontWeight : "bold"

    },

    ImageAnnonce : 
    {
        width : 128,
        height : 128,
        marginLeft  :'32%'
    },
    InputDescription : 
    {
        borderWidth : 2, 
        borderRadius : 7 ,
        width :'94%',
        marginLeft :'2%',
        borderColor :"#46a094",
        fontSize : 26,
        justifyContent: "flex-start",
        color : "#46a094",
        height : 250,
        marginBottom : 50
    },
    ConnectButton : {
        marginTop : 30,
        borderWidth : 3 ,
        width :'40%',
        textAlign :'center',
        backgroundColor :"#46a094",
        borderColor : "#46a094",
        borderRadius :7,
        marginLeft : '30%',
        marginBottom : 50
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


export default AddAnnonce ; 