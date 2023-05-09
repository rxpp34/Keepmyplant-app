import React from "react";
import { Text, View,Image,StyleSheet,TextInput, Button,Pressable,TouchableWithoutFeedback,Keyboard,TouchableOpacity} from "react-native";
import { useNavigation,useRoute } from "@react-navigation/native";
import { useState ,useRef} from "react";
import axios from "axios";

function ConfirmCodeByMail()
{
    const navigation=useNavigation() ;
    const route=useRoute() ; 
    const inputRefs = useRef([]);
    const [values, setValues] = useState(['', '', '', '', '', '']);
    const [ColorButton,setColorButton]=useState("#cfcecc")
    const [BorderButton,setBorderButton]=useState("#cfcecc")
    const [condition,setCondition]=useState(false)

  const focusNextInput = (id) => {
    inputRefs.current[id + 1].focus();
  };

  const onInputChange = (id, value) => {
    const newValues = [...values];
    newValues[id] = value;
    setValues(newValues);
    if (value.length === 1 && id < inputRefs.current.length - 1) {
      focusNextInput(id);
    }

    if(values.length===6)
    {
        setColorButton("#46a094")
        setBorderButton("#46a094")
    }
    else
    {
        setColorButton("#cfcecc")
        setBorderButton("#cfcecc")
    }
  };

  const setInitialFocus = () => {
    inputRefs.current[0].focus();
  };

    function Valider() 
    {
        var code=" "
        values.map((item) => {
            code=code.concat(item.toString())
        })

        axios({
            method :'POST',
            url :"http://codx.fr:8080/ValidateConfirmationCodeMail/"+route.params._Mail+"/"+route.params._Code
        }).then((resp) => {
            if(resp.data='OK')
            {
                navigation.navigate("ResetPassword", { _Mail : route.params._Mail})
            }
            else
            {
                alert("CODE INVALIDE !")
            }
        })
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                <Text style={CSS.Title}> Veuillez saisir le code reçu par mail </Text>
                <View style={CSS.Box}>
                {[...Array(6)].map((_, i) => (
                    <TextInput
                    key={i}
                    style={CSS.BoxInput}
                    keyboardType="numeric"
                    maxLength={1}
                    onChangeText={(value) => onInputChange(i, value)}
                    ref={(ref) => (inputRefs.current[i] = ref)}
                    onSubmitEditing={() => focusNextInput(i)}
                    value={values[i]}
                    />
                ))}
                </View>


                <Pressable style={[CSS.Button,{backgroundColor : ColorButton , borderColor : BorderButton}]} onPress={()=> {Valider()}}>
                    <Text style={{textAlign :'center',color : "white",fontSize : 26}}> Valider </Text>
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
        fontSize : 22, 
        color : "#46a094",
        fontWeight :'bold' , 
        marginTop : 80 , 
        marginLeft : "6%"
    },
    Box: {
        marginTop : 20 ,
        display : "flex",
        flexDirection :'row',
        justifyContent :'space-around',
        width : '80%' ,
        marginLeft :'10%' ,
        height : 100,
        marginTop : 40

    },
    BoxInput : {
        width :'14%',
        fontSize : 18, 
        borderWidth : 2 ,
        borderColor : "#46a094",
        textAlign : 'center',
        fontSize : 32,
        borderRadius : 7
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


export default ConfirmCodeByMail ; 