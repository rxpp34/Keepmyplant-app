const mysql=require("mysql")

const conx=mysql.createConnection({
    host : '192.168.1.200', 
    user : "Admin",
    password :"%Pucelle6969",
    database : "Keepmyplant",
    dateStrings: true
}) ; 



conx.connect((error) => {
    if (error) throw error
    console.log("====> MySQL Connected.")
})



module.exports=conx ;

