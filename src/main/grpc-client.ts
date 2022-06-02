import { ipcMain } from 'electron';
import { createChannel, createClient } from 'nice-grpc';
import { AbortController } from 'node-abort-controller';
import { AbortError } from 'ix';
import {
  GreeterClient,
  GreeterDefinition,
} from '../grpc/gen_proto/hello-world';

const channel = createChannel('localhost:50051');

const client: GreeterClient = createClient(GreeterDefinition, channel);

export async function grpcClient() {
  let abortController: AbortController;

  ipcMain.on('grpc-hello', async (event, [request]) => {
    const { message } = await client.sayHello(request);
    event.reply('grpc-hello', message);
  });

  ipcMain.on('grpc-counter', async (event, [request]) => {
    abortController = new AbortController();
    try {
      for await (const response of client.serverCounter(request, {
        signal: abortController.signal,
      })) {
        if (!abortController.signal.aborted) {
          event.reply('grpc-counter', response.counter);
        }
      }
    } catch (err) {
      if (err instanceof AbortError) {
        console.log(err.message);
      } else {
        throw err;
      }
    }
  });

  ipcMain.on('abort', async () => {
    abortController.abort();
  });
}
