import react from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard,ScrollView} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";



function BravoAnnonce() 
{
    const navigation=useNavigation() ; 

    return(
        <View>
            <Image source={require("../assets/approuver.png")} style={{width : 200 ,height : 200,marginLeft : "25%",marginTop : 100}}/>
            <Text style={{
                color : "#3FE0C1",
                fontSize : 22,
                textAlign :'center',marginTop : 150,
                fontWeight : 'bold'
            }} 
            > Votre annonce a été postée avec succès ! </Text>

            <Pressable style={CSS.ConnectButton} onPress={() => {navigation.navigate("HomeTabs")}}>
                <Text style={CSS.TextConnectButton}> Terminer !  </Text>
            </Pressable>
        </View>
    )
}



const CSS=StyleSheet.create({
    ConnectButton : {
        marginTop : 150,
        borderWidth : 3 ,
        width :'40%',
        textAlign :'center',
        backgroundColor :"#3FE0C1",
        borderColor : "#3FE0C1",
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



export default BravoAnnonce ; 