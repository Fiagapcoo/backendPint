const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const app = express();
//require('dotenv').config();

// correr antes de tudo o src/syncModels
//seguido do src/database/logic_objects/insertData


//por a correr 1 vez unica







const emailRoute = require('./routes/emailRoute');
const uploadRoute = require('./routes/uploadRoute');

const categoryRoutes = require('./routes/static_contentController');
const forumRoutes = require('./routes/forumRoutes');
const postRoutes = require('./routes/postRoutes');
const eventRoutes = require('./routes/eventRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const formsRoutes = require('./routes/formsRoutes');
const commentsRoutes = require('./routes/commentsRoutes');
const userRoutes = require('./routes/userRoutes');
const dynamicRoutes = require('./routes/dynamic_contentRoutes');
const notificationsRoutes = require('./routes/notificationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');




app.set('port', process.env.PORT || 8000);
app.use(logger('dev'));

app.use(cors()); 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
         

//API
app.use('/api/categories', categoryRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/post', postRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/administration', adminRoutes);
app.use('/api/form', formsRoutes);
app.use('/api/comment', commentsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dynamic', dynamicRoutes);
app.use('/api/notification', notificationsRoutes);authRoutes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/upload', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/email', emailRoute);


app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'));
    //console.log(process.env.ENCRYPTION_KEY);
});