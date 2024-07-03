const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
//require('dotenv').config();

// correr antes de tudo o src/syncModels
//seguido do src/database/logic_objects/insertData


//por a correr 1 vez unica







const emailRoute = require('./routes/emailRoute');
const uploadRoute = require('./routes/uploadRoute');
/*
const error_logRoute = require('./routes/error_logRoute');
const acc_permissionsRoute = require('./routes/acc_permissionsRoute');
const user = require('./routes/userRoute');
const user_actions_logRoute = require('./routes/user_actions_logRoute');

const user_account_detailsRoute = require('./routes/user_account_detailsRoute');
const user_passwords_dictionaryRoute = require('./routes/user_passwords_dictionaryRoute');
const passwd_expiring_notificationsRoute = require('./routes/passwd_expiring_notificationsRoute');
const officesRoute = require('./routes/officesRoute');
const office_adminsRoute = require('./routes/office_adminsRoute');
const office_workersRoute = require('./routes/office_workersRoute');
const areaRoute = require('./routes/areaRoute');
const subareaRoute = require('./routes/sub_areaRoute');
const languageRoute = require('./routes/languageRoute');
const area_contentRoute = require('./routes/area_contentRoute');
const subarea_contentRoute = require('./routes/subarea_contentRoute');
const userprefRoute = require('./routes/userprefRoute');
const postsRoute = require('./routes/postsRoute');
const eventRoute = require('./routes/eventsRoute');
const forumRoute = require('./routes/forumsRoute');
const notificationRoute = require('./routes/notificationsRoute');
const event_forum_accessRoute = require('./routes/event_forum_accessRoute');
const bookmarkRoute = require('./routes/bookmarkRoute');
const default_fieldsRoute = require('./routes/default_fieldsRoute');
const fieldsRoute = require('./routes/fieldsRoute');
const answersRoute = require('./routes/answersRoute');
const participationRoute = require('./routes/participationRoute');
const albumRoute = require('./routes/albumRoute');
const photographsRoute = require('./routes/photographsRoute');
const commentRoute = require('./routes/commentRoute');
const comment_path = require('./routes/comment_pathRoute');
const ratingsRoute = require('./routes/ratingsRoute');
const scoresRoute = require('./routes/scoresRoute');
const reportsRoute = require('./routes/reportsRoute');
const warningsRoute = require('./routes/warningsRoute');
const content_validation_statusRoute = require('./routes/content_validation_statusRoute');
const active_discussionsRoute = require('./routes/active_discussionsRoute');
*/
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





app.set('port', process.env.PORT || 8000);

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



app.use('/upload', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/email', emailRoute);

app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'));
});