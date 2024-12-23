import { Users } from "../service/Users.js";

export const selectAllUsers = async (req, res, next) => {
  try {
    const user = new Users('User', 'useruser@gmail.com', 'testtest90');
    const result = await user.selectAllUsers();

    if (!result) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    next();
  }
}

