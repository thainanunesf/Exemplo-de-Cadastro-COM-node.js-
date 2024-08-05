const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json()) 
// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'escola'
});

// Connect
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});

app.get('/', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getalunos">Listar Alunos</a></li>
    <li><a href="/deletealuno">Apagar Aluno</a></li>
    <li><a href="/addaluno">Apagar Aluno</a></li>
  </ul> 
  `);
});

// Insert aluno form
app.get('/addaluno', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getalunos">Listar Alunos</a></li>
    <li><a href="/deletealuno">Apagar Aluno</a></li>
  </ul>
  <br>
    <form action="/addaluno" method="post">
      <label>Nome:</label>
      <input type="text" name="nome" required><br><br>
      <label>Idade:</label>
      <input type="number" name="idade" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});


app.get('/deletealuno', (req, res) => {
    res.send(`
    <h1>Menu</h1>
    <ul>
      <li><a href="/addaluno">Adicionar Aluno</a></li>
      <li><a href="/getalunos">Listar Alunos</a></li>
      </ul>
    <br>
      <form action="/deletealuno" method="post">
        <label>Id aluno:</label>
        <input type="text" name="id" required><br><br>
       <br>
        <input type="submit" value="Submit">
      </form>
    `);
  });



  app.post('/deletealuno', (req, res) => {
    let query = db.query('DELETE FROM aluno where id=?',
   [req.body.id],
   (err, result) => {
       if(err) throw err;
       console.log(result);
       res.redirect('/getalunos');
   });
 });
  

// Insert aluno
app.post('/addaluno', (req, res) => {
   let query = db.query('INSERT INTO aluno (idade, nome) Values(?,?)',
  [req.body.idade,req.body.nome],
  (err, result) => {
      if(err) throw err;
      console.log(result);
      res.redirect('/getalunos');
  });
});

// Select alunos
app.get('/getalunos', (req, res) => {
  let sql = 'SELECT * FROM aluno';
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send(`
      <h1>Menu</h1>
    <ul>
      <li><a href="/addaluno">Adicionar Aluno</a></li>
      <li><a href="/deletealuno">Apagar Aluno</a></li>
    </ul>
    <br>
        <table>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Idade</th>
          </tr>
          ${results.map(aluno => `<tr><td>${aluno.id}</td><td>${aluno.nome}</td><td>${aluno.idade}</td></tr>`).join('')}
        </table>
      `);
  });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});