import { ipcMain } from 'electron';
import { createChannel, createClient } from 'nice-grpc';
import { AbortController } from 'node-abort-controller';
import { AbortError } from '@reactivex/ix-esnext-cjs';
import { GreeterClient, GreeterDefinition } from '../../grpc/gen_proto/hello-world';
import { Channels } from '../../utils/consts';

const channel = createChannel('localhost:50051');

const client: GreeterClient = createClient(GreeterDefinition, channel);

export async function startGrpcHandler() {
  let abortController: AbortController;

  ipcMain.on(Channels.GRPC_HELLO, async (event, [request]) => {
    const { message } = await client.sayHello(request);
    event.reply(Channels.GRPC_HELLO, message);
  });

  ipcMain.on(Channels.GRPC_COUNTER, async (event, [request]) => {
    abortController = new AbortController();
    try {
      for await (const response of client.serverCounter(request, {
        signal: abortController.signal,
      })) {
        if (!abortController.signal.aborted) {
          event.reply(Channels.GRPC_COUNTER, response.counter);
        }
      }
    } catch (err) {
      if (err instanceof AbortError) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  });

  ipcMain.on(Channels.GRPC_ABORT, async () => {
    abortController?.abort();
  });
}
