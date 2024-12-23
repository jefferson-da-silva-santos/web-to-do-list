Uma abordagem segura e amplamente adotada para criptografar senhas em APIs é usar a biblioteca **bcrypt**. O `bcrypt` permite que você gere um hash da senha antes de armazená-la no banco de dados, adicionando uma camada de segurança contra ataques como *rainbow tables*.

Aqui está um exemplo de como implementar a criptografia de senhas usando **bcrypt** em sua API:

---

### Instale o bcrypt

```bash
npm install bcrypt
```

---

### Exemplo de implementação

#### 1. Função para gerar o hash da senha

```javascript
import bcrypt from 'bcrypt';

async function gerarHashSenha(senha) {
    const saltRounds = 10; // Define o número de rounds para gerar o salt
    const salt = await bcrypt.genSalt(saltRounds); // Gera o salt
    const hash = await bcrypt.hash(senha, salt); // Gera o hash
    return hash;
}
```

#### 2. Função para verificar a senha

Ao autenticar o usuário, compare a senha fornecida com o hash armazenado no banco:

```javascript
async function verificarSenha(senhaFornecida, hashArmazenado) {
    return await bcrypt.compare(senhaFornecida, hashArmazenado);
}
```

---

### Fluxo no controlador ao criar o usuário

No fluxo de criação de um usuário, você deve gerar o hash da senha antes de armazená-la no banco de dados:

```javascript
import { gerarHashSenha } from './utils/hash';

async function criarUsuario(req, res) {
    try {
        const { username, senha } = req.body;

        // Valide os dados recebidos (ex: Joi)
        if (!username || !senha) {
            return res.status(400).json({ error: 'Username e senha são obrigatórios' });
        }

        // Gere o hash da senha
        const senhaHashed = await gerarHashSenha(senha);

        // Armazene no banco de dados (exemplo fictício)
        await db.usuarios.create({ username, senha: senhaHashed });

        return res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao criar o usuário' });
    }
}
```

---

### Fluxo no controlador ao autenticar o usuário

No fluxo de login, compare a senha recebida com o hash armazenado:

```javascript
import { verificarSenha } from './utils/hash';

async function autenticarUsuario(req, res) {
    try {
        const { username, senha } = req.body;

        // Busque o usuário no banco de dados
        const usuario = await db.usuarios.findOne({ where: { username } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Verifique a senha
        const senhaValida = await verificarSenha(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        // Gera um token (exemplo com JWT)
        const token = gerarToken({ id: usuario.id, username: usuario.username });

        return res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao autenticar o usuário' });
    }
}
```

---

### Por que usar bcrypt?

1. **Adiciona Salt Automático**: Evita que senhas iguais resultem no mesmo hash.
2. **Hash Irreversível**: O hash gerado não pode ser convertido de volta para a senha original.
3. **Resistente a Ataques de Força Bruta**: O número de rounds (ex.: 10) pode ser ajustado para aumentar a complexidade.

Essa abordagem garante a segurança das senhas no banco e segue boas práticas de desenvolvimento seguro.