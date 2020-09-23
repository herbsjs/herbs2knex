module.exports = class Utils {
    static isObject (obj) {
        obj !== null && typeof obj === "object"
    } 
    static isObjEmpty (obj) {
        this.isObject(obj) && Object.keys(obj).length === 0
    }
}