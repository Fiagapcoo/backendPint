const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
require('dotenv').config();


const error_logRoute = require('./routes/error_logRoute');
const acc_permissionsRoute = require('./routes/acc_permissionsRoute');
const user = require('./routes/userRoute');
const user_actions_logRoute = require('./routes/user_actions_logRoute');
const uploadRoute = require('./routes/uploadRoute');
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


const emailRoute = require('./routes/emailRoute');

app.set('port', process.env.PORT || 8000);

app.use(cors()); 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/error_log', error_logRoute);
app.use('/acc_permissions', acc_permissionsRoute);
app.use('/user', user);
app.use('/user_actions_log', user_actions_logRoute);
app.use('/user_account_details', user_account_detailsRoute);
app.use('/user_passwords_dictionary', user_passwords_dictionaryRoute);
app.use('/passwd_expiring_notifications', passwd_expiring_notificationsRoute);
app.use('/offices', officesRoute);
app.use('/office_admins', office_adminsRoute);
app.use('/office_workers', office_workersRoute);
app.use('/area', areaRoute);
app.use('/sub_area', subareaRoute);
app.use('/language', languageRoute);
app.use('/area_content', area_contentRoute);
app.use('/subarea_content', subarea_contentRoute);
app.use('/userpref', userprefRoute);
app.use('/posts', postsRoute);
app.use('/events', eventRoute);
app.use('/forums', forumRoute);
app.use('/notifications', notificationRoute);
app.use('/event_forum_access', event_forum_accessRoute);
app.use('/bookmarks', bookmarkRoute);
app.use('/default_fields', default_fieldsRoute);
app.use('/fields', fieldsRoute);
app.use('/answers', answersRoute);
app.use('/participation', participationRoute);
app.use('/albums', albumRoute);
app.use('/photographs', photographsRoute);
app.use('/comments', commentRoute);
app.use('/comment_path', comment_path);
app.use('/ratings', ratingsRoute);
app.use('/scores', scoresRoute);
app.use('/reports', reportsRoute);
app.use('/warnings', warningsRoute);
app.use('/content_validation_status', content_validation_statusRoute);
app.use('/active_discussions', active_discussionsRoute);






app.use('/upload', uploadRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/email', emailRoute);

app.listen(app.get('port'), () => {
    console.log("Server started on port " + app.get('port'));
});