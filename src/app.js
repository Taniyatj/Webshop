//main 

// benötigte Module laden
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");   //für die korrekte Interpretation der Datei- und Verzeichnispfade im Windows-Stil
const fs = require("fs");   //file system zum Zurückgrefen aud Dateisystemen + Lesen und Schreiben von Dateien
const dotenv = require("dotenv").config();   //um verschiedene Umgebungsvariablen und deren Werte festzulegen (?)
 
const mongoose = require("mongoose");
const conn = require("./db/conn");

const bcrypt = require ("bcrypt"); 
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))}    
});

const upload = multer({ storage: storage });
const imgModel = require('./models/products');

app.get('/views/product_upload', (req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
});

app.post('/views/product_upload', upload.single('image'), (req, res, next) => {
  
  const obj = {
      productN: req.body.productN,
      anzahl: req.body.anzahl,
      beschr: req.body.beschr,
      price: req.body.price,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image'
      }
      
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/views/index');
      }
  });
});

const static_path = path.join(__dirname, "../public"); 
const templates_path = path.join(__dirname, "../views"); 
const product_path = path.join(__dirname, "../uploads");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
 
app.use(express.static(static_path));
app.use("/views", express.static('./views/'));
app.set('view engine', 'ejs');
app.set("views", templates_path);


app.get("/", (req, res) => {
  res.render("index")
});

app.get("./products.ejs", (req, res) => {
  res.render("products");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/logout", (req, res) => {
  try {
    console.log("Logout successful!");
    res.render("login");
  } catch (error) {

    res.status(500).send (error);
    
  }
}); 

app.post("/register", async (req, res) => {
  try {

    const password = req.body.psw;
    const cpassword = req.body.cpsw;
    
    if(password === cpassword){

      const registerUser = new User({
        userN : req.body.userN,  
        adrs1 : req.body.adrs1,
        adrs2 : req.body.adrs2,
        eml : req.body.eml,
        psw : req.body.psw,
        cpsw : req.body.cpsw
      })

      const registered = await registerUser.save();
      res.status(201).render("index");

    }else{
      res.send("Passwörter sind nicht identisch!");
    }
   /*  console.log(req.body.userN);
    res.send(req.body.userN); */

  } catch(error) {
    res.status(400).send(error);
  }
});

//Login-Überprüfung

app.post("/login", async(req, res) => {
  try {
    
    const userName = req.body.userN;
    const password = req.body.psw;
  
  const username = await User.findOne({userN:userName});

  const isMatch = await bcrypt.compare(password, username.psw);
  
  //hab hier viele Probleme gehabt, da ich beide vertauscht habe.
  if(isMatch){
    res.status(201).render("index");
  }else{
    res.send("password are not matching"); 
  }

  } catch (error) {
    res.status(400).send("Entweder der Name oder das Passwort stimmt nicht.")
  }
}); 


const port = process.env.Port || 3000;   //Automatische Generation des Portnr. oder eine lokale Portnr.   
app.listen(port, () => {console.log(`Server is running at port ${port}.`);})   //Ist die Verbindung erfolgreich? 


 