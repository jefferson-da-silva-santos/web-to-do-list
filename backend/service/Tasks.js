import { BaseQuerys } from "../db/baseQuerys.js";

export class Task {
  constructor(user_id, title, description, due_date) {
    try {
      this.validateParameters(user_id, title, description, due_date);
      this._user_id = user_id;
      this._title = title;
      this._description = description || '';
      this._due_date = new Date(due_date); 
      this._columnName = 'tasks';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  get user_id() {
    return this._user_id;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
  }

  get due_date() {
    return this._due_date;
  }

  get columnName() {
    return this._columnName;
  }

  // Função para selecionar todas as tarefas
  async selectAllTasks() {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'id');
      const result = await bsQry.selectAll();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para selecionar todos as tarefas filtrando colunas
  async selectAllTasksColumns(columns) {
    try {
      const bsQry = new BaseQuerys(this.columnName, columns);
      const result = await bsQry.selectColumns();
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para inserir uma nova terefa 
  async insertTask() {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'user_id, title, description, due_date');
      const result = await bsQry.insertValues([
        this.user_id,
        this.title,
        this.description,
        this.due_date
      ]);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para alterar uma nova tarefa
  async updateTask(colmns, values, condition) {
    try {
      const bsQry = new BaseQuerys(this.columnName, colmns);
      const result = await bsQry.updateValues(values, condition);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Função para deletar uma tarefa
  async deleteTask(condition) {
    try {
      const bsQry = new BaseQuerys(this.columnName, 'id, user_id, title, description, status');
      const result = await bsQry.deleteValues(condition);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Validação dos parâmetros
  validateParameters(user_id, title, description, due_date) {
    // Validações para user_id (UUID)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(user_id)) {
      throw new Error('user_id deve ser um UUID válido');
    }

    // Validações para title
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('title deve ser uma string não vazia');
    }

    // Validações para description (opcional, mas deve ser uma string)
    if (description && typeof description !== 'string') {
      throw new Error('description deve ser uma string');
    }

    // Validações para due_date
    if (isNaN(Date.parse(due_date))) {
      throw new Error('due_date deve ser uma data válida');
    }
  }
}

/*
// Selecionar todas as tarefas
try {
  const task = new Task('e1d0832a-3942-4076-9c69-88073ca77e9f', 'tarefa2', 'descrição da segunda tarefa', '06-12-2014');
  const result = await task.selectAllTasks();
  console.log(result);
} catch (error) {
  console.log(error);
}
*/

/*
// Selecionar todas as tarefas
try {
  const task = new Task('e1d0832a-3942-4076-9c69-88073ca77e9f', 'tarefa2', 'descrição da segunda tarefa', '06-12-2014');
  const result = await task.selectAllTasksColumns('title, description');
  console.log(result);
} catch (error) {
  console.log(error);
}


//Exemplo de uso da classe Task para inserir uma nova tarefa
try {
  const task = new Task('e1d0832a-3942-4076-9c69-88073ca77e9f', 'tarefa2', 'descrição da segunda tarefa', '06-12-2014');
  const result = await task.insertTask();
  if (!result) {
    console.log('Dados não inseridos');
  } else {
    console.log('Dados inseridos');
  }
} catch (error) {
  console.log(error); 
}


// Update tasks
try {
  const task = new Task('e1d0832a-3942-4076-9c69-88073ca77e9f', 'tarefa2', 'descrição da segunda tarefa', '06-12-2014');
  const result = await task.updateTask('title, description', ['Tarefa_02', 'A terfa 2 foi atualizada'], {id: 4});
  if (result) {
    console.log('Dados atualizados');
  } else {
    console.log('Erro ao atualizar dados');
  }
} catch (error) {
  console.log(error);
}


// Deletando usuários
try {
  const task = new Task('e1d0832a-3942-4076-9c69-88073ca77e9f', 'tarefa2', 'descrição da segunda tarefa', '06-12-2014');
  const result = await task.deleteTask({ id: 4 });
  if (result) {
    console.log('Tarefa deletada');
  } else {
    console.log('Erro ao deletar tarefa');
  }
} catch (error) {
  console.log(error);
}
  */