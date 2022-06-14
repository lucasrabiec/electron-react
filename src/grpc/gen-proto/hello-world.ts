/* eslint-disable */
import Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import { CallContext, CallOptions } from 'nice-grpc-common';

export const protobufPackage = '';

export interface HelloRequest {
  name: string;
}

export interface HelloReply {
  message: string;
}

export interface CountRequest {
  countRange: number;
}

export interface CountReply {
  counter: number;
}

function createBaseHelloRequest(): HelloRequest {
  return { name: '' };
}

export const HelloRequest = {
  encode(message: HelloRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HelloRequest {
    return {
      name: isSet(object.name) ? String(object.name) : '',
    };
  },

  toJSON(message: HelloRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },

  fromPartial(object: DeepPartial<HelloRequest>): HelloRequest {
    const message = createBaseHelloRequest();
    message.name = object.name ?? '';
    return message;
  },
};

function createBaseHelloReply(): HelloReply {
  return { message: '' };
}

export const HelloReply = {
  encode(message: HelloReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== '') {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): HelloReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHelloReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): HelloReply {
    return {
      message: isSet(object.message) ? String(object.message) : '',
    };
  },

  toJSON(message: HelloReply): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial(object: DeepPartial<HelloReply>): HelloReply {
    const message = createBaseHelloReply();
    message.message = object.message ?? '';
    return message;
  },
};

function createBaseCountRequest(): CountRequest {
  return { countRange: 0 };
}

export const CountRequest = {
  encode(message: CountRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.countRange !== 0) {
      writer.uint32(8).int32(message.countRange);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CountRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCountRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.countRange = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CountRequest {
    return {
      countRange: isSet(object.countRange) ? Number(object.countRange) : 0,
    };
  },

  toJSON(message: CountRequest): unknown {
    const obj: any = {};
    message.countRange !== undefined && (obj.countRange = Math.round(message.countRange));
    return obj;
  },

  fromPartial(object: DeepPartial<CountRequest>): CountRequest {
    const message = createBaseCountRequest();
    message.countRange = object.countRange ?? 0;
    return message;
  },
};

function createBaseCountReply(): CountReply {
  return { counter: 0 };
}

export const CountReply = {
  encode(message: CountReply, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.counter !== 0) {
      writer.uint32(8).int32(message.counter);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CountReply {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCountReply();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.counter = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CountReply {
    return {
      counter: isSet(object.counter) ? Number(object.counter) : 0,
    };
  },

  toJSON(message: CountReply): unknown {
    const obj: any = {};
    message.counter !== undefined && (obj.counter = Math.round(message.counter));
    return obj;
  },

  fromPartial(object: DeepPartial<CountReply>): CountReply {
    const message = createBaseCountReply();
    message.counter = object.counter ?? 0;
    return message;
  },
};

export type GreeterDefinition = typeof GreeterDefinition;
export const GreeterDefinition = {
  name: 'Greeter',
  fullName: 'Greeter',
  methods: {
    sayHello: {
      name: 'SayHello',
      requestType: HelloRequest,
      requestStream: false,
      responseType: HelloReply,
      responseStream: false,
      options: {},
    },
    serverCounter: {
      name: 'ServerCounter',
      requestType: CountRequest,
      requestStream: false,
      responseType: CountReply,
      responseStream: true,
      options: {},
    },
  },
} as const;

export interface GreeterServiceImplementation<CallContextExt = {}> {
  sayHello(request: HelloRequest, context: CallContext & CallContextExt): Promise<DeepPartial<HelloReply>>;
  serverCounter(
    request: CountRequest,
    context: CallContext & CallContextExt,
  ): ServerStreamingMethodResult<DeepPartial<CountReply>>;
}

export interface GreeterClient<CallOptionsExt = {}> {
  sayHello(request: DeepPartial<HelloRequest>, options?: CallOptions & CallOptionsExt): Promise<HelloReply>;
  serverCounter(request: DeepPartial<CountRequest>, options?: CallOptions & CallOptionsExt): AsyncIterable<CountReply>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export type ServerStreamingMethodResult<Response> = {
  [Symbol.asyncIterator](): AsyncIterator<Response, void>;
};
