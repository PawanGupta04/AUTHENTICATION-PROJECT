import jwt from "jsonwebtoken"

const generateToken= (id) => {
    let token=jwt.sign({id: id.toString()},process.env.JWT_SECRET,{expiresIn:"7d"})
    return token;
}
export default generateToken
