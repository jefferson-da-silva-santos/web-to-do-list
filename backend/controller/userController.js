import { Users } from "../service/Users.js";
import { schemaColumns, schemaUser } from "../utils/validate.js";

export const selectAllUsers = async (req, res, next) => {
  try {
    const user = new Users('User', 'useruser@gmail.com', 'testtest90');
    const result = await user.selectAllUsers();
    if (!result) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(result);
  } catch (error) {
    next();
  }
}


export const selectAllColumnsUsers = async (req, res, next) => {
  try {
    const { error, value } = schemaColumns.validate(req.params.columns);
    if (error) {
      return res.status(400).json({ message: "Invalid columns" });
    }
    const user = new Users('User', 'useruser@gmail.com', 'testtest90');
    const result = await user.selectAllUsersColumns(value);
    if (!result) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(result);
  } catch (error) {
    next();
  }
}


export const insertUser = async (req, res, next) => {
  try {
    console.log('requesição recebida para inseriri usuário');
    const { error, value } = schemaUser.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ message: `Usuário inválido: ${error.message}` });
    }
    console.log('Passou na validação');

    const user = new Users(value.nome, value.email, value.password);
    const searchUser = await user.selectUserCondition({ email: value.email }, 1);

    if (searchUser[0]) {
      return res.status(400).json({ message: "O usuário já existe" });
    }
    const result = await user.insertUser();
    if (!result) {
      return res.status(404).json({ message: "O usuário já existe" });
    }
    res.status(200).json({ message: "Usuário inserido com sucesso!" });
  } catch (error) {
    next();
  }
}


// Função para gerar o hash da senha (criptografia)
