POUR LANCER LE PROJET  : 

Télécharger sur votre téléphone l'appli expo
- npx expo start
- Flasher le QR Code avec votre téléphone (ATTENTION IL FAUT ETRE SUR LE MEME RÉSEAU)

**** Pour installer les dependances : 
 - npx expo install react-native-screens react-native-safe-area-context
 - npm i react-native-dotenv
 - npm install axios
 - npm install @react-navigation/bottom-tabs




#46a094
turtle : #C4EBC2

#15443E




 optionCard: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    supprimerButton: {
        margin: 5,
        marginBottom: 10,
        paddingHorizontal: 16,
        height: 35,
        borderRadius: 7,
        backgroundColor: '#8C3A3A',
        color: '#fff',
        fontWeight: '400',
        fontSize: 14,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 1,
        shadowRadius: 14,
        elevation: 4,
        justifyContent: 'center', // Centrer verticalement
        alignItems: 'center', // Centrer horizontalement
    },
    modifierButton: {
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 10,
        paddingHorizontal: 16,
        height: 35,
        lineHeight: 35, // Mise à jour de la valeur de lineHeight
        borderRadius: 7,
        backgroundColor: '#8E8E8E',
        color: '#fff',
        fontWeight: '400',
        fontSize: 16,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 4,





<TouchableOpacity onPress={() => navigation.navigate('MonAnnonceSuivisBotanniste')}>
                <View style={CSS.ViewDemande}>
                    <Image source={require('../assets/Demande.png')} style={{ width: 96, height: 96 }} />
                    <Text style={CSS.TextDemande} > Mon suivis annonce B</Text>
                </View>
            </TouchableOpacity>