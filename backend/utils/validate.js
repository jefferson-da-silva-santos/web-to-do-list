import Joi from "joi";

// Definir os valores permitidos
const allowedValues = [
  'id', 'user_id', 'nome', 'email', 'password', 
  'created_at', 'updated_at', 'title', 'description', 
  'status', 'due_date'
];

// Criar o schema de validação
export const schemaColumns = Joi.string()
  .pattern(/^([a-z_]+, )*[a-z_]+$/) // Regex para validar o formato geral
  .custom((value, helpers) => {
    const items = value.split(',').map(item => item.trim()); 
    for (const item of items) {
      if (!allowedValues.includes(item)) {
        return helpers.error('any.invalid', { item });
      }
    }
    return value;
  }, 'Validar palavras permitidas');


  export const schemaUser = Joi.object({
    nome: Joi.string()
      .min(3) // Mínimo de 3 caracteres
      .max(50) // Máximo de 50 caracteres
      .regex(/^[a-zA-Z\s]+$/) // Apenas letras e espaços
      .required()
      .messages({
        'string.base': 'O nome deve ser um texto.',
        'string.empty': 'O nome é obrigatório.',
        'string.min': 'O nome deve ter pelo menos 3 caracteres.',
        'string.max': 'O nome deve ter no máximo 50 caracteres.',
        'string.pattern.base': 'O nome só pode conter letras e espaços.',
      }),
  
    email: Joi.string()
      .email() // Validação de formato de email
      .required()
      .messages({
        'string.base': 'O email deve ser um texto.',
        'string.empty': 'O email é obrigatório.',
        'string.email': 'O email deve ser válido.',
      }),
  
    password: Joi.string()
      .min(8) // Mínimo de 8 caracteres
      .max(100) // Máximo de 100 caracteres
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.base': 'A senha deve ser um texto.',
        'string.empty': 'A senha é obrigatória.',
        'string.min': 'A senha deve ter pelo menos 8 caracteres.',
        'string.max': 'A senha deve ter no máximo 100 caracteres.',
        'string.pattern.base': 'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
      }),
  });