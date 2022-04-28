var express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const ejs = require('ejs');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.listen(8080);
console.log('Server Running');
const path = require('path');
app.use(express.static(__dirname + '/views/public'));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Boudysayed1$',
    database: 'cloasislogin'
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

//^ Do not edit ^


//Copy to create new route (edit /views/test.html) + Change '/' to the name to use in the url 'test'
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/login.html'));
});


app.post('/auth', function(request, response) {
    let aubid = request.body.aubid;
    let password = request.body.password;
    if (aubid && password) {
        connection.query('SELECT * FROM accounts WHERE aubid = ? AND password = ?', [aubid, password], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.aubid = aubid;
                response.redirect('/home');
            } else {
                response.send('Incorrect AUBID and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter AUBID and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
    if (request.session.loggedin) {
        response.render('home');
    } else {
        response.send('Please login to view this page!');
    }
    response.end();
});

app.get('/add_course', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/add_course.html'));
});


app.post('/add_new_course', function(request, response) {

    var COURSENAME = request.body.course_name;
    var COURSEFACULTY = request.body.course_name;
    var COURSECRN = request.body.course_crn;
    var COURSECREDITS = request.body.course_credits;

    connection.connect(function(error) {
        var sql = "INSERT INTO COURSE (COURSENAME, COURSEFACULTY, COURSECRN, COURSECREDITS) VALUES ('" + COURSENAME + "', '" + COURSEFACULTY + "','" + COURSECRN + "','" + COURSECREDITS + "')";
        connection.query(sql, function(error, result) {
            if (error) throw error;
            console.log("New record inserted");
            response.redirect('/add_course');
            response.end();
        });
    });
})

app.get('/add_assignment', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/add_assignment.html'));
});

app.post('/add_new_assignment', function(request, response) {

    var NUMBER = request.body.assignment_number;
    var TYPE = request.body.assignment_type;
    var PERCENTAGE = request.body.assignment_percentage;
    var DUE = request.body.assignment_due;

    connection.connect(function(error) {
        var sql = "INSERT INTO Assignment (Number, Type, Percentage, Due) VALUES ('" + NUMBER + "', '" + TYPE + "','" + PERCENTAGE + "','" + DUE + "')";
        connection.query(sql, function(error, result) {
            if (error) throw error;
            console.log("New record inserted");
            response.redirect('/add_assignment');
            response.end();
        });
    });
})

app.get('/add_student', function(request, response) {
    response.sendFile(path.join(__dirname + '/views/add_student.html'));
});

app.post('/add_new_student', function(request, response) {

    var STUDENTIAN = request.body.student_ian;
    var FIRSTNAME = request.body.first_name;
    var LASTNAME = request.body.last_name;
    var AUBNET = request.body.student_aubnet;
    var AUBID = request.body.student_aubid;

    connection.connect(function(error) {
        var sql = "INSERT INTO STUDENT (IAN, FirstName, LastName, AUBnet, AUBID) VALUES ('" + STUDENTIAN + "', '" + FIRSTNAME + "','" + LASTNAME + "','" + AUBNET + "','" + AUBID + "')";
        connection.query(sql, function(error, result) {
            if (error) throw error;
            console.log("New record inserted");
            response.redirect('/add_student');
            response.end();
        });
    });
})



app.get('/my_courses', function(req, res, next) {
    var sql = 'SELECT * FROM course';
    connection.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.render('my_courses', { title: 'User List', courses: data });
    });
});

app.get('/view_assignments', function(req, res, next) {
    var sql = 'SELECT * FROM ASSIGNMENT';
    connection.query(sql, function(err, data, fields) {
        if (err) throw err;
        res.render('view_assignments', { title: 'User List', asst: data });
    });
});

app.get('/delete_course/:coursecrn', function(req, res, next) {
    var coursecrn = req.params.coursecrn;
    var sql = 'DELETE FROM course WHERE coursecrn = ?';
    connection.query(sql, [coursecrn], function(err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/my_courses');

});

app.get('/delete_assignment/:number', function(req, res, next) {
    var number = req.params.number;
    var sql = 'DELETE FROM ASSIGNMENT WHERE NUMBER = ?';
    connection.query(sql, [number], function(err, data) {
        if (err) throw err;
        console.log(data.affectedRows + " record(s) updated");
    });
    res.redirect('/view_assignments');

});


module.exports = app;