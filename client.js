fetch('http://localhost:8888/players')
.then(res => res.json())
.then(json => {

    displayAvailablePlayers(json);

    fetch('http://localhost:8888/teams')
    .then(res => res.json())
    .then(json => {

        displayTeams(json);

        //post to create a new team
        document.getElementById('addTeamForm').addEventListener("submit", handleAddNewTeam);

        //delete event to delete a team
        const arrDelTeamBtns = document.querySelectorAll('.delTeamBtn')
        for(const btn of arrDelTeamBtns)
        {
            btn.addEventListener('click',handleDeleteTeam);
        }

        //select a player event
        const arrSelectBtns = document.querySelectorAll('.selectBtn');
        for(const btn of arrSelectBtns)
        {
            btn.addEventListener('click', handleSelectPlayer);
        }

        //remove a player from team event
        const arrRemoveBtns = document.querySelectorAll('.removeBtn');
        for(const btn of arrRemoveBtns)
        {
            btn.addEventListener('click', handleRemovePlayer);
        }


        fetch('http://localhost:8888/teamslist')
        .then(res => res.json())
        .then(json => {

            displayAvailableTeams(json);

        });


        
    });

});

//FUNCTIONS

function displayAvailablePlayers(json)
{
    const availView = document.getElementById('availablePlayersView');

    const domDiv = document.createElement('div');
    domDiv.setAttribute('id', 'playerTableDiv')

    const domTable = document.createElement('table');
    domTable.setAttribute("id","playersTable");

    for(const player of json)
    {
        let domTR = document.createElement("tr");

        let domTDFirst= document.createElement("td");
        let domTDLast= document.createElement("td");
        let domTDPos= document.createElement("td");
        let domTDBtn= document.createElement("td");

        domTDFirst.innerText = player.FName;
        domTDLast.innerText = player.LName;
        domTDPos.innerText = player.Position;
        domTDBtn.innerHTML = `<button class = 'selectBtn' value = ${player.PlayerID}>+</button>`;

        domTR.appendChild(domTDFirst);
        domTR.appendChild(domTDLast);
        domTR.appendChild(domTDPos);
        domTR.appendChild(domTDBtn);

        domTable.appendChild(domTR);
        
    }
    domDiv.appendChild(domTable);
    availView.appendChild(domDiv);
}

function displayTeams(json)
{
    const teamsView = document.getElementById('teamsView');

    for(const team of json[0])
    {
        let div = document.createElement('div');
        div.setAttribute("id", "teamDiv")
        div.innerHTML = `<div id = "team-header-wrapper"><label>Team ${team.TeamID}: ${team.Name}</label><button class ="delTeamBtn" value = ${team.TeamID}>X</button></div>`;
        let domTable = document.createElement('table');
        domTable.setAttribute("id", "teamsTable");
        for(const player of json[1])
        {
            if(player.TeamID == team.TeamID)
            {
                let domTR = document.createElement('tr');

                let domTDFirst= document.createElement("td");
                let domTDLast= document.createElement("td");
                let domTDPos= document.createElement("td");
                let domTDBtn= document.createElement("td");

                domTDFirst.innerText = player.FName;
                domTDLast.innerText = player.LName;
                domTDPos.innerText = player.Position;
                domTDBtn.innerHTML = `<button class = 'removeBtn' value = ${player.PlayerID}>X</button>`;

                domTR.appendChild(domTDFirst);
                domTR.appendChild(domTDLast);
                domTR.appendChild(domTDPos);
                domTR.appendChild(domTDBtn);

                domTable.appendChild(domTR);
            }
        }
        div.appendChild(domTable);
        teamsView.appendChild(div);
        
    }
}

function displayAvailableTeams(json)
{
    const pulldown = document.getElementById('teamID');
    pulldown.innerHTML = "";

    for(const team of json)
    {
        pulldown.innerHTML += `<option value = ${team.TeamID}>${team.TeamID}</option>`;
    }
}

function handleAddNewTeam(event)
{
    event.preventDefault();
    const fd = new FormData(document.getElementById('addTeamForm'));

    fetch('http://localhost:8888/teams',
    {
        method: 'POST',
        body: fd
    });
}

function handleDeleteTeam(event)
{
    const teamID = event.target.value;
    //do a put to remove teamID from players on team
    fetch('http://localhost:8888/playersteams/' + teamID,
    {
        method: 'PUT'
    })
    .then(() => {
        //Delete the team from DB
        fetch('http://localhost:8888/teams/' + teamID,
        {
            method: 'DELETE'
        })
        .then(res => res.text())
        .then(res => console.log(res));
    });
}

function handleSelectPlayer(event)
{
    const playerid = event.target.value;
    const teamid = parseInt(document.getElementById('teamID').value);

    fetch('http://localhost:8888/players/' + playerid + '/' + teamid,
    {
        method: 'PUT'
    });
}

function handleRemovePlayer(event)
{
    console.log("inside remove player");
    const playerid = event.target.value;
    console.log(playerid);

    fetch('http://localhost:8888/players/' + playerid,
    {
        method: 'PUT'
    })
}