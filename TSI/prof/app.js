const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ifb'
});

// Connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySql Connected...');
});

app.get('/', (req, res) => {
  res.send(`
    <h1>Menu</h1>
    <ul>
      <li><a href="/getprofessor">Listar Professor</a></li>
      <li><a href="/deleteprofessor">Apagar Professor</a></li>
      <li><a href="/addprofessor">Adicionar Professor</a></li>
    </ul>
  `);
});

// Insert professor form
app.get('/addprofessor', (req, res) => {
  res.send(`
    <h1>Adicionar Professor</h1>
    <ul>
      <li><a href="/getprofessor">Listar Professor</a></li>
      <li><a href="/deleteprofessor">Apagar Professor</a></li>
    </ul>
    <form action="/addprofessor" method="post">
      <label>Siape:</label>
      <input type="text" name="Siape" required><br><br>
      <label>Nome:</label>
      <input type="text" name="Nome" required><br><br>
      <label>Idade:</label>
      <input type="number" name="Idade" required><br><br>
      <label>Matéria:</label>
      <input type="text" name="Materia" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Delete professor form
app.get('/deleteprofessor', (req, res) => {
  res.send(`
    <h1>Apagar Professor</h1>
    <ul>
      <li><a href="/addprofessor">Adicionar Professor</a></li>
      <li><a href="/getprofessor">Listar Professor</a></li>
    </ul>
    <form action="/deleteprofessor" method="post">
      <label>Siape do Professor:</label>
      <input type="text" name="Siape" required><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});

// Insert professor
app.post('/addprofessor', (req, res) => {
  let query = db.query('INSERT INTO professor (Siape, Nome, Idade, Materia) VALUES (?, ?, ?, ?)',
    [req.body.Siape, req.body.Nome, req.body.Idade, req.body.Materia],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/getprofessor');
    });
});

// Delete professor
app.post('/deleteprofessor', (req, res) => {
  let query = db.query('DELETE FROM professor WHERE Siape = ?',
    [req.body.Siape],
    (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/getprofessor');
    });
});

// List professors
app.get('/getprofessor', (req, res) => {
  let sql = 'SELECT * FROM professor';
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(`
      <h1>Lista de Professores</h1>
      <ul>
        <li><a href="/addprofessor">Adicionar Professor</a></li>
        <li><a href="/deleteprofessor">Apagar Professor</a></li>
      </ul>
      <table border="1">
        <tr>
          <th>Siape</th>
          <th>Nome</th>
          <th>Idade</th>
          <th>Matéria</th>
        </tr>
        ${results.map(professor => `<tr><td>${professor.siape}</td><td>${professor.nome}</td><td>${professor.idade}</td><td>${professor.materia}</td></tr>`).join('')}
      </table>
    `);
  });
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
