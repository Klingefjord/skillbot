const addWtl = require('../db/addWtl');
const checkForMatch = require('../db/checkForMatch');
const setupMatch = require('../setupMatch');
const knowsRoute = require('./knows');

module.exports = function(req, res) {
    let msg = req.body.text;
    let userId = req.body.user_id;
    let team_id = req.body.team_id;    

    if (!msg && !userId && !team_id) {
        res.send("Not a valid request!");
        return
    }

    addWtl(msg, userId, team_id).then(({ tempUser, filtered }) => {
        // check if someone knows wtl
        knowsRoute({ body: { text: filtered } }, res);

        // check if there is a match with wtl
        checkForMatch(tempUser, filtered, team_id).then(({matches, count}) => {
            for (var i = 0; i < matches.length; i++) {
                setupMatch(matches[i], tempUser, count, team_id);
            }
        }); 
    });
}