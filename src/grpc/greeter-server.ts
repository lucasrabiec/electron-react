import { range } from '@reactivex/ix-esnext-cjs/asynciterable';
import { delayEach, map, withAbort } from '@reactivex/ix-esnext-cjs/asynciterable/operators';
import { createServer } from 'nice-grpc';
import {
  CountReply,
  DeepPartial,
  GreeterDefinition,
  GreeterServiceImplementation,
  HelloReply,
} from './gen_proto/hello-world';

const impl: GreeterServiceImplementation = {
  async sayHello(request): Promise<DeepPartial<HelloReply>> {
    return { message: `Hello ${request.name}` };
  },

  async *serverCounter(request, context): AsyncIterable<DeepPartial<CountReply>> {
    yield* range(1, request.countRange).pipe(
      withAbort(<AbortSignal>context.signal),
      delayEach(1000),
      map((counter) => ({ counter })),
    );
  },
};

export async function startGrpcServer() {
  const server = createServer();

  server.add(GreeterDefinition, impl);
  await server.listen('0.0.0.0:50051');
}
