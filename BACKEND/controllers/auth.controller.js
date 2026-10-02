import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../configuration/token.js";
export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, userName } = req.body;

    if (!firstName || !lastName || !email || !password || !userName) {
      return res.status(400).json({ message: "send all details" });
    }

    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    let token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      user: {
        firstName,
        lastName,
        userName,
        email,
      },
    });
  } catch (error) {
    console.error("signUp error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    let match = await bcrypt.compare(password, existUser.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

     let token = generateToken(existUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({message:"User loggedIn successfully",
    User: {
        firstName: existUser.firstName,
        lastName: existUser.lastName,
        userName: existUser.userName,
        email: existUser.email
    }
    })

  } catch (error) {
    console.error("LogIn error:",error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const logOut=async (req,res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message:"Logout successfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server Error"})
    }
}