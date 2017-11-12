const findUser = require('../db/findUser');

module.exports = function(req, res) {
    let id = req.body.user_id;
    let team_id = req.body.team_id;    
    let response;
    
    if (!id && !team_id) {
        res.send("Not a valid request!");
        return
    }

    findUser(id, team_id).then((userObject) => {
        response = {
            "text": `These are the skills you want to learn, ${userObject.user_name}`,
            "attachments": [
            ]
        }   

        if (userObject.wtl.length > 0) {      
            userObject.wtl.forEach((wtl) => {
                response.attachments.push({
                    "title": `${wtl}`,
                });
            });
        } else {
            response = `You haven't filled in what you're learning, ${userObject.user_name}. Add what you want to learn with /teachme <name of skill>`;
        }

        res.send(response);
    });
}