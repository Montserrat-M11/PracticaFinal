const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 3000
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.render('pages/Home'))
app.get('/Books', (req, res) => res.render('pages/Books'))
app.get('/AboutUs', (req, res) => res.render('pages/AboutUs'))
app.get('/Contacts', (req, res) => res.render('pages/Contacts'))

//Conexión a SQL
const connection = mysql.createConnection({
    host: 'freedb.tech',
    user: 'freedbtech_Monche',
    password: 'monche',
    database: 'freedbtech_PracticaFinalBDMontse',
})

connection.connect(error => {
    if (error) throw error;
    console.log('Database running');
})

app.get('/Users', (req, res) => {
    const sql = 'SELECT * FROM Users';

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        res.render('pages/Users', {
            'results': results
        })
    })
});

app.get('/Form', (req, res) => res.render('pages/Form'))
app.post('/Form', (req, res) => {
    const sql = `SELECT * FROM Users WHERE Email = '${req.body.Email}'`;
    const sql2 = 'INSERT INTO Users SET ?';

    const {
        Email,
        Name,
        Favorite_Genre,
        Ocupation
    } = req.body;

    contentHTML = `
        <h1>¡Recibido!</h1>
        <ul>
            <li>Email: ${Email}</li>
            <li>Name: ${Name}</li>
            <li>Favorite_Genre: ${Favorite_Genre}</li>
            <li>Ocupation: ${Ocupation}</li>
        </ul>
    `

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'proyectobdm11@gmail.com',
            pass: 'Monchem11'
        }

    })
    const info = {
        from: 'proyectobdm11@gmail.com',
        to: 'tejadamontserrat02@gmail.com',
        subject: 'Suscripción',
        html: contentHTML
    }

    connection.query(sql, (error, results) => {
        if (error) {
            throw error;
        }
        if (!results.length > 0) {
            const usersObj = {
                Email: req.body.Email,
                Name: req.body.Name,
                Favorite_Genre: req.body.Favorite_Genre,
                Ocupation: req.body.Ocupation
            }
            connection.query(sql2, usersObj, error => {
                if (error) {
                    throw error;
                }

            })
        } 
          //Enviar correo
          transporter.sendMail(info, error => {
            if (error) {
                throw error;
            } else {
                console.log('¡Email Enviado!')
            }
        })

    })
    res.render('pages/Home')
})

app.listen(port, () => console.log("Server running"));