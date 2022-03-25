const express = require("express");
const Database = require("better-sqlite3");
const cors = require('cors');
const multer = require("multer");

const app = express();
app.options('*',cors());
upload = multer();

const db = new Database('fantasyDraft.db');


//READ
//to display all players
app.get('/players', (req,res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "SELECT * FROM availablePlayers WHERE TeamID IS NULL ORDER BY PlayerID";
    const statement = db.prepare(sql);

    const arrOutput = [];

    for(const player of statement.iterate())
    {
        arrOutput.push(player);
    }

    res.end(JSON.stringify(arrOutput));

});
//to display teams with selected players
app.get('/teams', (req,res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql1 = "SELECT * FROM availablePlayers WHERE TeamID IS NOT NULL";
    const sql2 = "SELECT * FROM Teams ORDER BY TeamID";
    const statement1 = db.prepare(sql1);
    const statement2 = db.prepare(sql2);

    const arrPlayers = [];
    const arrTeams = [];
    const arrOutput = [];

    for(const player of statement1.iterate())
    {
        arrPlayers.push(player);
    }
    for(const team of statement2.iterate())
    {
        arrTeams.push(team);
    }

    arrOutput.push(arrTeams);
    arrOutput.push(arrPlayers);

    res.end(JSON.stringify(arrOutput));
});
//to display teams in a dropdown list of options
app.get('/teamslist', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "SELECT TeamID FROM Teams ORDER BY TeamID";
    const statement = db.prepare(sql);

    const arrOutput = [];
    for(const team of statement.iterate())
    {
        arrOutput.push(team);
    }

    res.end(JSON.stringify(arrOutput));
})

//CREATE
app.post('/teams', upload.none(), (req,res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "INSERT INTO Teams(Name) VALUES (?)";
    const statement = db.prepare(sql);
    statement.run([req.body.teamName]);
    res.end();

});

//PUT
//to update players teamID when team is deleted
app.put('/playersteams/:teamid', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "UPDATE availablePlayers SET TeamID = ? WHERE TeamID = ?"
    const statement = db.prepare(sql);
    statement.run([null,req.params.teamid]);
    res.end();
});
//to update players teamID when player is removed from team
app.put('/players/:playerid', (req,res) => {
    console.log("im alive");
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "UPDATE availablePlayers SET TeamID = ? WHERE PlayerId = ?"
    const statement = db.prepare(sql);
    let result = statement.run([null, req.params.playerid]);
    console.dir(result);
    res.end();
});
//to update players teamID when player is selected to a team
app.put('/players/:playerid/:teamid', (req,res) => {
    res.setHeader("Access-Control-Allow-Origin",'*');
    const sql = "UPDATE availablePlayers SET TeamID = ? WHERE PlayerId = ?"
    const statement = db.prepare(sql);
    statement.run([req.params.teamid, req.params.playerid]);
    res.end();
});

//DELETE
app.delete('/teams/:teamid', (req,res) => {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    const sql = "DELETE FROM Teams WHERE TeamID =?";
    const statement = db.prepare(sql);
    statement.run([req.params.teamid]);
    console.log('delete', req.params.teamid);
    res.end()
});

app.listen(8888);