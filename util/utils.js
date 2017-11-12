module.exports = {
    removeLvlFromString(s) {
        this.toPascalCase = (stringIn) => {
            return (
                stringIn.replace(/(\w)(\w*)/g, 
                (g0, g1, g2) => {
                    return g1.toUpperCase() + g2.toLowerCase();
                })
            );
        }

        let level = undefined;
        let filtered = this.toPascalCase(s).split(' ').filter((v) => {
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