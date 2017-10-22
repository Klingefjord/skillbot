const Promise = require('bluebird');
const listKnowers = require('../db/listKnowers');
const findUserProfile = require('../user');
const renderColor = require('../util/pickColor');

// apparently, it does not work with more parameters than req, res & next :/

module.exports = function(req, res) {
    let skill = req.body.text;
    let team_id = req.body.team_id;    

    listKnowers(skill, team_id).then(({doc, filtered}) => {

        let response = {
            "text": `These are the people who know ${filtered}`,
            "attachments": [
            ]
        }
        console.log(doc, filtered);
        if (doc.length > 0) {
            let quene = [];
            doc.forEach(user => {
                quene.push(new Promise((resolve, reject) => {
                        resolve(findUserProfile(user));
                }));
            });

            Promise.each(quene, (user) => {

                let dbUser = doc.find(u => {
                    console.log(u);
                    return u.user_name === user.display_name;
                });

                try {
                    let skill = dbUser.skills.find(s => {
                        return s.skill === filtered;
                    });
    
                    response.attachments.push({
                        "title": `${dbUser.user_name}`,
                        "text":  `Level: ${skill.lvl || "(not specified)"}`,
                        "color": renderColor(skill.lvl),
                        "image_url": user.image_48 || ""
                    });
                } catch (err) {
                    console.log(err);
                    response = `Currently no people in this team know ${filtered}`;
                }
            }).then(() => {
                res.send(response);
            });
        } else {
            response = `Currently no people in this team know ${filtered}`;
            res.send(response);
        }
    });
}
