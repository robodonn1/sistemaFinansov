const express = require('express');
const session = require('express-session');
const path = require('path');
const sequelize = require('./models/index');
const { User } = require('./models/user');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use('/api', require('./routes/operations'));

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/pay', (req, res) => {
    res.render('pay');
})

app.get('/transfer', (req, res) => {
    res.render('transfer');
})

app.get('/deposit', (req, res) => {
    res.render('deposit');
})

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API маршрут не найден' });
    }
    res.redirect('/');
});

async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true });

        const user11 = await User.findOne({ where: { login: 'user1' } });
        const user22 = await User.findOne({ where: { login: 'user2' } });

        if (!user11) {
            const user1 = await User.create({
                login: 'user1',
                password: 'parol',
                // iban: 'RU' + Math.floor(Math.random() * (99 - 10) + 10) + '2281' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '',
                iban: Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + ''
            });

            console.log('First user created: iban: ' + user1.iban);
        }

        if (!user22) {
            const user2 = await User.create({
                login: 'user2',
                password: 'parol',
                // iban: 'RU' + Math.floor(Math.random() * (99 - 10) + 10) + '2281' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '' + Math.floor(Math.random() * (999999 - 100000) + 100000) + '',
                iban: Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + '' + Math.floor(Math.random() * (9999 - 1000) + 1000) + ''
            });

            console.log('Second user created: iban: ' + user2.iban);
        }

        console.log('Database initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
    initializeDatabase();
});