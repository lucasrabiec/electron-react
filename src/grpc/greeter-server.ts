import { range } from 'ix/asynciterable';
import { delayEach, map, withAbort } from 'ix/asynciterable/operators';
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

  async *serverCounter(
    request,
    context
  ): AsyncIterable<DeepPartial<CountReply>> {
    yield* range(1, request.countRange).pipe(
      withAbort(<AbortSignal>context.signal),
      delayEach(1000),
      map((counter) => ({ counter }))
    );
  },
};

async function main() {
  const server = createServer();

  server.add(GreeterDefinition, impl);
  await server.listen('0.0.0.0:50051');
}

main()
  // eslint-disable-next-line promise/always-return
  .then(() => {})
  .catch((err) => console.log(err));
