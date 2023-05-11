const express = require("express");
const fs = require('fs')
const conx = require("./db.config")
const axios = require("axios")
const app = express();
var bodyParser = require('body-parser');
const port = 5000;
const Validate_mail = require("./Mail/ConfirmSignupMail")

const cors = require('cors');
const { requestPermissionsAsync } = require("expo-media-library");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors(corsOptions));
app.use(express.json());

//-----------------------------------------------------------------//
//---------------------------- API --------------------------------//
//-----------------------------------------------------------------//

//---------- Connexion ----------//

app.get("/ccs", function (req, res) {
    res.send({ Connection: "ok" })
})

//-------------------------------//

//----------------------------------//
//---------- Page profil -----------//
//----------------------------------//

app.get("/GetUser", function (req, res) {
    conx.query
        ("SELECT * FROM Users", (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/GetUserByMail/:mail", function (req, res) {
    conx.query
        ("SELECT * FROM Users WHERE mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})


app.get("/GetUserByID/:id", function (req, res) {
    conx.query
        ("SELECT * FROM Users WHERE idUser=?",
            req.params.id, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.get("/GetRole/:mail", function (req, res) {
    conx.query
        ("SELECT Roles.* FROM Users, Roles WHERE Roles.idRole = Users.idRole AND mail = ?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);

            });
});


app.get("/GetBotaniste/:mail", function (req, res) {
    conx.query
        ("SELECT Users.* FROM Users WHERE Users.idRole = '2' AND mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.get("/GetAdresse/:mail", function (req, res) {
    conx.query
        ("SELECT Adresses.*,Users.idUser FROM Adresses, Users WHERE Users.idAdresse = Adresses.idAdresse AND mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.get("/LoadPostAnnonces/:mail", function (req, res) {
    conx.query(
        "SELECT Annonces.*, Users.idUser, " +
        "(SELECT pseudo FROM Users WHERE idUser IN (SELECT idUser FROM Reservations WHERE Reservations.idAnnonce = Annonces.idAnnonce AND Reservations.validation = 1)) AS pseudoTest, " +
        "(SELECT mail FROM Users WHERE idUser IN (SELECT idUser FROM Reservations WHERE Reservations.idAnnonce = Annonces.idAnnonce AND Reservations.validation = 1)) AS mailTest " +
        "FROM Annonces, Users WHERE Annonces.idUser = Users.idUser AND mail = ?",
        req.params.mail, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
});

app.get("/LoadKeepAnnonces/:mail", function (req, res) {
    conx.query("SELECT Annonces.*, Reservations.*, Users.* FROM Annonces INNER JOIN Reservations ON Annonces.idAnnonce = Reservations.idAnnonce INNER JOIN Users ON Users.idUser = Reservations.idUser WHERE Users.mail = ?",
        req.params.mail, (err, result) => {
            if (err) throw err;
            res.send(result);
        });
});

app.post("/UpdateAdresse/:voie/:rue/:ville/:cp/:idAdresse", function (req, res) {
    const adresse = req.params.voie + " " + req.params.rue + " " + req.params.cp + " " + req.params.ville
    axios({
        method: 'post',
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + adresse + "&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
    }).then((resp) => {
        conx.query("UPDATE Adresses set voie=? , rue=? , ville=? , cp=?, lat=? ,lng= ? WHERE idAdresse=?", [req.params.voie, req.params.rue, req.params.ville, req.params.cp, req.params.idAdresse, resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng], (err, result) => {
            if (err) throw err;
            res.send("OK")
        })
    })

})

app.post("/UpdateInfoProfil/:nom/:prenom/:telephone/:iduser", function (req, res) {
    conx.query("UPDATE Users set nom=? , prenom=? , telephone=? WHERE idUser=?", [req.params.nom, req.params.prenom, req.params.telephone, req.params.iduser], (err, result) => {
        if (err) throw err;
        res.send("OK")
    })
})


app.post("/ResetPassword/:password/:idUser", function (req, res) {
    conx.query("UPDATE Users SET mdp=? WHERE idUser=?", [req.params.password, req.params.idUser], (err, result) => {
        if (err) throw err;
        res.send("OK")
    })
})



//----------------------------------//
//------ Page visite de profil -----//
//----------------------------------//
app.get("/GetVisitUserByPseudo/:pseudo", function (req, res) {
    conx.query
        ("SELECT * FROM Users WHERE pseudo=?",
            req.params.pseudo, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

//----------------------------------//
//------ Page visite de profil Botaniste -----//
//----------------------------------//
app.get("/GetConseilsByBotaniste/:mail", function (req, res) {
    conx.query
        ("SELECT Conseils.*,TypesPlante.idTypePlante,TypesPlante.libelle,TypesPlante.urlPhoto FROM Users,Conseils,TypesPlante WHERE Users.idUser = Conseils.idUser AND Conseils.idTypePlante = TypesPlante.idTypePlante AND Users.mail = ?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

//----------------------------------//
//------- Page AllConseilsForTypePlante -------//
//----------------------------------//

app.get("/GetConseilAndUserByTypePlant/:idTypePlante", function (req, res) {
    conx.query
        ('SELECT Conseils.*,Users.pseudo,Users.mail FROM Conseils,Users WHERE Conseils.idUser = Users.idUser AND Conseils.idTypePlante = ?',
            req.params.idTypePlante, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})


//----------------------------------//
//------- Page recherche/map -------//
//----------------------------------//



//----------------------------------//
//---- Page recherche botaniste ----//
//----------------------------------//
app.get("/GetTypePlants", function (req, res) {
    conx.query
        ("SELECT * FROM TypesPlante", (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/GetTypePlantById/:id", function (req, res,) {
    conx.query
        ("SELECT * FROM TypesPlante WHERE idTypePlante = ?", req.params.id, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/GetTypesPlantsByName/:name", function (req, res) {
    conx.query
        ('SELECT * FROM TypesPlante WHERE libelle= ?', req.params.name, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/GetConseilByTypePlant/:idTypePlant", function (req, res) {
    conx.query
        ('SELECT * FROM Conseils WHERE idTypePlante = ?',
            req.params.idTypePlant, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.post("/CreateConseil/:mail/:idTypePlant", function (req, res) {
    conx.query
        ("SELECT idUser FROM Users WHERE mail = ?",
            req.params.mail, (err, result) => {
                if (err) {
                    throw err;
                }
                else {
                    const userId = result[0].idUser;
                    conx.query
                        ("INSERT INTO Conseils (titre, description, idTypePlante, idUser) VALUES (?, ?, ?, ?)",
                            [req.body.titre, req.body.description, req.params.idTypePlant, userId],
                            (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    res.send("OK");
                                }
                            }
                        );
                }
            }
        );
});

app.post("/UpdateConseil/:titre/:description/:idTypePlante/:idConseil", function (req, res) {
    conx.query
        ("UPDATE Conseils SET titre = ?, description = ?, idTypePlante = ? WHERE idConseil = ?",
            [req.params.titre, req.params.description, req.params.idTypePlante, req.params.idConseil], (err, result) => {
                if (err) throw err;
                res.send("OK");
            }
        );
})


app.delete("/DeleteConseilById/:idConseil", function (req, res) {
    conx.query
        ("DELETE FROM Conseils WHERE idConseil = ?",
            [req.params.idConseil],
            (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

//----------------------------------//
//-------- Page mes plantes --------//
//----------------------------------//
app.get("/TypePlantes", function (req, res) {
    conx.query
        ("SELECT idTypePlante, libelle FROM TypesPlante", (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/GetPlantByUser/:mail", function (req, res) {
    conx.query
        ("SELECT P.idPlante, P.nom, P.description, P.urlPhoto, U.mail, P.idTypePlante, Tp.libelle FROM Users U, Plantes P, TypesPlante Tp WHERE U.idUser = P.idUser AND P.idTypePlante = Tp.idTypePlante AND U.mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.get("/GetPlanteById/:idplante", function (req, res) {
    conx.query
        ("SELECT * FROM Plantes WHERE idPlante=?",
            req.params.idplante, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.get("/GetTypePlantesByName/:idplante", function (req, res) {
    conx.query
        ("SELECT * FROM Plantes WHERE idPlante=?",
            req.params.idplante, (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

app.post("/CreatePlanteByUser/:mail/:nom/:description/:type_plante", function (req, res) {
    // Récupérer l'id de l'utilisateur à partir de son email
    conx.query
        ("SELECT idUser FROM Users WHERE mail=?", req.params.mail, (err, result) => {
            if (err) {
                throw err;
            } else {
                const userId = result[0].idUser;

                // Insérer la plante dans la table Plantes en utilisant l'id de l'utilisateur récupéré
                conx.query("INSERT INTO Plantes (description, urlPhoto, nom, idUser, idTypePlante) VALUES (?, ?, ?, ?, ?)",
                    [req.params.description, req.body.urlphoto, req.params.nom, userId, req.params.type_plante],
                    (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            res.send("OK");
                        }
                    }
                );
            }
        });
});



app.post("/UpdatePlante/:idPlante/:nom/:description/:idTypePlante", function (req, res) {
    conx.query
        ("UPDATE Plantes SET nom=?, urlPhoto=?, description=?, idTypePlante=? WHERE idPlante = ?",
            [req.params.nom, req.body.url, req.params.description, req.params.idTypePlante, req.params.idPlante], (err, result) => {
                if (err) throw err;
                res.send("OK");
            })

})

app.delete("/DeletePlanteById/:id_plante", function (req, res) {
    conx.query
        ("DELETE FROM Plantes WHERE idPlante = ?",
            [req.params.id_plante],
            (err, result) => {
                if (err) throw err;
                res.send(result);
            })
})

//----------------------------------//
//-------- Page mes réservations ---//
//----------------------------------//

app.get("/GetReservation/:mail", function (req, res) {
    conx.query("SELECT R.idReservation, R.validation, A.dateDebut, A.dateFin, A.description , A.reference, U.mail FROM Users U,Reservations R, Annonces A WHERE R.idAnnonce = A.idAnnonce AND U.idUser = R.idUser AND U.mail = ?", req.params.mail, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.delete("/DeleteReservationById/:id_reservation", function (req, res) {
    conx.query("DELETE FROM Reservations WHERE idReservation = ?", [req.params.id_reservation],
        (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

//----------------------------------------------------------//
//---------- Page Annonce + Recheche de plantes----------//
//----------------------------------------------------------//
app.post("/SendRequestReservation/:idUser/:idAnnonce", function (req, res) {
    conx.query("INSERT INTO Reservations (idUser, idAnnonce) VALUES (?, ?)",
        [req.params.idUser, req.params.idAnnonce],
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.send("OK");
            }
        }
    );
})

app.post("/SendAbonnementByBotaniste/:idUser_1/:idAnnonce", function (req, res) {
    conx.query("INSERT INTO Annonces (idUser) VALUES (?)",
        [req.params.idUser_1],
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.send("OK");
            }
        }
    );
})

app.post("/CreateAnnonceByUser/:mail/:dateDebut/:dateFin/:description/:idNiveauExpertiseRequis/:idCycleCompteRendu", function (req, res) {
    // Récupérer l'id de l'utilisateur à partir de son email
    conx.query("SELECT idUser FROM Users WHERE mail=?", req.params.mail, (err, result) => {
        if (err) {
            throw err;
        } else {
            const userId = result[0].idUser;
            const plantIds = []; // stocke les IDs des plantes associées à l'utilisateur

            // Récupérer les IDs des plantes associées à l'utilisateur
            conx.query("SELECT idPlante FROM Plantes WHERE idUser=?", userId, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    // Ajouter les IDs des plantes dans le tableau plantIds
                    result.forEach((row) => {
                        plantIds.push(row.idPlante);
                    });

                    // Insérer l'annonce dans la table Annonces
                    conx.query("INSERT INTO Annonces (dateDebut, dateFin, description, idUser, idNiveauExpertiseRequis, idCycleCompteRendu) VALUES (?, ?, ?, ?, ?, ?)",
                        [req.params.dateDebut, req.params.dateFin, req.params.description, userId, req.params.idNiveauExpertiseRequis, req.params.idCycleCompteRendu],
                        (err, result) => {
                            if (err) {
                                throw err;
                            } else {
                                const annonceId = result.insertId; // récupérer l'ID de l'annonce insérée
                                const values = []; // stocke les valeurs à insérer dans la table contient

                                // Ajouter les valeurs à insérer dans le tableau values
                                plantIds.forEach((id) => {
                                    values.push([annonceId, id]);
                                });

                                // Insérer les plantes associées à l'utilisateur dans la table contient
                                conx.query("INSERT INTO contient (idAnnonce, idPlante) VALUES ?", [values], (err, result) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        res.send("OK");
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }
    });
});


app.get("/NiveauExpertiseRequis", function (req, res) {
    conx.query
        ("SELECT idNiveauExpertiseRequis, libelle FROM NiveauExpertiseRequis", (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/CycleCompteRendu", function (req, res) {
    conx.query
        ("SELECT idCycleCompteRendu, nombre FROM CycleCompteRendu", (err, result) => {
            if (err) throw err;
            res.send(result);
        })
})

app.get("/Search_plante_by_location_and_date/:ville/:niveauExpertise/:DateDebut/:DateFin", function (req, res) { // POUR RECUPERER LES ANNONCES POSTÉ DANS UNE VILLE ET DATE DONNÉE 
    if (req.params.DateDebut === "null" && req.params.DateFin === "null") {
        conx.query
            ("SELECT Annonces.*, Adresses.*,Users.photodeprofil,Users.mail,Users.nom,Users.prenom FROM Annonces INNER JOIN Users ON Annonces.idUser = Users.idUser INNER JOIN Adresses ON Users.idAdresse=Adresses.idAdresse WHERE Adresses.Ville LIKE ? AND Annonces.idNiveauExpertiseRequis=? ",
                ['%' + req.params.ville + '%', req.params.niveauExpertise], (err, result) => {
                    if (err) throw err;
                    if (Object.keys(result).length === 0) {
                        res.send("AUCUNE ANNONCE")
                    }
                    else {
                        res.send(result);
                    }
                })
    }
    else {
        conx.query
            ("SELECT Annonces.*, Adresses.*,Users.photodeprofil,Users.mail,Users.nom,Users.prenom FROM Annonces INNER JOIN Users ON Annonces.idUser = Users.idUser INNER JOIN Adresses ON Users.idAdresse=Adresses.idAdresse WHERE Adresses.Ville LIKE ? AND Annonces.idNiveauExpertiseRequis=? AND Annonces.dateDebut >= ? AND Annonces.dateFin <= ?",
                ['%' + req.params.ville + '%', req.params.niveauExpertise, req.params.DateDebut, req.params.DateFin], (err, result) => {
                    if (err) throw err;
                    if (Object.keys(result).length === 0) {
                        res.send("AUCUNE ANNONCE")
                    }
                    else {
                        res.send(result);
                    }
                })
    }

})

app.get("/GetCoordCenter/:ville", function (req, res) {
    axios({
        method: "post",
        url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + req.params.ville + "&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
    }).then((resp) => {
        const lat = resp.data.results[0].geometry.location.lat
        const lng = resp.data.results[0].geometry.location.lng
        res.send([lat, lng])
    })
})


//----------------------------------//
//--------- Page mon annonce -------//
//----------------------------------//
app.get("/GetAnnoncesActive/:mail", function (req, res) {
    conx.query(
        "SELECT Annonces.* " +
        "FROM Annonces, Users " +
        "WHERE Annonces.idUser = Users.idUser " +
        "AND Annonces.active = 1 " +
        "AND Users.mail = ? ",
        req.params.mail,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.get("/GetPhotosByAnnoncesWithComments/:idAnnonce", function (req, res) {
    conx.query(
        "SELECT Photos.*, Commentaires.* " +
        "FROM Annonces " +
        "INNER JOIN Photos ON Annonces.idAnnonce = Photos.idAnnonce " +
        "LEFT JOIN Commentaires ON Photos.idCommentaire = Commentaires.idCommentaire " +
        "WHERE Annonces.idAnnonce = ?",
        req.params.idAnnonce,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});


app.get("/GetKeeperByPhotos/:idAnnonce", function (req, res) {
    conx.query(
        "SELECT Users.* " +
        "FROM Users, Photos, Annonces " +
        "WHERE Users.idUser = Photos.idUser " +
        "AND Annonces.idAnnonce=? ",
        req.params.idAnnonce,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

//----------------------------------//
//----- Page annonces suivies ------//
//----------------------------------//

app.get("/GetAnnoncesReserved/:mail", function (req, res) {
    conx.query(
        "SELECT Annonces.*,Reservations.numero " +
        "FROM Annonces, Users, Reservations " +
        "WHERE Reservations.idAnnonce = Annonces.idAnnonce " +
        "AND Reservations.idUser = Users.idUser " +
        "AND Annonces.active = 1 " +
        "AND Reservations.validation = 1 " +
        "AND Users.mail = ? ",
        req.params.mail,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.get("/GetProprioByAnnonce/:idAnnonce", function (req, res) {
    conx.query(
        "SELECT Users.* " +
        "FROM Users, Annonces " +
        "WHERE Users.idUser = Annonces.idUser " +
        "AND Annonces.idAnnonce=? ",
        req.params.idAnnonce,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.post("/AddPhotoForFollow/:mail/:idAnnonce/:idPhoto", function (req, res) {
    conx.query
        ("SELECT idUser FROM Users WHERE mail=?", req.params.mail, (err, result) => {
            if (err) {
                throw err;
            } else {
                conx.query("INSERT INTO Photos (urlPhoto) VALUES (?)",
                    [req.body.urlphoto],
                    (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            res.send("OK");
                        }
                    }
                );
            }
        });
});

app.post("/UpdatePhotoForFollow/:idPhoto", function (req, res) {
    const { urlphoto } = req.body;
    const { idPhoto } = req.params;
    conx.query(
        "UPDATE Photos SET urlPhoto=? WHERE idPhoto=?",
        [urlphoto, idPhoto],
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.send("OK");
            }
        }
    );
});


//----------------------------------//
//----- Page annonces suivies Botaniste ------//
//----------------------------------//
app.get("/GetFollowAnnonce/:mail", function (req, res) {
    conx.query(
        "SELECT Annonces.* " +
        "FROM Annonces, Users " +
        "WHERE Users.idUser = Annonces.idUser_1 " +
        "AND Annonces.active = 1 " +
        "AND Users.mail = ? ",
        req.params.mail,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});

app.post("/AddCommentsForFollow/:mail/:idAnnonce/:idPhoto", function (req, res) {
    conx.query
        ("SELECT idUser FROM Users WHERE mail=?", req.params.mail, (err, result) => {
            if (err) {
                throw err;
            } else {
                const userId = result[0].idUser;

                conx.query("INSERT INTO Commentaires (description, idUser) VALUES (?, ?)",
                    [req.body.description, userId],
                    (err, result) => {
                        if (err) {
                            throw err;
                        } else {
                            const idCommentaire = result.insertId;
                            const idPhoto = req.params.idPhoto;
                            conx.query("UPDATE Photos SET idCommentaire=? WHERE idPhoto=?",
                                [idCommentaire, idPhoto],
                                (err, result) => {
                                    if (err) {
                                        throw err;
                                    } else {
                                        res.send("OK");
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
});

//-----------------------------------------------------------------//
//---------------------GESTION DES DEMANDES------------------------//
//-----------------------------------------------------------------//

app.get("/GetReservationAnnonce/:mail", function (req, res) {
    conx.query("SELECT Users.nom, Users.prenom, Users.telephone, Users.photodeprofil, Reservations.* FROM Reservations, Users, Annonces WHERE Annonces.idAnnonce = Reservations.idAnnonce AND Reservations.idUser = Users.idUser AND Annonces.idUser = (SELECT idUser FROM Users WHERE mail = ?)", req.params.mail, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.post("/UpdateReservationAccepter/:idReservation", function (req, res) {
    conx.query("UPDATE Reservations SET validation = 1 WHERE validation IS NULL AND idReservation = ?", req.params.idReservation, (err, result) => {
        if (err) throw err;
        res.send("OK")
    })
})

app.post("/UpdateReservationRefuser/:idReservation", function (req, res) {
    conx.query("UPDATE Reservations SET validation = 0 WHERE validation IS NULL AND idReservation = ?", req.params.idReservation, (err, result) => {
        if (err) throw err;
        res.send("OK")
    })
})


//----------------------------------//
//-------- Authentification --------//
//----------------------------------//

app.post("/Authentification/:Login/:Password", function (req, res) {
    conx.query
        ("SELECT mail,mdp,estVerifie FROM Users WHERE mail=? AND mdp=?",
            [req.params.Login, req.params.Password], (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length === 0) {
                    res.send({ Auth: "Failed" }) // Pas de compte trouvé
                }
                else if (result[0].estVerifie === 0) {
                    res.send({ Auth: "Undone" }) // Compte trouvé avec le bon mot de passe mais compte non validé par mail (VOIR NADJIB)
                }
                else {
                    res.send({ Auth: "Done" }) // Compte trouvé et validé
                }
            })
})

app.post("/ConfirmAccount/:mail", function (req, res) { //
    conx.query
        ("UPDATE Personne SET ConfirmedByMail=1 WHERE Mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                res.send("OK")
            })
})

app.post("/SendMailConfirmationCode/:mail/", function (req, res) {  // Pour envoyer le code pour confirmer l'adresse mail lors de l'inscription 
    const code = Validate_mail.Send_Code_Confirmation_Mail(req.params.mail);
    res.send({ Code: code })
})

app.post("/ValidateConfirmationCodeMail/:mail/:code", function (req, res) { // Pour confirmer le code envoyé par mail 
    conx.query
        ("SELECT * FROM CodeConfirmation WHERE Mail=? and Code=?",
            [req.params.mail, req.params.code], (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length > 0) {
                    conx.query("DELETE FROM CodeConfirmation WHERE Mail=? AND Code=?", [req.params.mail, req.params.code], (err, result) => {
                        if (err) throw err;
                        res.send("OK")
                    })
                }
                else {
                    res.send("FAIL")
                }
            })
})


app.post("/VerifyExistingMail/:mail", function (req, res) {
    conx.query
        ("SELECT Mail FROM Personne WHERE Mail=?",
            req.params.mail, (err, result) => {
                if (err) throw err;
                if (Object.keys(result).length === 0) {
                    res.send({ ExistingMail: "NO" })
                }
                else {
                    res.send({ ExistingMail: "YES" })
                }
            })
})

app.post("/registernewaccount/:Nom/:Prenom/:Mail/:Telephone/:Password/:NumeroRue/:Rue/:CodePostal/:Ville", function (req, res) {
    const argu = [req.params.Nom, req.params.Prenom, req.params.Mail, req.params.Telephone, req.params.Password]
    conx.query
        ("insert into Personne (Nom,Prenom,Mail,Telephone,mdp) VALUES (?,?,?,?,?)", argu, (err, result) => {
            if (err) throw err;
            conx.query
                ("insert into Adresse (Cp,Ville,Voie,Rue) VALUES (?,?,?,?)",
                    [req.params.CodePostal, req.params.Ville, req.params.NumeroRue, req.params.Rue], (err, result) => {
                        if (err) throw err;
                        res.send("Votre inscription a bien été enregistréé !")
                    })
        })
    res.send("OK")
})

//-----------------------------------------------------------------//
//-----------------------------------------------------------------//
//-----------------------------------------------------------------//

app.use(cors())

app.listen(port, console.log("====> Server Listening on " + port))