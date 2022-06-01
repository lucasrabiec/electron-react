import { ipcMain } from 'electron';
import { createChannel, createClient } from 'nice-grpc';
import {
  GreeterClient,
  GreeterDefinition,
} from '../grpc/gen_proto/hello-world';

const channel = createChannel('localhost:50051');

const client: GreeterClient = createClient(GreeterDefinition, channel);

// eslint-disable-next-line import/prefer-default-export
export async function grpcClient() {
  ipcMain.on('grpc-hello', async (event, arg) => {
    const { message } = await client.sayHello(arg[0]);
    event.reply('grpc-hello', message);
  });

  ipcMain.on('grpc-counter', async (event, arg) => {
    for await (const response of client.serverCounter(arg[0])) {
      event.reply('grpc-counter', response.counter);
    }
  });
}
