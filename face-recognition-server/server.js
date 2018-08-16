const express =require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',   
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'lwx949596811',
        database: 'myDB'
    }
});
// connect a server to a database;
db.select('*').from('users').then(data => {
    console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
        .where('email','=',req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('unable to get user'));
                } else {
                    res.status(400).json('wrong credentials');
            }
        })
        .catch(err => res.status(400).json('wrong credentials'));
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if(user.length) {
                res.json(user[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
        .catch(err => res.status(400).json('error getting user'));
})

// Updata entries
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
})



/*
// Load hash from your password DB.
bcrypt.compare("bacon", hash, function (err, res) {
    // res == true
});
bcrypt.compare("veggies", hash, function (err, res) {
    // res = false
});
*/

app.listen(3000, () => {
    console.log('app is running on port 3000');
});

/*
/ --> GET = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/

/* Database primary operations
插入： INSERT INTO users(name, age, birthday) VALUES ('Sally', 41, '1930-05-10');
查找: SELECT * FROM users;
条件： SELECT * FROM users ORDER BY score DESC;SELECT * FROM users ORDER BY score ASC;
SQL Function: SELECT SUM(age) FROM users;
Join: SELECT * FROM users JOIN login ON users.name = login.name;
delete: DELETE FROM users WHERE name='Sally';
*/