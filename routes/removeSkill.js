const removeSkillFromDb = require('../db/removeskill');

module.exports = function removeSkill (req, res) {
    let msg = req.body.text;
    let id = req.body.user_id;
    let team_id = req.body.team_id;

    removeSkillFromDb(id, msg, team_id);
    res.send("Skill removed from your profile!");
}