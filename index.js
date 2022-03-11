const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { sendStatus } = require("express/lib/response");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const JWTSecret = "SecretJwt";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

auth = (req, res, next) => {
  const authToken = req.headers['authorization'];
  if (authToken != undefined) {
    const bearer = authToken.split(' ');
    var token = bearer[1];

    jwt.verify(token,JWTSecret,(err, data) => {
      if (err) {
        res.status(401)
        res.json({ err: "Token inválido" });
      } else {
        res.status(200)
        req.token = token;
        req.loggedUser = {id: data.id, email: data.email, name: data.name};
        next();
      }
    })
    console.log(bearer);
  } else {
    res.status(401);
    res.json({ err: "Token inválido" })
  }




}





// Banco de dados falso
let DB = {
  movies: [

    {
      id: 11,
      title: "Home Team",
      year: 2022,
      platform: "Netflix"
    },

    {
      id: 12,
      title: "Swap Shop - Serie",
      year: 2022,
      platform: "Netflix"
    },

    {
      id: 13,
      title: "Two and a Half Men",
      year: 2003,
      platform: "Prime Video"
    },

    {
      id: 14,
      title: "Mr Robot",
      year: 2015,
      platform: "Prime Video"
    }
  ],
  users: [
    {
      id: 1,
      name: "Guih",
      email: "dev@gmail.com",
      password: "nodejs"
    }
  ]
}
// Lista os dados dentro de movies
app.get("/movies", auth, (req, res) => {
  res.statusCode = 200;
  res.json(DB.movies);
})

// Lista os dados dentro de movie Id
app.get("/movies/:id",auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    var id = parseInt(req.params.id);
    var movie = DB.movies.find(m => m.id == id);

    if (movie != undefined) {
      res.statusCode = 200;
      res.json(movie)
    } else {
      res.sendStatus(404);
    }

  }
})

// Cria / Adiciona um novo filme
app.post("/movies",auth, (req, res) => {
  var { title, year, platform } = req.body;

  DB.movies.push({
    id: 25,
    title,
    year,
    platform
  });
  res.sendStatus(200);
});

// Deleta um filme
app.delete("/movies/:id",auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var index = DB.movies.findIndex(m => m.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.movies.splice(index, 1);
      res.sendStatus(200);
    }
  }
})

// Altera os dados de um filme
app.put("/movies/:id", auth,(req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    var id = parseInt(req.params.id);
    var movie = DB.movies.find(m => m.id == id);

    if (movie != undefined) {
      var { title, year, platform } = req.body;

      if (title != undefined) {
        movie.title = title;
      }
      if (year != undefined) {
        movie.year = year;
      }
      if (platform != undefined) {
        movie.platform = platform;
      }
      res.sendStatus(200);

    } else {
      res.sendStatus(404);
    }

  }
})

app.post("/auth", (req, res) => {
  var { email, password } = req.body;
  
  if (email != undefined) {
    var user = DB.users.find(u => u.email == email);
    if (user != undefined) {
      if (user.password == password) {

        jwt.sign({ id: user.id, email: user.email, name: user.name}, JWTSecret, { expiresIn: "24h" }, (err, token) => {
          if (err) {
            res.status(400);
            res.json({ err: "Falha Interna"})
          } else {
            res.status(200);
            res.json({ token: token });
          }
        })

        res.status(200);
        res.json({ token: token })
      } else {
        res.status(401);
        res.json({ err: "Credenciais inválidas" })
      }
    } else {
      res.status(404);
      res.json({ err: "O e-mail enviado não existe na base de dados" });
    }

  } else {
    res.status(400);
    res.json({ err: "O e-mail enviado é inválido" });
  }


})

// Fazendo o app rodar na porta 28555;
app.listen(28555, () => {
  console.log("API rodando!");
})