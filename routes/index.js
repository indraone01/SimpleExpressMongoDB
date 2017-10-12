var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* GEt HEllo WOrld! */
router.get('/helloworld', (req, res, next) => {
    res.render('helloworld', { title: 'Hello World!' });
});

/* get userlist from usercollection in contactexpress db  */
router.get('/userlist', (req, res, next) => {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({}, {}, (e, docs) => {
        res.render('userlist', { userlist: docs });
    });
});

router.get('/userlist/:txt', (req, res, next) => {
    var searchTxt = req.params.txt;
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({
        $or: [{ username: { $regex: searchTxt } }, { email: { $regex: searchTxt } }]
    }, {}, (e, docs) => {
        res.render('userlist', { userlist: docs });
    });
});

// get new user page
router.get('/newuser', (req, res, next) => {
    res.render('newuser', { title: 'Add New User', hiddenid: '', username: '', useremail: '', action: '/adduser' });
});

router.get('/newuser/:id', (req, res, next) => {
    var hiddenId = req.params.id;
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({ _id: hiddenId }, {}, (e, docs) => {
        res.render('newuser', { title: 'Update User', hiddenid: docs[0]._id, username: docs[0].username, useremail: docs[0].email, action: '/edituser' });
    });
});

// post a new user and landing to userlist page
router.post('/adduser', (req, res, next) => {
    var db = req.db;
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var collection = db.get('usercollection');
    collection.insert({
        "username": userName,
        "email": userEmail
    }, (err, docs) => {
        if (err) {
            res.send('There was a problem adding the information to the database.');
        } else {
            res.redirect('userlist');
        }
    });
});

// post a updated user and landing to userlist page
router.post('/edituser', (req, res, next) => {
    var db = req.db;
    var hiddenId = req.body.hiddenid;
    var userName = req.body.username;
    var userEmail = req.body.useremail;
    var collection = db.get('usercollection');
    collection.update({ _id: hiddenId }, { username: userName, email: userEmail }, (err) => {
        if (err) {
            res.send('There was a problem updating the information to the database.');
        } else {
            res.redirect('userlist');
        }
    });
});

// get deleting action
router.get('/deleteuser/:id', (req, res, next) => {
    var emailidToDelete = req.params.id;
    var db = req.db;
    var collection = db.get('usercollection');
    collection.remove({ _id: emailidToDelete }, (err) => {
        if (err) {
            res.send('There was a problem deleting the information to the database.');
        } else {
            res.render('deleteuser', { id: emailidToDelete });
        }
    });
});

module.exports = router;