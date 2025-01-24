// Require the framework and instantiate it
const Fastify = require('fastify');

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const fastifyAuth = require('@fastify/auth');
const fastifyJwt = require('@fastify/jwt');
const fastifyCors = require('@fastify/cors');
const app = Fastify();
const SALT_ROUNDS = 10;

// Register plugins
app.register(fastifyAuth);
app.register(fastifyJwt, { secret: 'supersecret' });
app.register(fastifyCors, {
  origin: '*', // Permitir todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
});

// SQLite connection
let db;
const setupDB = async () => {
  db = await open({
    filename: 'network.db',
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      fullName TEXT,
      imgUrl TEXT,
      cover TEXT,
      bio TEXT,
      role TEXT
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      content TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postId INTEGER,
      userId INTEGER,
      content TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entityId INTEGER,
      entityType TEXT,
      userId INTEGER,
      type TEXT,
      UNIQUE(entityId, entityType, userId)
    );
  `);
};

// Auth decorators
app.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Routes
app.post('/register', async (request, reply) => {
  const {
    username,
    password,
    fullName,
    imgUrl,
    cover,
    bio,
    role
  } = request.body;

  const hashedPassword = await hash(password, SALT_ROUNDS);

  try {
    await db.run(
      `INSERT INTO users (username, password, fullName, imgUrl, cover, bio, role)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, fullName, imgUrl, cover, bio, role]
    );
    reply.send({ message: 'User registered successfully!' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      reply.code(400).send({ error: 'Username already exists' });
    } else {
      reply.code(500).send({ error: 'An error occurred while registering the user' });
    }
  }
});

app.put('/users/:id', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { id } = request.params; // ID do usuário a ser atualizado
  const {
    username,
    password,
    fullName,
    imgUrl,
    cover,
    bio,
    role
  } = request.body;

  try {
    // Verifica se o usuário existe
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    // Atualiza apenas os campos enviados no body
    const updatedFields = {
      username: username || user.username,
      password: password ? await hash(password, SALT_ROUNDS) : user.password,
      fullName: fullName || user.fullName,
      imgUrl: imgUrl || user.imgUrl,
      cover: cover || user.cover,
      bio: bio || user.bio,
      role: role || user.role,
    };

    await db.run(
      `UPDATE users
       SET username = ?, password = ?, fullName = ?, imgUrl = ?, cover = ?, bio = ?, role = ?
       WHERE id = ?`,
      [
        updatedFields.username,
        updatedFields.password,
        updatedFields.fullName,
        updatedFields.imgUrl,
        updatedFields.cover,
        updatedFields.bio,
        updatedFields.role,
        id
      ]
    );

    reply.send({ message: 'User updated successfully!' });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed: users.username')) {
      reply.code(400).send({ error: 'Username already exists' });
    } else {
      reply.code(500).send({ error: 'An error occurred while updating the user' });
    }
  }
});



app.post('/login', async (request, reply) => {
  const { username, password } = request.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

  if (!user || !(await compare(password, user.password))) {
    return reply.code(401).send({ error: 'Invalid username or password' });
  }

  const token = app.jwt.sign({ id: user.id, username: user.username });
  reply.send({ token });
});

// Protect this route using the `authenticate` decorator
app.get('/me', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { id } = request.user; // Obtém o ID do usuário a partir do token decodificado

  try {
    // Use a instância do banco de dados `db` criada anteriormente
    const user = await db.get(
      'SELECT id, username, fullName, imgUrl, cover, bio, role FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return reply.code(404).send({ error: 'User not found' });
    }

    reply.send(user); // Retorna as informações do usuário
  } catch (error) {
    console.error(error); // Loga o erro para depuração
    reply.code(500).send({ error: 'Failed to retrieve user information' });
  }
});


// Protect this route using the `authenticate` decorator
app.post('/posts', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { content } = request.body;
  const { id: userId } = request.user;

  const result = await db.run(
    'INSERT INTO posts (userId, content) VALUES (?, ?)',
    [userId, content]
  );
  reply.send({ id: result.lastID, content });
});

// Public route to get all posts
app.get('/posts', { preHandler: [app.authenticate] }, async (request, reply) => {
  try {
    const posts = await db.all(`
     SELECT 
  posts.id AS postId,
  posts.content,
  posts.createdAt,
  users.id AS userId,
  users.fullName,
  users.imgUrl,
  users.cover,
  users.bio,
  users.role
FROM posts
JOIN users ON posts.userId = users.id
ORDER BY posts.createdAt DESC;
    `);

    // Formatar os dados para incluir as informações do usuário em um objeto "user"
    const formattedPosts = posts.map(post => ({
      id: post.postId,
      content: post.content,
      createdAt: post.createdAt,
      user: {
        id: post.userId,
        fullName: post.fullName,
        imgUrl: post.imgUrl,
        cover: post.cover,
        bio: post.bio,
        role: post.role
      }
    }));

    reply.send(formattedPosts);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Failed to fetch posts' });
  }
});


// Protect this route using the `authenticate` decorator
app.post('/comments', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { postId, content } = request.body;
  const { id: userId } = request.user;

  const result = await db.run(
    'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)',
    [postId, userId, content]
  );
  reply.send({ id: result.lastID, content });
});

// Public route to get comments for a post
app.get('/comments/:postId', async (request, reply) => {
  const { postId } = request.params;

  try {
    const comments = await db.all(
      `
      SELECT 
        comments.id AS commentId,
        comments.content,
        comments.createdAt,
        users.id AS userId,
        users.fullName,
        users.imgUrl,
        users.bio
      FROM comments
      INNER JOIN users ON comments.userId = users.id
      WHERE comments.postId = ?
      ORDER BY comments.createdAt DESC
      `,
      [postId]
    );

    reply.send(comments);
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: 'Failed to fetch comments' });
  }
});

// Protect this route using the `authenticate` decorator
app.post('/reactions', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { entityId, entityType, type } = request.body;
  const { id: userId } = request.user;

  try {
    // Verificar se já existe uma reação do usuário para esta entidade
    const existingReaction = await db.get(
      'SELECT type FROM reactions WHERE entityId = ? AND entityType = ? AND userId = ?',
      [entityId, entityType, userId]
    );

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Se a reação for do mesmo tipo, remova a reação
        await db.run(
          'DELETE FROM reactions WHERE entityId = ? AND entityType = ? AND userId = ?',
          [entityId, entityType, userId]
        );
        reply.send({ message: 'Reaction removed successfully' });
      } else {
        // Se for de tipo diferente, atualize para o novo tipo
        await db.run(
          'UPDATE reactions SET type = ? WHERE entityId = ? AND entityType = ? AND userId = ?',
          [type, entityId, entityType, userId]
        );
        reply.send({ message: 'Reaction updated successfully' });
      }
    } else {
      // Se não houver reação, insira uma nova
      await db.run(
        'INSERT INTO reactions (entityId, entityType, userId, type) VALUES (?, ?, ?, ?)',
        [entityId, entityType, userId, type]
      );
      reply.send({ message: 'Reaction added successfully' });
    }
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: 'Failed to process reaction' });
  }
});


// Public route to get reactions for an entity
app.get('/reactions/:entityId/:entityType', { preHandler: [app.authenticate] }, async (request, reply) => {
  const { entityId, entityType } = request.params;
  const reactions = await db.all(
    'SELECT * FROM reactions WHERE entityId = ? AND entityType = ?',
    [entityId, entityType]
  );
  reply.send(reactions);
});

// Initialize server and DB
const startServer = async () => {
  await setupDB();
  try {
    await app.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
