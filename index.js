const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const favicon = require("express-favicon");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(__dirname + "/public/image/favicon.ico"));

var content = fs.readFileSync("user.json").toString("utf8");
var { user, password } = JSON.parse(content);
const pool = mysql.createPool({
    host: "db.cbgo4t4xbjoi.ap-southeast-1.rds.amazonaws.com",
    user: user,
    password: password,
    database: "db",
});

app.post("/add_review", (req, res) => {
    var date_ob = new Date();
    var id = req.body.name;
    var city = req.body.city;
    var district = req.body.district;
    var rating = parseInt(req.body.rating);
    var date =
        date_ob.getFullYear() +
        "-" +
        ("0" + (date_ob.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date_ob.getDate()).slice(-2);

    const QUERY_STRING1 = `INSERT INTO \`childMessage\` (name, date, message, rating) VALUES ("${id}", "${date}", "", ${rating})`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING1, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            connection.release();
        });
    });

    const QUERY_STRING2 = `UPDATE childCareSystem SET rating_amount = rating_amount + 1, \
                          rating_score = rating_score + ${rating}, rating_average = rating_score / rating_amount WHERE name = "${id}"`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING2, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            connection.release();
        });
    });
    res.redirect("/table.html?city=" + city + "&district=" + district);
    res.end();
});

app.get("/get_reviews", (req, res) => {
    const QUERY_STRING = `SELECT id, name, rating_amount, rating_score, rating_average FROM childCareSystem \
    WHERE city = "${req.query.city}"`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            res.send(result);
            connection.release();
        });
    });
});

app.get("/get_city", (req, res) => {
    const QUERY_STRING = `SELECT name, type, address, rating_average \
         FROM childCareSystem WHERE city = "${req.query.city}" ORDER BY rating_average DESC LIMIT 5;`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            res.send(result);
            connection.release();
        });
    });
});

app.get("/get_district", (req, res) => {
    const QUERY_STRING = `SELECT name, type, address, evaluation_result, rating_average, google_rating \
         FROM childCareSystem WHERE city = "${req.query.city}" AND district = "${req.query.district}" ORDER BY rating_average DESC LIMIT ${req.query.limit};`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            res.send(result);
            connection.release();
        });
    });
});

app.get("/elderly_district", (req, res) => {
    const QUERY_STRING = `SELECT name, type, address, evaluation_result, rating_average, google_rating \
         FROM elderlyCareSystem WHERE city = "${req.query.city}" AND district = "${req.query.district}" ORDER BY rating_average DESC LIMIT ${req.query.limit};`;
    pool.getConnection(function (err, connection) {
        connection.query(QUERY_STRING, function (error, result, fields) {
            if (error) {
                console.log("Query Failed: ", error);
                res.sendStatus(500);
                return;
            }
            res.send(result);
            connection.release();
        });
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
