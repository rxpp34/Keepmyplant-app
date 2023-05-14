import * as React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Image, StyleSheet, TextInput, Button, Pressable, TouchableWithoutFeedback, Keyboard } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./Screen/Home";
import Profil from "./Screen/Profil";
import RechercheMap from "./Screen/RechercheMap";
import MesPlantes from "./Screen/MesPlantes";
import AddAnnonce from "./Screen/AddAnnonce";
import Map from "./Screen/Map";
import ReserveAnnonce from "./Screen/ReserveAnnonce";
import CreatePlante from "./Screen/CreatePlante";
import ModifyPlante from "./Screen/ModifyPlante";
import Photo from "./Screen/Photo";
import MonCompte from "./Screen/MonCompte"
import MesAnnonces from "./Screen/MesAnnonces";
import MesDemandes from "./Screen/MesDemandes";
import GestionDemandeAnnonce from "./Screen/GestionDemandeAnnonce";
import EditProfil from "./Screen/EditProfil";
import VisitProfil from "./Screen/VisiteProfil"
import DemandeMdpOublie from "./Screen/DemandeMdpOublie"
import ConfirmCodeByMail from "./Screen/ConfirmCodeByMail"
import ResetPassword from "./Screen/ResetPassword"
import MesConseils from "./Screen/MesConseils";
import CreateConseil from "./Screen/CreateConseil";
import ModifyConseil from "./Screen/ModifyConseil";
import LesConseilsPourTypePlantes from "./Screen/LesConseilsPourTypePlantes";
import MonAnnonceSuivis from "./Screen/MonAnnonceSuivis";
import MonAnnonceSuivisBotanniste from "./Screen/MonAnnonceSuivisBotanniste";
import Authentification from "./Screen/Authentification";
import SignUp from "./Screen/SignUp"


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs({ navigation }) {
    return (

        <Tab.Navigator tabBarOptions={{ showLabel: false }} screenOptions={{ headerShown: false, showLabel: false }}>
            <Tab.Screen name="Accueil" component={Home} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 14, }}>
                        <Image source={require("./assets/icons/Home.png")} resizeMode="contain" style={{ width: 25, height: 25 }} />
                        <Text style={{ fontSize: 12, color: "#46a094" }}>Accueil</Text>
                    </View>)
            }} />

            <Tab.Screen name="RechercheMap" component={RechercheMap} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 14 }}>
                        <Image source={require("./assets/icons/Map.png")} resizeMode="contain" style={{ width: 25, height: 25 }} />
                        <Text style={{ fontSize: 12, color: "#46a094" }}>Map</Text>
                    </View>)
            }} />

            <Tab.Screen name="AddAnnonce" component={AddAnnonce} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 14 }}>
                        <Image source={require("./assets/icons/Add.png")} resizeMode="contain" style={{ width: 60, height: 60 }} />
                        <Text style={{ fontSize: 12, color: "#46a094" }}></Text>
                    </View>)
            }} />

            <Tab.Screen name="Mes Plantes" component={MesPlantes} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 14 }}>
                        <Image source={require("./assets/icons/Plant.png")} resizeMode="contain" style={{ width: 25, height: 25 }} />
                        <Text style={{ fontSize: 12, color: "#46a094" }}>Mes plantes</Text>
                    </View>)
            }} />

            <Tab.Screen name="MonCompte" component={MonCompte} options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', top: 14 }}>
                        <Image source={require("./assets/icons/Profil.png")} resizeMod4="contain" style={{ width: 25, height: 25 }} />
                        <Text style={{ fontSize: 12, color: "#46a094" }}>Mon compte</Text>
                    </View>)
            }} />
        </Tab.Navigator>

    )
}


function App({ navigation }) {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Authentification" component={Authentification} />

                <Stack.Screen name="HomeTabs" component={Tabs} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen name="DemandeMdpOublie" component={DemandeMdpOublie} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="ReserveAnnonce" component={ReserveAnnonce} />
                <Stack.Screen name="CreatePlante" component={CreatePlante} />
                <Stack.Screen name="ModifyPlante" component={ModifyPlante} />
                <Stack.Screen name="Photo" component={Photo} />
                <Stack.Screen name="MesAnnonces" component={MesAnnonces} />
                <Stack.Screen name="MesDemandes" component={MesDemandes} />
                <Stack.Screen name="GestionDemandeAnnonce" component={GestionDemandeAnnonce} />
                <Stack.Screen name="Profil" component={Profil} />
                <Stack.Screen name="EditProfil" component={EditProfil} />
                <Stack.Screen name="VisitProfil" component={VisitProfil} />
                <Stack.Screen name="ConfirmCodeByMail" component={ConfirmCodeByMail} />
                <Stack.Screen name="MesConseils" component={MesConseils} />
                <Stack.Screen name="CreateConseil" component={CreateConseil} />
                <Stack.Screen name="ModifyConseil" component={ModifyConseil} />
                <Stack.Screen name="LesConseilsPourTypePlantes" component={LesConseilsPourTypePlantes} />
                <Stack.Screen name="MonAnnonceSuivis" component={MonAnnonceSuivis} />
                <Stack.Screen name="MonAnnonceSuivisBotanniste" component={MonAnnonceSuivisBotanniste} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;