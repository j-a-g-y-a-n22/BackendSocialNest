import jwt from 'jsonwebtoken';
const JWT_SECT = process.env.JWT_SECT;

let getuser = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        return res.status(401).send({ error: "Not a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECT)
        req.user = data.user;
        next()

    } catch (error) {
        res.status(401).json({ error: "Not a valid token" })
    }
}

export default getuser;