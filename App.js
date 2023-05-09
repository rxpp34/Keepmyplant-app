import * as React from "react";
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
import MesAnnonces from "./Screen/MesAnnonces";
import MesDemandes from "./Screen/MesDemandes";
import GestionDemandeAnnonce from "./Screen/GestionDemandeAnnonce";
import Authentification from "./Screen/Authentification";

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

            <Tab.Screen name="Profil" component={Profil} options={{
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
                <Stack.Screen name="HomeTabs" component={Tabs} />
                <Stack.Screen name="Map" component={Map} />
                <Stack.Screen name="ReserveAnnonce" component={ReserveAnnonce} />
                <Stack.Screen name="CreatePlante" component={CreatePlante} />
                <Stack.Screen name="ModifyPlante" component={ModifyPlante} />
                <Stack.Screen name="Photo" component={Photo} />
                <Stack.Screen name="MesAnnonces" component={MesAnnonces} />
                <Stack.Screen name="MesDemandes" component={MesDemandes} />
                <Stack.Screen name="GestionDemandeAnnonce" component={GestionDemandeAnnonce} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
export default App;