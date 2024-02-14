const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const knex = require('knex');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json('up and running');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    db.select('email' , 'hash').from('login')
    .where('email','=',email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
            return db.select('id').from('users')
            .where('email', '=', email)
            .then(user => {
                res.header("Access-Control-Allow-Origin", "*");
                res.json(user[0]);
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
    const { name, lname, email, password, work_place, charge, phone } = req.body;
    const hash = bcrypt.hashSync(password, 18);
    const timestamp = new Date();

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
                email: loginEmail[0].email,
                name: name,
                lastname: lname,
                work_place: work_place,
                phone: phone,
                charge: charge,
                created_at: timestamp,
                updated_at: timestamp   
            })
            .then(user => {
                res.json({
                    user: user[0],
                    message: "Successfully registered"
                });
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json(err))
})

app.get('/getTotalCurrency/:id', (req, res) => {
    const { id } = req.params;

    if(isNaN(id)) {
        return res.status(400).json('not a user')
    } else {
        db.select('currency').from('users')
        .where("id", "=", id)
        .then(currency => {
            if(user.length) {
                res.json(currency);
            } else {
                res.status(400).json('user not found');
            }
        })
    }
})

app.get('/getUserData/:id', (req, res) => {
    const { id } = req.params;

    if(isNaN(id)) {
        return res.status(400).json('not a user')
    } else {
        db.select('*').from('users')
        .where("id", "=", id)
        .then(user => {
            res.json({
                name: user[0].name + ' ' + user[0].lastname,
                work_place: user[0].work_place,
                charge: user[0].charge,
                phone: user[0].phone,
                balance: user[0].balance
            });
        })
    }
})

app.post('/updateBalance', (req, res) => {
    const { user_id, currency } = req.body;
    const timestamp = new Date();

    if(user_id == NaN) {
        return res.status(200).json('Not a user')
    } else 
    {
        db.select('balance').from('users')
        .where("id","=",user_id)
        .then(balance => {
            new_balance = parseInt(currency) + parseInt(balance[0].balance);
            return new_balance;
        })
        .then(new_balance => {
            db('users')
            .where('id','=',user_id)
            .update({
                balance: new_balance,
                updated_at: timestamp   
            })
            .then(updated_user => {
                res.json({
                    message: 'Balance updated successfully',
                })
            }
            )
        })
        .catch(err => res.status(500).json('error updating balance ' + err))

    }
})

app.post('/answerQuiz', (req, res) => {
    const { user_id, currency } = req.body;
    const timestamp = new Date();

    if(user_id == NaN) {
        return res.status(200).json('Not a user')
    } else 
    {
        db.select('balance').from('users')
        .where("id","=",user_id)
        .then(balance => {
            new_balance = parseInt(currency) + parseInt(balance[0].balance);
            return new_balance;
        })
        .then(new_balance => {
            db('users')
            .where('id','=',user_id)
            .update({
                balance: new_balance,
                quiz_try: false,
                updated_at: timestamp   
            })
            .then(updated_user => {
                res.json({
                    message: 'Balance and try updated successfully',
                })
            }
            )
        })
        .catch(err => res.status(500).json('error updating balance ' + err))

    }
})


app.get('/getUsersInfo', (req, res) => {
    db.select('name','lastname','balance','email','id','quiz_try', 'work_place','charge','phone')
    .from('users')
    .then(users => {
        return res.json(users);
    });
})

app.get('/getUsersQuizTry/:user_id', (req, res) => {
    const { user_id } = req.params;

    if(isNaN(user_id)) {
        return res.status(400).json('not a user')
    } else {
        db.select('*')
        .from('users')
        .where('id','=',user_id)
        .then(user => {
            if(user.length){
                return res.json({
                    quiz_try: user[0].quiz_try
                });
            } else {
                return res.status(400).json('usuario no encontrado')
            }
        });

    }
})


app.get('/', (req, res) => {
    res.json('it liveeeees')
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`server running on port ${process.env.PORT}`);
})

