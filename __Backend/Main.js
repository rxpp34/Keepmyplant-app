const express = require("express");
const fs = require('fs')
const Path = require('path')  
const conx = require("./db.config")
const axios=require("axios")
const app = express();
var bodyParser = require('body-parser');
const port = 8080;
const Validate_mail = require("./Mail/ConfirmSignupMail")
const multer = require('multer')
const upload = multer({ dest: './UploadedPhoto' });
const FTP=require("./FTP_TRANSFERT")
const FTP_TREE=require("./FTP_MKDIR")
const {execSync} = require('child_process');


const cors = require('cors');
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
        req.params.mail,(err, result) => {
        if (err) throw err;
        res.send(result);
    })
})


app.get("/GetUserByID/:id", function (req, res) {
    conx.query
    ("SELECT * FROM Users WHERE idUser=?",
        req.params.id,(err, result) => {
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

app.post("/UpdateAdresse/:voie/:rue/:ville/:cp/:idAdresse",function (req,res)  {
    conx.query("UPDATE Adresses set voie=? , rue=? , ville=? , cp=? WHERE idAdresse=?", [req.params.voie,req.params.rue,req.params.ville,req.params.cp,req.params.idAdresse],(err,result) => {
        if(err) throw err ; 
        res.send("OK")
        res.send("OK")
    })
})

app.post("/UpdateInfoProfil/:nom/:prenom/:telephone/:pseudo/:iduser",function (req,res)  {
    conx.query("UPDATE Users set nom=? , prenom=? , telephone=?, pseudo=? WHERE idUser=?", [req.params.nom, req.params.prenom, req.params.telephone, req.params.pseudo, req.params.iduser],(err,result) => {
        if(err) throw err ; 
        res.send("OK")
    })
})


app.post("/ResetPassword/:password/:idUser",function(req,res) {
    conx.query("UPDATE Users SET mdp=? WHERE idUser=?",[req.params.password,req.params.idUser],(err,result) => {
        if (err) throw err ; 
        res.send("OK")
    })
})

//----------------------------------//
//------ Page visite de profil -----//
//----------------------------------//
app.get("/GetVisitUserByPseudo/:pseudo", function (req, res) {
    conx.query
    ("SELECT * FROM Users WHERE pseudo=?",
        req.params.pseudo,(err, result) => {
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
        req.params.mail,(err, result) => {
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
        if(err) throw err;
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
    ("SELECT * FROM TypesPlante WHERE idTypePlante = ?",req.params.id, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.get("/GetTypesPlantsByName/:name", function (req, res){
    conx.query
    ('SELECT * FROM TypesPlante WHERE libelle= ?', req.params.name, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

app.get("/GetConseilByTypePlant/:idTypePlant", function (req, res) {
    conx.query
    ('SELECT * FROM Conseils WHERE idTypePlante = ?',
        req.params.idTypePlant, (err, result) => {
        if(err) throw err;
        res.send(result);
        })
})

app.post("/CreateConseil/:mail/:idTypePlant", function (req, res){
    conx.query
    ("SELECT idUser FROM Users WHERE mail = ?",
        req.params.mail, (err, result)=>{
            if (err) {
                throw err;
            }
            else {
                const userId = result[0].idUser;
                conx.query
                ("INSERT INTO Conseils (titre, description, idTypePlante, idUser) VALUES (?, ?, ?, ?)",
                    [req.body.titre, req.body.description, req.params.idTypePlant, userId],
                    (err, result)=>{
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
        [req.params.titre, req.params.description,req.params.idTypePlante, req.params.idConseil], (err, result) => {
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

app.get("/GetPlantByUserId/:idUser", function (req, res) {
    conx.query
    ("SELECT P.idPlante, P.nom, P.description, P.urlPhoto, U.mail, P.idTypePlante, Tp.libelle FROM Users U, Plantes P, TypesPlante Tp WHERE U.idUser = P.idUser AND P.idTypePlante = Tp.idTypePlante AND U.idUser = ?",
        req.params.idUser, (err, result) => {
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

app.post("/UploadPhotoToFolder/:extension/:mail",upload.single('image'), (req,res) => {

    const imageName = req.file.filename
    const old_path="./UploadedPhoto/"+imageName
    const new_path="./UploadedPhoto/"+imageName+"."+req.params.extension
    fs.rename(old_path,new_path, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    })
    const RemotePath="/home/sastret/www/drive_mspr/"+req.params.mail+"/"+imageName+"."+req.params.extension
    FTP.UploadToFTP(new_path,RemotePath)

    res.send("OK")
   
})

app.get("/GetUrlPhotoByUserID/:UserID", function (req, res) {
    conx.query("SELECT * FROM Plantes WHERE idUser=?",
        req.params.UserID,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});


app.post("/CreatePlanteByUser/:mail/:nom/:description/:type_plante/:extension", upload.single('image'),function (req, res){
    
    //TRANSFER FTP DE L'IMAGE
    const imageName = req.file.filename // on recupere le nom généré 
    const old_path="./UploadedPhoto/"+imageName //old path et new_path pour renommer le fichier 
    const new_path="./UploadedPhoto/"+imageName+"."+req.params.extension
    fs.rename(old_path,new_path, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    })

    const RemotePath="/home/sastret/www/drive_mspr/"+req.params.mail+"/"+imageName+"."+req.params.extension

    FTP.UploadToFTP(new_path,RemotePath) //TRANSFER VERS FTP HUGO

    

    // Récupérer l'id de l'utilisateur à partir de son email
    conx.query
    ("SELECT idUser FROM Users WHERE mail=?",req.params.mail, (err, result)=>{
        if (err) {
            throw err;
        } else {
            const userId = result[0].idUser;
            const _urlPhoto="https://sastre-hugo.com/drive_mspr/"+req.params.mail+"/"+imageName+"."+req.params.extension
    
            // Insérer la plante dans la table Plantes en utilisant l'id de l'utilisateur récupéré
            conx.query("INSERT INTO Plantes (description, urlPhoto, nom, idUser, idTypePlante) VALUES (?, ?, ?, ?, ?)",
                [req.params.description, _urlPhoto, req.params.nom, userId, req.params.type_plante],
                (err, result)=>{
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
        [req.params.nom,req.body.url,req.params.description,req.params.idTypePlante,req.params.idPlante], (err, result) => {
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
    conx.query("SELECT R.idReservation, R.validation, A.dateDebut, A.dateFin, A.description , A.reference, U.mail FROM Users U,Reservations R, Annonces A WHERE R.idAnnonce = A.idAnnonce AND U.idUser = R.idUser AND U.mail = ?" ,req.params.mail, (err, result) => {
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
    [req.params.idUser,req.params.idAnnonce],
    (err, result)=>{
        if (err) {
            throw err;
        } else {
            res.send("OK");
        }
    }
);
})

app.post("/SendAbonnementByBotaniste/:idUser/:idAnnonce", function (req, res) {
    conx.query(
        "UPDATE Annonces SET idUser_1 = ? WHERE idAnnonce = ?",
        [req.params.idUser, req.params.idAnnonce],
        (err, result) => {
            if (err) {
                throw err;
            } else {
                res.send("OK");
            }
        }
    );
});


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
                    conx.query("INSERT INTO Annonces (dateDebut, dateFin, description, idUser, idNiveauExpertiseRequis, idCycleCompteRendu, active) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [req.params.dateDebut, req.params.dateFin, req.params.description, userId, req.params.idNiveauExpertiseRequis, req.params.idCycleCompteRendu, null],
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

app.get("/Search_plante_by_location_and_date/:ville/:niveauExpertise/:DateDebut/:DateFin/:mail", function (req, res) { // POUR RECUPERER LES ANNONCES POSTÉ DANS UNE VILLE ET DATE DONNÉE 
    if(req.params.DateDebut==="null" && req.params.DateFin==="null")
    {
        conx.query(
            "SELECT Annonces.*, Adresses.*,Users.photodeprofil,Users.mail,Users.nom,Users.prenom " +
            "FROM Annonces " +
            "INNER JOIN Users ON Annonces.idUser = Users.idUser " +
            "INNER JOIN Adresses ON Users.idAdresse=Adresses.idAdresse " +
            "WHERE Adresses.Ville LIKE ? " +
            "AND Annonces.idNiveauExpertiseRequis=? " +
            "AND Annonces.dateFin > NOW() " +
            "AND Users.idUser != ( SELECT idUser FROM Users WHERE mail =?) " +
            "AND NOT EXISTS ( " +
            "SELECT * " +
            "FROM Reservations " +
            "WHERE Reservations.idAnnonce = Annonces.idAnnonce " +
            "AND Reservations.validation = 1 )",
            ['%' + req.params.ville + '%',req.params.niveauExpertise,req.params.mail], (err, result) => {
            if (err) throw err;
            if(Object.keys(result).length===0)
            {
                res.send("AUCUNE ANNONCE")
            }
            else
            {
                res.send(result);
            }
        })
    }
    else
    {
        conx.query(
            "SELECT Annonces.*, Adresses.*,Users.photodeprofil,Users.mail,Users.nom,Users.prenom " +
            "FROM Annonces " +
            "INNER JOIN Users ON Annonces.idUser = Users.idUser " +
            "INNER JOIN Adresses ON Users.idAdresse=Adresses.idAdresse " +
            "WHERE Adresses.Ville LIKE ? " +
            "AND Annonces.idNiveauExpertiseRequis=? " +
            "AND Annonces.dateDebut >= ? " +
            "AND Annonces.dateFin <= ? " +
            "AND Annonces.dateFin > NOW() " +
            "AND Users.idUser != ( SELECT idUser FROM Users WHERE mail =?) " +
            "AND NOT EXISTS ( " +
            "SELECT * " +
            "FROM Reservations " +
            "WHERE Reservations.idAnnonce = Annonces.idAnnonce " +
            "AND Reservations.validation = 1)",
            ['%' + req.params.ville + '%',req.params.niveauExpertise,req.params.DateDebut,req.params.DateFin,req.params.mail], (err, result) => {
            if (err) throw err;
            if(Object.keys(result).length===0)
            {
                res.send("AUCUNE ANNONCE")
            }
            else
            {
                res.send(result);
            }
        })
    }
   
})

app.get("/GetCoordCenter/:ville", function (req,res)  {
    axios({
        method : "post",
        url :"https://maps.googleapis.com/maps/api/geocode/json?address="+req.params.ville+"&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
    }).then((resp) => {
        const lat=resp.data.results[0].geometry.location.lat
        const lng=resp.data.results[0].geometry.location.lng
        res.send([lat,lng])
    })
})


//----------------------------------//
//--------- Page mon annonce -------//
//----------------------------------//
app.get("/GetAnnoncesActive/:mail", function (req, res) {
    conx.query( 
        "SELECT Annonces.* "  +
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

app.get("/GetKeeperByAnnonce/:idAnnonce", function (req, res) {
    conx.query( 
        "SELECT Users.* "  +
        "FROM Annonces, Users, Reservations " +
        "WHERE Annonces.idAnnonce = Reservations.idAnnonce " +
        "AND Reservations.idUser = Users.idUser " +
        "AND Annonces.active = 1 " +
        "AND Annonces.idAnnonce = ? ",
        req.params.idAnnonce,
        (err, result) => {
            if (err) throw err;
            res.send(result);
        }
    );
});



app.get("/GetAnnonces/:mail", function (req, res) {
    conx.query( 
        "SELECT Annonces.* " +
        "FROM Annonces, Users " +
        "WHERE Annonces.idUser = Users.idUser " +
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

app.post("/AddPhotoForFollow/:mail/:idAnnonce/:idPhoto", function (req, res){
    conx.query
    ("SELECT idUser FROM Users WHERE mail=?",req.params.mail, (err, result)=>{
        if (err) {
            throw err;
        } else {
            conx.query("INSERT INTO Photos (urlPhoto) VALUES (?)",
                [req.body.urlphoto],
                (err, result)=>{
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

app.post("/UpdatePhotoForFollow/:idPhoto", function(req, res){
    const { urlphoto } = req.body;
    const { idPhoto } = req.params;
    conx.query(
        "UPDATE Photos SET urlPhoto=? WHERE idPhoto=?",
        [urlphoto, idPhoto],
        (err, result)=>{
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

app.post("/AddCommentsForFollow/:mail/:idAnnonce/:idPhoto", function (req, res){
    conx.query
    ("SELECT idUser FROM Users WHERE mail=?",req.params.mail, (err, result)=>{
        if (err) {
            throw err;
        } else {
            const userId = result[0].idUser;

            conx.query("INSERT INTO Commentaires (description, idUser) VALUES (?, ?)",
                [req.body.description,userId],
                (err, result)=>{
                    if (err) {
                        throw err;
                    } else {
                        const idCommentaire = result.insertId;
                        const idPhoto = req.params.idPhoto;
                        conx.query("UPDATE Photos SET idCommentaire=? WHERE idPhoto=?",
                            [idCommentaire, idPhoto],
                            (err, result)=>{
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
    conx.query("SELECT Users.nom, Users.prenom, Users.telephone, Users.photodeprofil, Reservations.* FROM Reservations, Users, Annonces WHERE Annonces.idAnnonce = Reservations.idAnnonce AND Reservations.idUser = Users.idUser AND Annonces.idUser = (SELECT idUser FROM Users WHERE mail = ?)" ,req.params.mail, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.post("/UpdateReservationAccepter/:idReservation",function (req,res)  {
    conx.query("UPDATE Reservations SET validation = 1 WHERE validation IS NULL AND idReservation = ?", req.params.idReservation,(err,result) => {
        if(err) throw err ;
        res.send("OK")
    })
})

app.post("/UpdateReservationRefuser/:idReservation",function (req,res)  {
    conx.query("UPDATE Reservations SET validation = 0 WHERE validation IS NULL AND idReservation = ?", req.params.idReservation,(err,result) => {
        if(err) throw err ;
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
        else if(result[0].estVerifie===0){
            res.send({ Auth: "Undone" }) // Compte trouvé avec le bon mot de passe mais compte non validé par mail (VOIR NADJIB)
        }
        else
        {
            res.send({ Auth: "Done" }) // Compte trouvé et validé
        }
    })
})

app.post("/ConfirmAccount/:mail",function (req,res) { //
    conx.query
    ("UPDATE Users SET estVerifie=1 WHERE Mail=?",
        req.params.mail,(err,result) => {
        if (err) throw err ; 
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
            res.send("OK")
        }
        else {
            res.send("FAIL")
        }
    })
})

app.post("/VerifyExistingMail/:mail", function (req, res) {
    conx.query
    ("SELECT mail FROM Users WHERE mail=?",
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

app.post("/registernewaccount/:Pseudo/:Nom/:Prenom/:Mail/:Telephone/:Password/:NumeroRue/:Rue/:CodePostal/:Ville/:extension",upload.single('image'),function (req,res) {
    
   const RemotePath = "/home/sastret/www/drive_mspr/"+req.params.Mail
    FTP_TREE.CreateTree(RemotePath)
    
    const imageName = req.file.filename
    const old_path="./UploadedPhoto/"+imageName
    const new_path="./UploadedPhoto/"+imageName+"."+req.params.extension

    fs.rename(old_path,new_path, function(err) {
        if ( err ) console.log('ERROR: ' + err);
    })

    setTimeout(() => {
        const RemotePathFTP="/home/sastret/www/drive_mspr/"+req.params.Mail+"/"+imageName+"."+req.params.extension
        FTP.UploadToFTP(new_path,RemotePathFTP)
    } , 2000)

   

   const idRole = 1
    const pdp="https://sastre-hugo.com/drive_mspr/"+req.params.Mail+"/"+imageName+"."+req.params.extension ;
    const argu=[req.params.Pseudo,req.params.Nom,req.params.Prenom,req.params.Mail,req.params.Telephone,req.params.Password,pdp,idRole]
    conx.query
    ("INSERT INTO Users (Pseudo,Nom,Prenom,Mail,Telephone,mdp,photodeprofil,idRole) VALUES (?,?,?,?,?,?,?,?)", argu,(err,result) => {
        if (err) throw err ;
        const adresse=req.params.NumeroRue+" "+req.params.Rue+" "+req.params.CodePostal+" "+req.params.Ville
        axios({
            method : "POST",
            url : "https://maps.googleapis.com/maps/api/geocode/json?address="+adresse+"&key=AIzaSyD580n6077mlkKAFPsp37g0lm-5ouuVEF4"
        }).then((resp) => {
            conx.query
            ("INSERT INTO Adresses (Cp,Ville,Voie,Rue,lat,lgt) VALUES (?,?,?,?,?,?)",
                [req.params.CodePostal,req.params.Ville,req.params.NumeroRue,req.params.Rue,resp.data.results[0].geometry.location.lat,resp.data.results[0].geometry.location.lng],(err,result) => {
                if (err) throw err ;
                  
            const idAdresse = result.insertId;
  
            conx.query("UPDATE Users SET idAdresse = ? WHERE Mail = ?", [idAdresse, req.params.Mail], (err, result) => {
              if (err) throw err;
              res.send("ok")
            });
            })
        })
    })

    
})
  

//-----------------------------------------------------------------//
//--------------------------FRONT BATOU----------------------------//
//-----------------------------------------------------------------//


app.get("/GetProfilePhotoByPseudo/:Pseudo", function (req, res) {
    conx.query("SELECT photodeprofil FROM Users WHERE pseudo = ?", req.params.Pseudo, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
    }
)

app.use(cors())

app.listen(port, console.log("====> Server Listening on " + port))

module.exports = app;