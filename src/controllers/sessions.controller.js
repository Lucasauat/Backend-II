import { UserDTO } from "../dto/currentUser.js";

export const currentSession = (req, res) => {
  const userDTO = new UserDTO(req.user);
  res.json(userDTO);
};
