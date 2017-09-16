function addSkill(user, text) {
    function toPascalCase(s) {
        return (
            s.replace(/(\w)(\w*)/g, 
            function(g0,g1,g2) {
                return g1.toUpperCase() + g2.toLowerCase();
            })
        );
    }

    // make subarray out of input
    let pascalArr = toPascalCase(text).split(' ');
    let level = undefined;

    let filtered = pascalArr.filter((v) => {
        // remove number and store in level
        if (!isNaN(v)) {
            level = v;
            return false;
        }
        // remove 'level' or 'lvl' from array if it is there
        if (v.match(/(Lvl|Level)/g)) {
            return false;
        }
        return true;
    });

    //insert into db
    
}

module.exports = addSkill;