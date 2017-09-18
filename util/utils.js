module.exports = {
    toPascalCase(s) {
        return (
            s.replace(/(\w)(\w*)/g, 
            (g0,g1,g2) => {
                return g1.toUpperCase() + g2.toLowerCase();
            })
        );
    },

    removeLvlFromString(s) {
        let level = undefined;
        
        let filtered = s.filter((v) => {
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
        }).join(' '); 

        return { filtered, level };
    } 


}