import express from 'express';

import cors from 'cors';

import { createServer } from 'http';

import mongoose from 'mongoose';

import routes from './routes';

import { setupWebSocket } from './websocket';

const app = express();

const server = createServer(app);

setupWebSocket(server);

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.qz76y.mongodb.net/<databasename>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors()); 
app.use(express.json());
app.use(routes);

server.listen(3333, () => {
  console.log('server started.')
})