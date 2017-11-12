const findUser = require('../db/findUser');
const renderColor = require('../util/pickColor');

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
            "text": `These are your current skills, ${userObject.user_name}`,
            "attachments": [
            ]
        }   

        if (userObject.skills.length > 0) {      
            userObject.skills.forEach((skill) => {
                response.attachments.push({
                    "title": `${skill.skill}`,
                    "text":  `Level: ${skill.lvl || "(not specified)"}`,
                    "color": renderColor(skill.lvl),
                });
            });
        } else {
            response = `Seems you don't have any skills yet ${userObject.user_name}. Add one using /addskill <name of skill>`;
        }

        res.send(response);
    });
}