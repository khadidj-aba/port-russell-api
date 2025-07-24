const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');

// Chargement des variables d'environnement
dotenv.config();

const app = express(); // Initialisation de l'application

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/port-russell', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// ✅ Middlewares globaux
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(methodOverride('_method')); // ✅ 

// ✅ Middleware session
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/port-russell'
  })
}));

// ✅ Variables globales
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ✅ Routes
const authRoutes = require('./routes/authRoutes');
const catwaysRoutes = require('./routes/catways');
const reservationsRoutes = require('./routes/reservations');
const usersRoutes = require('./routes/users');

app.use(authRoutes);
app.use('/catways', catwaysRoutes);
app.use('/reservations', reservationsRoutes);
app.use('/users', usersRoutes); // ✅ placée APRÈS les sessions
app.use(express.static('public'));

// ✅ Redirection par défaut
app.get('/', (req, res) => {
  res.redirect('/login');
});

// ✅ Dashboard (protégé normalement par un middleware dans authRoutes)
app.get('/dashboard', (req, res) => {
  res.send('<h1>Bienvenue sur votre tableau de bord</h1>');
});

// ✅ Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur en écoute sur le port ${PORT}`);
});

const homeRoutes = require('./routes/home');
app.use(homeRoutes);

const docsRoutes = require('./routes/docs');
app.use(docsRoutes);
