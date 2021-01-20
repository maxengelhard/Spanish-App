const words = (lang) => {
    const dir = `./frequentWords/2016/${lang}/${lang}_50k`
    return require(dir)
}

module.exports = words