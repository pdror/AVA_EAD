module.exports = {
    slugify: (v) => {
        return (v || '').replace(/\s+/g, '')
    },

    idify: (v) => {
        return 'mycustomid_' + v
    }
}