const changeLevelInDb = require('../db/changelevel');

module.exports = function(req, res) {
    let response = "Skill updated!";
    let msg = req.body.text;
    let id = req.body.user_id;
    let team_id = req.body.team_id;   
    
    if (!msg && !id && !team_id) {
        res.send("Not a valid request!");
        return
    }

    changeLevelInDb(id, msg, team_id).then((success) => {
        if (!success) response = "You don't seem to have that skill at the moment!";
        res.send(response);
    });
}