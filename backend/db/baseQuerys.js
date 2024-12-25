import pool from "./db.js";

export class BaseQuerys {
  constructor(table, columns) {
    try {
      this.validateParameter(table, columns);
      this._table = table;
      this._columns = columns;
    } catch (error) {
      console.error(`Erro: ${error.message}`);
      throw error;
    }
  }

  // GET da propriedade table
  get table() {
    return this._table;
  }

  // GET da propriedade columns
  get columns() {
    return this._columns;
  }

  // Função que seleciona todos os dados de uma determinada tabela
  async selectAll() {
    try {
      const queryText = `SELECT * FROM ${this.table}`;
      const result = await pool.query(queryText);
      return result.rows.length > 0 ? result.rows : [];
    } catch (error) {
      throw new Error(`Erro ao buscar todos os dados: ${error.message}`);
    }
  }

  // Função que seleciona todos os dados de uma determinada tabela porém filtrando por coluna
  async selectColumns() {
    try {
      const queryText = `SELECT ${this.columns} FROM ${this.table}`;
      const result = await pool.query(queryText);
      return result.rows.length > 0 ? result.rows : [];
    } catch (error) {
      throw new Error(`Erro ao buscar colunas específicas: ${error.message}`);
    }
  }

  // Função que seleciona os dados com uma condição
  async selectByValue(condition) {
    try {
      const conditionKeys = Object.keys(condition);
      const conditionPlaceholders = conditionKeys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');

      const queryValues = Object.values(condition);

      const queryText = `SELECT ${this.columns} FROM ${this.table} WHERE ${conditionPlaceholders} LIMIT 1`;

      const result = await pool.query(queryText, queryValues);
      return result.rows.length > 0 ? result.rows : [];
    } catch (error) {
      throw new Error(`Erro ao buscar item específico: ${error.message}`);
    }
  }

