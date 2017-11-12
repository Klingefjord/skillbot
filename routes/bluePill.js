const removeUser = require('../db/removeuser');

module.exports = function(req, res) {
    let id = req.body.user_id;
    let team_id = req.body.team_id;

    if (!id && !team_id) {
        res.send("Not a valid request!");
        return
    }
    
    removeUser(id, team_id).then((response) => {
        console.log(response);
        res.send(response);
    })
}