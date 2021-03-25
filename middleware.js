const ensureLoggedIn = (req,res,next) => {
    if (req.signedCookies.user_id) {
        res.json(req.signedCookies.user_id)
    } else {
        res.status(401)
        next(new Error('Un-Authorized'))
    }
}

module.exports = {
    ensureLoggedIn
}