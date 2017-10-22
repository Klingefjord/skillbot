const addSkill = require('../db/addskill');

module.exports = function(req, res) {
    let msg = req.body.text;
    let userId = req.body.user_id;
    let team_id = req.body.team_id;
    
    addSkill(msg, userId, team_id).then((response) => {
        res.send(response); 
    });
}