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

// Banco de dados 
let DB = {
   palestrantes: [
    {
      id: 1,
      nome: "Jessé Rocha",
      empresa: "Markedin",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 2,
      nome: "Paulo Guedes",
      empresa: "#######",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 3,
      nome: "Thiago Nigro",
      empresa: "O primo rico",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 4,
      nome: "Filipi Lima",
      empresa: "arkigai",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 5,
      nome: "Jessé Rocha",
      empresa: "Markedin",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 6,
      nome: "Paulo Guedes",
      empresa: "#######",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 7,
      nome: "Thiago Nigro",
      empresa: "O primo rico",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 8,
      nome: "Filipi Lima",
      empresa: "arkigai",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 9,
      nome: "Jessé Rocha",
      empresa: "Markedin",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 10,
      nome: "Paulo Guedes",
      empresa: "#######",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },
    {
      id: 11,
      nome: "Thiago Nigro",
      empresa: "O primo rico",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg" 
    },
    {
      id: 12,
      nome: "Filipi Lima",
      empresa: "arkigai",
      tema: "etc",
      img: "/home/oguuiholiv/Documentos/PROJETOS/REACT/varejo/src/assets/users/01.jpg"
    },

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
app.get("/palestrantes", (req, res) => {
  res.statusCode = 200;
  res.json(DB.palestrantes);
})

// Lista os dados dentro de movie Id
app.get("/palestrantes/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    var id = parseInt(req.params.id);
    var movie = DB.palestrantes.find(m => m.id == id);

    if (movie != undefined) {
      res.statusCode = 200;
      res.json(movie)
    } else {
      res.sendStatus(404);
    }

  }
})

// Cria / Adiciona um novo filme
app.post("/palestrantes", (req, res) => {
  var { id, nome, aniversario, hour } = req.body;

  DB.movies.push({
    id,
    nome,
    aniversario,
    hour
  });
  res.sendStatus(200);
});

// Deleta um filme
app.delete("/palestrantes/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    var index = DB.palestrantes.findIndex(m => m.id == id);

    if (index == -1) {
      res.sendStatus(404);
    } else {
      DB.palestrantes.splice(index, 1);
      res.sendStatus(200);
    }
  }
})

// Altera os dados de um filme
app.put("/palestrantes/:id",(req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {

    var id = parseInt(req.params.id);
    var palestrantes = DB.palestrantes.find(m => m.id == id);

    if (movie != undefined) {
      var { id, nome, aniversario, hour } = req.body;

      if (id != undefined) {
        palestrantes.id = id;
      }
      if (nome != undefined) {
        palestrantes.nome = nome;
      }
      if (aniversario != undefined) {
        palestrantes.aniversario = aniversario;
      }
      if (hour != undefined) {
        palestrantes.hour = hour;
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

        // res.status(200);
        // res.json({ token: token })
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