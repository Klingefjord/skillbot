function addSkill(user, text) {
    function toPascalCase(s) {
        return (
            s.replace(/(\w)(\w*)/g, 
            function(g0,g1,g2) {return g1.toUpperCase() + g2.toLowerCase();})
        );
    }
    console.log(text);
    // check if user is in dabase
        // if not, create entry
    
    // make subarray out of input
    let pascalArr = toPascalCase(text).split(' ');

    // seperate number from array
    let level = undefined;
    let filtered = pascalArr.filter((v) => {
        if (!isNaN(v)) {
            level = v;
            return false;
        }
        // remove level or Level from array if it is there
        if (v.match(/(Lvl|Level)/)) {
            return false;
        }
        return true;
    });
}

module.exports = addSkill;