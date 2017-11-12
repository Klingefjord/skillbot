const addSkill = require('../db/addskill');

module.exports = function(req, res) {
    let msg = req.body.text;
    let userId = req.body.user_id;
    let team_id = req.body.team_id;
    
    if (!msg && !userId && !team_id) {
        res.send("Not a valid request!");
        return
    }

    addSkill(msg, userId, team_id).then((response) => {
        res.send(response); 
    });
}