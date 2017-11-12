const removeUser = require('../db/removeuser');

module.exports = function(req, res) {
    let id = req.body.user_id;
    let team_id = req.body.team_id;
    
    removeUser(id, team_id).then((response) => {
        console.log(response);
        res.send(response);
    })
}