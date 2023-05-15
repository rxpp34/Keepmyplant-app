import React, { useRef, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import { Text, View, Image, StyleSheet, TextInput, Button, Pressable, TouchableWithoutFeedback, Keyboard, Animated } from "react-native";
import Logo from "../assets/Logo.png";
import axios from "axios";

function Home({ navigation, route }) {

    const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0
    const [User, setUser] = useState("")

    const GetUserMail = async () => {
        try {
            const value = await AsyncStorage.getItem("UserMail");
            axios({
                method: 'GET',
                url: "http://codx.fr:8080/GetUserByMail/" + value
            }).then((resp) => {
                setUser(resp.data[0])
            }).catch((err) => {
                alert(err)
            });
        } catch (error) {
            alert(error);
        }
    };



    useEffect(() => {
        GetUserMail()

        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={Logo} style={styles.logo} />
            </View>
            <Animated.Text style={[styles.welcome, { opacity: fadeAnim }]}>Bienvenue ! </Animated.Text>
            <Animated.View style={[styles.Site, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] }]}>
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Notre site</Animated.Text>
                <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                    Bienvenue sur notre site dédié à la découverte des fleurs. Nous souhaitons partager notre passion pour ces merveilleuses créations de la nature et vous faire découvrir toutes les merveilles qu'elles recèlent.
                </Animated.Text>
            </Animated.View>
            <Animated.View style={[styles.EffetFleur, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [-50, 0] }) }] }]}>
                <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>L'effet des fleurs</Animated.Text>
                <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                    Les fleurs ont un impact positif sur notre bien-être. Elles nous apportent de la joie, de la couleur et de la bonne humeur. Des études ont montré que les personnes qui ont des fleurs chez eux sont moins stressées et plus heureuses.
                </Animated.Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff",
    },
    welcome: {
        marginTop: 30,
        fontSize: 24,
        fontWeight: "bold",
        color: "#46a094",
    },
    logoContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#46a094",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    logo: {
        width: "80%",
        height: "80%",
        resizeMode: "contain",
    },
    Site: {
        margin: 20,
        marginBottom: 10,
        padding: 10,
        borderWidth: 2,
        borderColor: "#46a094",
        borderRadius: 5,
        opacity: 0,
        transform: [{ translateY: 50 }],
    },
    EffetFleur: {
        margin: 20,
        padding: 10,
        borderWidth: 2,
        borderColor: "#46a094",
        borderRadius: 5,
        opacity: 0,
        transform: [{ translateY: 50 }],
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#46a094",
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: "black",
    },
});
export default Home;
