const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

function getConnection() {
    var content = fs.readFileSync("user.json").toString('utf8');
    var { user, password } = JSON.parse(content);

    return mysql.createConnection({
        host: 'db.cbgo4t4xbjoi.ap-southeast-1.rds.amazonaws.com',
        user: user,
        password: password,
        database: 'db'
    });
}

app.post("/add_review", (req, res) => {
    var id = parseInt(req.body.id);
    var rating = parseInt(req.body.rating);
    const QUERY_STRING = "UPDATE review SET rating_amount = rating_amount + 1, rating_score = rating_score + ?,\
                                            rating_average = rating_score / rating_amount WHERE review_id = ?";

    getConnection().query(QUERY_STRING, [rating, id], (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        // console.log("Query Successed!");
        res.end();
    });
    res.redirect('/table.html');
    res.end();
});

app.get("/get_reviews", (req, res) => {
    const QUERY_STRING = "SELECT review_id, name, rating_amount, rating_score, rating_average \
                            FROM review ";
    getConnection().query(QUERY_STRING, (err, result, field) => {
        if (err) {
            console.log("Query Failed: ", err);
            res.sendStatus(500);
            return;
        }
        res.send(result);
    });
});


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));