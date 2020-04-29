const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

function getConnection() {
    var content = fs.readFileSync("user.json").toString("utf8");
    var { user, password } = JSON.parse(content);

    return mysql.createConnection({
        host: "db.cbgo4t4xbjoi.ap-southeast-1.rds.amazonaws.com",
        user: user,
        password: password,
        database: "db",
    });
}

app.post("/add_review", (req, res) => {
    let date_ob = new Date();
    var id = req.body.name;
    var rating = parseInt(req.body.rating);

    const QUERY_STRING1 = "INSERT INTO `childMessage` (name, date, message, rating) VALUES (?, ?, ?, ?)";
    var date =
        date_ob.getFullYear() +
        "-" +
        ("0" + (date_ob.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date_ob.getDate()).slice(-2);
    getConnection().query(QUERY_STRING1, [id, date, "", rating], (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        res.end();
    });

    const QUERY_STRING2 =
        "UPDATE childCareSystem SET rating_amount = rating_amount + 1, \
                          rating_score = rating_score + ?, rating_average = rating_score / rating_amount WHERE name = ?";
    getConnection().query(QUERY_STRING2, [rating, id], (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        res.end();
    });
    res.redirect("/table.html");
    res.end();
});

app.get("/get_reviews", (req, res) => {
    const QUERY_STRING = "SELECT id, name, rating_amount, rating_score, rating_average FROM childCareSystem \
    WHERE city = ?";
    getConnection().query(QUERY_STRING, [req.query.city], (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        res.send(result);
    });
});

app.get("/get_city", (req, res) => {
    const QUERY_STRING =
        "SELECT name, type, address, capacity, rating_amount, rating_average \
         FROM childCareSystem WHERE city = ? ORDER BY rating_average DESC LIMIT 5;";

    getConnection().query(QUERY_STRING, [req.query.city], (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        res.send(result);
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
