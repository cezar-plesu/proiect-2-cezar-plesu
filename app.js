const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser')

const app = express();

const port = 6789;


app.use(cookieParser())
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului este views/layout.ejs
app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client (e.g., fișiere css, javascript, imagini)
app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în format json în req.body
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({
	extended: true
}));

// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello World'
// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => {

//	req.cookies.name="utilizator";
	//console.log(req.cookies);
	res.render('index');

});

// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția specificată
app.get('/chestionar', (req, res) => {
	const fs = require('fs');

	let rawdata = fs.readFileSync('intrebari.json');
	let listaIntrebari = JSON.parse(rawdata);
	// în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care conține vectorul de întrebări
	res.render('chestionar', {
		intrebari: listaIntrebari
	});
});

app.post('/rezultat-chestionar', (req, res) => {
	console.log(req.body);
	res.send("formular: " + JSON.stringify(req.body));
	const fs = require('fs');

	let rawdata = fs.readFileSync('intrebari.json');
	let listaIntrebari = JSON.parse(rawdata);

	let corecte = 0;

	listaIntrebari.forEach(intrebare => { 
		var nume_intrebare = intrebare.intrebare;
		//console.log(""+nume_intrebare)
		
		var r = JSON.stringify(req.body)[""+(nume_intrebare)];
		console.log("ok"+r+" "+nume_intrebare);
		if( r === intrebare.corect)
		{
			corecte ++ ;
			console.log("-------------"+r);
		}
		else
		{
			console.log("-------------"+r);
		}
	})

});

app.get('/autentificare', (req, res) => {
	res.render('autentificare');
});

app.post("/verificare-autentificare", (req, res) => {
	user = req.body;
	if (user.username == "admin" && user.password == "admin") {
		res.cookie("utilizator", user.username);
		res.redirect("/")
	} else {
		res.cookie("log in fail");
		res.redirect("/autentificare");
	}
});

function validate_cookies(req,res,next)
{
	const{cookies}=req;
	next();
}


app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));