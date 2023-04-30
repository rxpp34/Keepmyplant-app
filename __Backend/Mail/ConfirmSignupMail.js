const nodemailer = require("nodemailer");
const conx = require("../db.config")
const fs = require("fs")
const handlebars = require("handlebars");
var path = require("path")



function Send_Code_Confirmation_Mail(mail) {
    const Code = Math.floor(Math.random() * 999999)

    conx.query("INSERT INTO CodeConfirmation (Mail,Code) VALUES (?,?)", [mail, Code], (err, result) => {

        const filePath = path.join(__dirname, './ConfirmationCode.html');
        const source = fs.readFileSync(filePath, 'utf-8').toString();
        const template = handlebars.compile(source);
        const replacements = {
            __Code: Code,

        };

        const htmlToSend = template(replacements);

        let transporter = nodemailer.createTransport({
            host: "smtp-fr.securemail.pro",
            port: 465,
            secure: true,
            auth: {
                user: "no-reply@codx.fr",
                pass: "#Nadjib2023",
            },
        });


        // send mail with server error 
        transporter.sendMail({
            from: '"KeepMyPlant" <keeypmyplant@codx.fr>', // sender address
            to: mail, // list of receivers
            subject: "KeepMyPlant - Confirmer votre adresse mail", // Subject line
            text: "", // plain text body
            html: htmlToSend, // html body,



        });

    })

    return (Code);

}


module.exports = { Send_Code_Confirmation_Mail }








