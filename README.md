POUR LANCER LE PROJET  : 

Télécharger sur votre téléphone l'appli expo
- npx expo start
- Flasher le QR Code avec votre téléphone (ATTENTION IL FAUT ETRE SUR LE MEME RÉSEAU)

**** Pour installer les dependances : 
 - npx expo install react-native-screens react-native-safe-area-context
 - npm i react-native-dotenv
 - npm install axios
 - npm install @react-navigation/bottom-tabs



<View style={CSS.PdpNomPrenom}>
                <Image source={{uri : props.url_pdp}} style={{width: 70, height: 70 , borderRadius : '50%'}}/>
                <Text style={{color :"white", fontWeight :'bold' ,marginLeft :'2%'}}> {props.prenom} {props.nom}  </Text>
</View>


#46a094