  // Função que faz a inserção de dados em uma determinada tabela
  async insertValues(values) {
    const client = await pool.connect();
    try {
      const columnsArray = this._columns.split(/\s*,\s*/);
      const placeholders = columnsArray.map((_, index) => `$${index + 1}`).join(', ');
      const queryText = `INSERT INTO ${this.table} (${this.columns}) VALUES (${placeholders}) RETURNING *`; // Use RETURNING para obter os dados inseridos

      await client.query('BEGIN');
      const result = await client.query(queryText, values);
      await client.query('COMMIT');
      return result.rowCount; // Retorna o número de linhas inseridas
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Erro ao inserir valores: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Função para alterar valores de uma tabela
  /*
  Uso:
  const baseQuery = new BaseQuerys('users', 'nome, email');
  
  const rowsUpdated = await baseQuery.updateValues(
    ['João Silva', 'joao@email.com'], // Valores para nome e email
    { id: 1, status: 'active' }       // Condições para o WHERE
  );

  console.log(`${rowsUpdated} linha(s) atualizada(s)`);
  // Saída: 1 linha(s) atualizada(s)
  */
  async updateValues(values, condition) {
    const client = await pool.connect();
    try {
      // Divide as colunas e tranforma em array
      const columnsArray = this._columns.split(/\s*,\s*/);
      //Associando cada coluna a um placeholder: ($1, $2) para o SET
      // Resultado final: "nome = $1, email = $2"
      const setPlaceholders = columnsArray.map((col, index) => `${col} = $${index + 1}`).join(', ');

      // Adiciona os placeholders para a condição
      //Obtém as chaves do objeto condition, como ["id", "status"]:
      const conditionKeys = Object.keys(condition);
      const conditionPlaceholders = conditionKeys
        .map((key, index) => `${key} = $${columnsArray.length + index + 1}`)
        .join(' AND ');

      // Prepara a query
      const queryText = `UPDATE ${this.table} SET ${setPlaceholders} WHERE ${conditionPlaceholders}`;

      // Combina os valores do SET e da condição
      const queryValues = [...values, ...Object.values(condition)];

      await client.query('BEGIN');
      const result = await client.query(queryText, queryValues);
      await client.query('COMMIT');

      return result.rowCount; // Retorna o número de linhas atualizadas
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Erro ao atualizar valores: ${error.message}`);
    } finally {
      client.release();
    }
  }

  // Deletar dados
  /*
  const baseQuery = new BaseQuerys('users', 'id, nome, email');
  const rowsDeleted = await baseQuery.deleteValues({ id: 3, status: 'inactive' });
  console.log(`${rowsDeleted} linha(s) deletada(s)`);
  // Saída: 1 linha(s) deletada(s)
 */
  async deleteValues(condition) {
    const client = await pool.connect();
    try {
      // Adiciona os placeholders para a condição
      const conditionKeys = Object.keys(condition);
      const conditionPlaceholders = conditionKeys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(' AND ');

      // Prepara a query
      const queryText = `DELETE FROM ${this.table} WHERE ${conditionPlaceholders}`;

      // Valores do WHERE
      const queryValues = Object.values(condition);

      // Executa a transação
      await client.query('BEGIN');
      const result = await client.query(queryText, queryValues);
      await client.query('COMMIT');

      return result.rowCount; // Retorna o número de linhas deletadas
    } catch (error) {
      await client.query('ROLLBACK'); // Reverte a transação em caso de erro
      throw new Error(`Erro ao deletar valores: ${error.message}`);
    } finally {
      client.release(); // Libera a conexão
    }
  }


  // Função que faz a validação dos parâmetros passados para o construtor
  validateParameter(table, columns) {
    if (typeof table !== "string" || (table !== "users" && table !== "tasks")) {
      throw new Error("As tabelas passadas por parâmetro são inválidas");
    }

    if (typeof columns !== "string") {
      throw new Error(
        "As colunas devem ser passadas como uma string no formato: column1, column2, column3,..."
      );
    }

    const columnsValid = [
      "id",
      "user_id",
      "nome",
      "email",
      "password",
      "created_at",
      "updated_at",
      "title",
      "description",
      "status",
      "due_date",
    ];
    const arrColumns = columns.split(/\s*,\s*/);

    const isValid = arrColumns.every((column) =>
      columnsValid.includes(column)
    );
    if (!isValid) {
      throw new Error("As colunas passadas são inválidas");
    }
  }

}

/*

// Selecionar items especificos
try {
  const base = new BaseQuerys("users", "id, nome, email");
  const result1 = await base.selectByValue({ nome: "Jefferson" });
  const result2 = await base.selectByValue({ id: "e1d0832a-3942-4076-9c69-88073ca77e9f" }, 1);
  console.log(result1);
  console.log(result2);
} catch (error) {
  console.log(error);
}

Selecionar tudo:
try {
  const bse = new BaseQuerys('users', 'id');
  const result = await bse.selectAll();
  console.log(result);
} catch (error) {
  console.error(error);
}
*/

/*
Selecionar tudo filtrando colunas:
try {
  const bse = new BaseQuerys('users', 'id, nome, email');
  const result = await bse.selectColumns();
  console.log(result);
} catch (error) {
  console.error(error);
}
*/


// try {
//   const bse = new BaseQuerys('users', 'nome, email, password');
//   const result = await bse.insertValues([
//     'Túlio Mota',
//     'tuliomotaa90@gmail.com',
//     '900000056'
//   ]);
//   if (!result) {
//     console.log('Dados não inseridos');
//   } else {
//     console.log('Dados inseridos');
//   }
// } catch (error) {
//   console.error(error);
// }



/*
try {
  const baseQuery = new BaseQuerys('users', 'nome, email, password');

  const rowsUpdated = await baseQuery.updateValues(
    ['Jeffinho Santos', 'jeffjeff@email.com', '898989898989'],
    { id: '852ae19b-6052-4a7e-84a6-51e8498b36af' }
  );

  if (!rowsUpdated) {
    console.log('Dados não atualizados');
  } else {
    console.log('Dados atualizados');
  }
} catch (error) {
  console.log(error);
  
}
*/

