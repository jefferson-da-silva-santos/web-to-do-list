import { BaseQuerys } from "../db/baseQuerys.js";

export class Users {
  constructor(nome, email, password) {
    try {
      this.validateParameter(nome, email, password);
      this._nome = nome;
      this._email = email;
      this._password = password;
      this._columnName = 'users';
    } catch (error) {
      console.log(`Erro: ${error}`);
      throw error;
    }
  }

  get nome() {
    return this._nome;
  }

  get email() {
    return this._email;
  }

  get password() {
    return this._password;
  }

  get columnName() {
    return this._columnName;
  }

  // Função para selecionar todos os usuários
  async selectAllUsers() {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'id');
      const result = await bsQry.selectAll();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para selecionar todos os usuários filtrando colunas
  async selectAllUsersColumns(columns) {
    try {
      const bsQry = new BaseQuerys(this.columnName, columns);
      const result = await bsQry.selectColumns();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para inserir um novo 
  async insertUser() {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'nome, email, password');
      const result = await bsQry.insertValues([
        this.nome,
        this.email,
        this.password,
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para alterar um usuário
  async updateUser(colmns, values, condition) {
    try {
      const bsQry = new BaseQuerys(this.columnName, colmns);
      const result = await bsQry.updateValues(values, condition);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para deletar um usuário
  async deleteUser(condition) {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'id, nome, email');
      const result = await bsQry.deleteValues(condition);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para validar os parâmetros passados para o construtor
  validateParameter(nome, email, password) {
    if (typeof nome !== 'string' || nome.trim() === '') {
      throw new Error('Nome inválido! (Deve ser uma string não vazia).');
    }

    if (typeof email !== 'string' || email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
      throw new Error('Email inválido! (Deve ser uma string não vazia, e no formato adquado @).');
    }

    if (typeof password !== 'string' || password.trim() === '') {
      throw new Error('Senha inválida! (Deve ser uma string não vazia).');
    }
  }
}

/*

// Deletando usuários
try {
  const user = new Users('Jonas', 'jonasui899@gmail.com', '900900');
  const result = await user.deleteUser({ id: 'bc5ef36a-537a-48dd-814a-d177af78c8ba' });
  if (result) {
    console.log('Usuário deletado');
  } else {
    console.log('Erro ao deletar usuário');
  }
} catch (error) {
  console.log(error);
}



// Update users
try {
  const user = new Users('Jonas', 'jonasui899@gmail.com', '900900');
  const result = await user.updateUser('nome, email, password', ['Luizin', 'luizinn@email.com', 'ioiaoioioioa'], {id: 'bc5ef36a-537a-48dd-814a-d177af78c8ba'});
  if (result) {
    console.log('Dados atualizados');
  } else {
    console.log('Erro ao atualizar dados');
  }
} catch (error) {
  console.log(error);
}



//Exemplo de uso da classe User para selecionar todos os usuários
try {
  const user = new Users('Jefin', 'jeffintyy@gmail.com', '7817281828121');
  const result = await user.selectAllUsers();
  console.log(result);
} catch (error) {
  console.log(error); 
}


//Exemplo de uso da classe User para selecionar usuários filtrando colunas
try {
  const user = new Users('Jefin', 'jeffintyy@gmail.com', '7817281828121');
  const result = await user.selectAllUsersColumns('nome, email');
  console.log(result);
} catch (error) {
  console.log(error); 
}


//Exemplo de uso da classe User para inserir um novo usuário
try {
  const user = new Users('Luiz', 'luiz121@gmail.com', 'uidhdjbMaicon');
  const result = await user.insertUser();
  if (!result) {
    console.log('Dados não inseridos');
  } else {
    console.log('Dados inseridos');
  }
} catch (error) {
  console.log(error); 
}


*/