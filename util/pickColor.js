module.exports = function(skillLvl) {
    switch(Number(skillLvl)) {
        case 1:
        case 2:
            return "#2BFF00"; // green;
            break;
        case 3:
        case 4:
            return "#FFE500"; // yellow;
            break;
        case 5:
        case 6:
            return "#006DFF"; // blue;
            break;
        case 7:
        case 8:
            return "#FF2C00"; // red;
            break;
        case 9:
        case 10:
            return "#000000"; // black;
            break;
        default:
            return "#999999"; // grey
            break;
    }
};