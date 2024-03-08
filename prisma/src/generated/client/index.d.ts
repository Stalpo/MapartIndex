
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model MapId
 * 
 */
export type MapId = $Result.DefaultSelection<Prisma.$MapIdPayload>
/**
 * Model MapArt
 * 
 */
export type MapArt = $Result.DefaultSelection<Prisma.$MapArtPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.mapId`: Exposes CRUD operations for the **MapId** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MapIds
    * const mapIds = await prisma.mapId.findMany()
    * ```
    */
  get mapId(): Prisma.MapIdDelegate<ExtArgs>;

  /**
   * `prisma.mapArt`: Exposes CRUD operations for the **MapArt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MapArts
    * const mapArts = await prisma.mapArt.findMany()
    * ```
    */
  get mapArt(): Prisma.MapArtDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.10.2
   * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    MapId: 'MapId',
    MapArt: 'MapArt'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'user' | 'mapId' | 'mapArt'
      txIsolationLevel: never
    },
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>,
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      MapId: {
        payload: Prisma.$MapIdPayload<ExtArgs>
        fields: Prisma.MapIdFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MapIdFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MapIdFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          findFirst: {
            args: Prisma.MapIdFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MapIdFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          findMany: {
            args: Prisma.MapIdFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>[]
          }
          create: {
            args: Prisma.MapIdCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          createMany: {
            args: Prisma.MapIdCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.MapIdDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          update: {
            args: Prisma.MapIdUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          deleteMany: {
            args: Prisma.MapIdDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.MapIdUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.MapIdUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapIdPayload>
          }
          aggregate: {
            args: Prisma.MapIdAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMapId>
          }
          groupBy: {
            args: Prisma.MapIdGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MapIdGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MapIdFindRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          aggregateRaw: {
            args: Prisma.MapIdAggregateRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          count: {
            args: Prisma.MapIdCountArgs<ExtArgs>,
            result: $Utils.Optional<MapIdCountAggregateOutputType> | number
          }
        }
      }
      MapArt: {
        payload: Prisma.$MapArtPayload<ExtArgs>
        fields: Prisma.MapArtFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MapArtFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MapArtFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          findFirst: {
            args: Prisma.MapArtFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MapArtFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          findMany: {
            args: Prisma.MapArtFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>[]
          }
          create: {
            args: Prisma.MapArtCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          createMany: {
            args: Prisma.MapArtCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          delete: {
            args: Prisma.MapArtDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          update: {
            args: Prisma.MapArtUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          deleteMany: {
            args: Prisma.MapArtDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.MapArtUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.MapArtUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$MapArtPayload>
          }
          aggregate: {
            args: Prisma.MapArtAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateMapArt>
          }
          groupBy: {
            args: Prisma.MapArtGroupByArgs<ExtArgs>,
            result: $Utils.Optional<MapArtGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.MapArtFindRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          aggregateRaw: {
            args: Prisma.MapArtAggregateRawArgs<ExtArgs>,
            result: Prisma.JsonObject
          }
          count: {
            args: Prisma.MapArtCountArgs<ExtArgs>,
            result: $Utils.Optional<MapArtCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    mapIds: number
    maps: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mapIds?: boolean | UserCountOutputTypeCountMapIdsArgs
    maps?: boolean | UserCountOutputTypeCountMapsArgs
  }

  // Custom InputTypes

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMapIdsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapIdWhereInput
  }


  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapArtWhereInput
  }



  /**
   * Count Type MapArtCountOutputType
   */

  export type MapArtCountOutputType = {
    mapIds: number
  }

  export type MapArtCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mapIds?: boolean | MapArtCountOutputTypeCountMapIdsArgs
  }

  // Custom InputTypes

  /**
   * MapArtCountOutputType without action
   */
  export type MapArtCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArtCountOutputType
     */
    select?: MapArtCountOutputTypeSelect<ExtArgs> | null
  }


  /**
   * MapArtCountOutputType without action
   */
  export type MapArtCountOutputTypeCountMapIdsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapIdWhereInput
  }



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    username: string | null
    hashedPw: string | null
    mcUuid: string | null
    discordId: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    username: string | null
    hashedPw: string | null
    mcUuid: string | null
    discordId: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    username: number
    hashedPw: number
    mcUuid: number
    discordId: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    hashedPw?: true
    mcUuid?: true
    discordId?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    hashedPw?: true
    mcUuid?: true
    discordId?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    username?: true
    hashedPw?: true
    mcUuid?: true
    discordId?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    hashedPw?: boolean
    mcUuid?: boolean
    discordId?: boolean
    mapIds?: boolean | User$mapIdsArgs<ExtArgs>
    maps?: boolean | User$mapsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    username?: boolean
    hashedPw?: boolean
    mcUuid?: boolean
    discordId?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    mapIds?: boolean | User$mapIdsArgs<ExtArgs>
    maps?: boolean | User$mapsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      mapIds: Prisma.$MapIdPayload<ExtArgs>[]
      maps: Prisma.$MapArtPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      username: string
      hashedPw: string
      mcUuid: string
      discordId: string
    }, ExtArgs["result"]["user"]>
    composites: {}
  }


  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UserFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UserFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UserFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
    **/
    create<T extends UserCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UserCreateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Users.
     *     @param {UserCreateManyArgs} args - Arguments to create many Users.
     *     @example
     *     // Create many Users
     *     const user = await prisma.user.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends UserCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
    **/
    delete<T extends UserDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UserDeleteArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UserUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UserDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UserUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
    **/
    upsert<T extends UserUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UserUpsertArgs<ExtArgs>>
    ): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: UserFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: UserAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    mapIds<T extends User$mapIdsArgs<ExtArgs> = {}>(args?: Subset<T, User$mapIdsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findMany'> | Null>;

    maps<T extends User$mapsArgs<ExtArgs> = {}>(args?: Subset<T, User$mapsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly username: FieldRef<"User", 'String'>
    readonly hashedPw: FieldRef<"User", 'String'>
    readonly mcUuid: FieldRef<"User", 'String'>
    readonly discordId: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes

  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }


  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }


  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }


  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }


  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }


  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }


  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }


  /**
   * User findRaw
   */
  export type UserFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * User.mapIds
   */
  export type User$mapIdsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    where?: MapIdWhereInput
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    cursor?: MapIdWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MapIdScalarFieldEnum | MapIdScalarFieldEnum[]
  }


  /**
   * User.maps
   */
  export type User$mapsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    where?: MapArtWhereInput
    orderBy?: MapArtOrderByWithRelationInput | MapArtOrderByWithRelationInput[]
    cursor?: MapArtWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MapArtScalarFieldEnum | MapArtScalarFieldEnum[]
  }


  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: UserInclude<ExtArgs> | null
  }



  /**
   * Model MapId
   */

  export type AggregateMapId = {
    _count: MapIdCountAggregateOutputType | null
    _min: MapIdMinAggregateOutputType | null
    _max: MapIdMaxAggregateOutputType | null
  }

  export type MapIdMinAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    data: string | null
    imgUrl: string | null
    creator: string | null
    mapId: string | null
  }

  export type MapIdMaxAggregateOutputType = {
    id: string | null
    name: string | null
    ownerId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    data: string | null
    imgUrl: string | null
    creator: string | null
    mapId: string | null
  }

  export type MapIdCountAggregateOutputType = {
    id: number
    name: number
    ownerId: number
    createdAt: number
    updatedAt: number
    data: number
    imgUrl: number
    creator: number
    mapId: number
    _all: number
  }


  export type MapIdMinAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    imgUrl?: true
    creator?: true
    mapId?: true
  }

  export type MapIdMaxAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    imgUrl?: true
    creator?: true
    mapId?: true
  }

  export type MapIdCountAggregateInputType = {
    id?: true
    name?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    data?: true
    imgUrl?: true
    creator?: true
    mapId?: true
    _all?: true
  }

  export type MapIdAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MapId to aggregate.
     */
    where?: MapIdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapIds to fetch.
     */
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MapIdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapIds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapIds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MapIds
    **/
    _count?: true | MapIdCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MapIdMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MapIdMaxAggregateInputType
  }

  export type GetMapIdAggregateType<T extends MapIdAggregateArgs> = {
        [P in keyof T & keyof AggregateMapId]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMapId[P]>
      : GetScalarType<T[P], AggregateMapId[P]>
  }




  export type MapIdGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapIdWhereInput
    orderBy?: MapIdOrderByWithAggregationInput | MapIdOrderByWithAggregationInput[]
    by: MapIdScalarFieldEnum[] | MapIdScalarFieldEnum
    having?: MapIdScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MapIdCountAggregateInputType | true
    _min?: MapIdMinAggregateInputType
    _max?: MapIdMaxAggregateInputType
  }

  export type MapIdGroupByOutputType = {
    id: string
    name: string
    ownerId: string
    createdAt: Date
    updatedAt: Date
    data: string
    imgUrl: string
    creator: string
    mapId: string | null
    _count: MapIdCountAggregateOutputType | null
    _min: MapIdMinAggregateOutputType | null
    _max: MapIdMaxAggregateOutputType | null
  }

  type GetMapIdGroupByPayload<T extends MapIdGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MapIdGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MapIdGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MapIdGroupByOutputType[P]>
            : GetScalarType<T[P], MapIdGroupByOutputType[P]>
        }
      >
    >


  export type MapIdSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    imgUrl?: boolean
    creator?: boolean
    mapId?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    Map?: boolean | MapId$MapArgs<ExtArgs>
  }, ExtArgs["result"]["mapId"]>

  export type MapIdSelectScalar = {
    id?: boolean
    name?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    data?: boolean
    imgUrl?: boolean
    creator?: boolean
    mapId?: boolean
  }

  export type MapIdInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    Map?: boolean | MapId$MapArgs<ExtArgs>
  }


  export type $MapIdPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MapId"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      Map: Prisma.$MapArtPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      ownerId: string
      createdAt: Date
      updatedAt: Date
      data: string
      imgUrl: string
      creator: string
      mapId: string | null
    }, ExtArgs["result"]["mapId"]>
    composites: {}
  }


  type MapIdGetPayload<S extends boolean | null | undefined | MapIdDefaultArgs> = $Result.GetResult<Prisma.$MapIdPayload, S>

  type MapIdCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MapIdFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MapIdCountAggregateInputType | true
    }

  export interface MapIdDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MapId'], meta: { name: 'MapId' } }
    /**
     * Find zero or one MapId that matches the filter.
     * @param {MapIdFindUniqueArgs} args - Arguments to find a MapId
     * @example
     * // Get one MapId
     * const mapId = await prisma.mapId.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends MapIdFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdFindUniqueArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one MapId that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {MapIdFindUniqueOrThrowArgs} args - Arguments to find a MapId
     * @example
     * // Get one MapId
     * const mapId = await prisma.mapId.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends MapIdFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first MapId that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdFindFirstArgs} args - Arguments to find a MapId
     * @example
     * // Get one MapId
     * const mapId = await prisma.mapId.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends MapIdFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdFindFirstArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first MapId that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdFindFirstOrThrowArgs} args - Arguments to find a MapId
     * @example
     * // Get one MapId
     * const mapId = await prisma.mapId.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends MapIdFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more MapIds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MapIds
     * const mapIds = await prisma.mapId.findMany()
     * 
     * // Get first 10 MapIds
     * const mapIds = await prisma.mapId.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mapIdWithIdOnly = await prisma.mapId.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends MapIdFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a MapId.
     * @param {MapIdCreateArgs} args - Arguments to create a MapId.
     * @example
     * // Create one MapId
     * const MapId = await prisma.mapId.create({
     *   data: {
     *     // ... data to create a MapId
     *   }
     * })
     * 
    **/
    create<T extends MapIdCreateArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdCreateArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many MapIds.
     *     @param {MapIdCreateManyArgs} args - Arguments to create many MapIds.
     *     @example
     *     // Create many MapIds
     *     const mapId = await prisma.mapId.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends MapIdCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MapId.
     * @param {MapIdDeleteArgs} args - Arguments to delete one MapId.
     * @example
     * // Delete one MapId
     * const MapId = await prisma.mapId.delete({
     *   where: {
     *     // ... filter to delete one MapId
     *   }
     * })
     * 
    **/
    delete<T extends MapIdDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdDeleteArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one MapId.
     * @param {MapIdUpdateArgs} args - Arguments to update one MapId.
     * @example
     * // Update one MapId
     * const mapId = await prisma.mapId.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends MapIdUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdUpdateArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more MapIds.
     * @param {MapIdDeleteManyArgs} args - Arguments to filter MapIds to delete.
     * @example
     * // Delete a few MapIds
     * const { count } = await prisma.mapId.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends MapIdDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapIdDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MapIds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MapIds
     * const mapId = await prisma.mapId.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends MapIdUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MapId.
     * @param {MapIdUpsertArgs} args - Arguments to update or create a MapId.
     * @example
     * // Update or create a MapId
     * const mapId = await prisma.mapId.upsert({
     *   create: {
     *     // ... data to create a MapId
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MapId we want to update
     *   }
     * })
    **/
    upsert<T extends MapIdUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, MapIdUpsertArgs<ExtArgs>>
    ): Prisma__MapIdClient<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Find zero or more MapIds that matches the filter.
     * @param {MapIdFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const mapId = await prisma.mapId.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: MapIdFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MapId.
     * @param {MapIdAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const mapId = await prisma.mapId.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: MapIdAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of MapIds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdCountArgs} args - Arguments to filter MapIds to count.
     * @example
     * // Count the number of MapIds
     * const count = await prisma.mapId.count({
     *   where: {
     *     // ... the filter for the MapIds we want to count
     *   }
     * })
    **/
    count<T extends MapIdCountArgs>(
      args?: Subset<T, MapIdCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MapIdCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MapId.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MapIdAggregateArgs>(args: Subset<T, MapIdAggregateArgs>): Prisma.PrismaPromise<GetMapIdAggregateType<T>>

    /**
     * Group by MapId.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapIdGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MapIdGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MapIdGroupByArgs['orderBy'] }
        : { orderBy?: MapIdGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MapIdGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMapIdGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MapId model
   */
  readonly fields: MapIdFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MapId.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MapIdClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    Map<T extends MapId$MapArgs<ExtArgs> = {}>(args?: Subset<T, MapId$MapArgs<ExtArgs>>): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the MapId model
   */ 
  interface MapIdFieldRefs {
    readonly id: FieldRef<"MapId", 'String'>
    readonly name: FieldRef<"MapId", 'String'>
    readonly ownerId: FieldRef<"MapId", 'String'>
    readonly createdAt: FieldRef<"MapId", 'DateTime'>
    readonly updatedAt: FieldRef<"MapId", 'DateTime'>
    readonly data: FieldRef<"MapId", 'String'>
    readonly imgUrl: FieldRef<"MapId", 'String'>
    readonly creator: FieldRef<"MapId", 'String'>
    readonly mapId: FieldRef<"MapId", 'String'>
  }
    

  // Custom InputTypes

  /**
   * MapId findUnique
   */
  export type MapIdFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter, which MapId to fetch.
     */
    where: MapIdWhereUniqueInput
  }


  /**
   * MapId findUniqueOrThrow
   */
  export type MapIdFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter, which MapId to fetch.
     */
    where: MapIdWhereUniqueInput
  }


  /**
   * MapId findFirst
   */
  export type MapIdFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter, which MapId to fetch.
     */
    where?: MapIdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapIds to fetch.
     */
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MapIds.
     */
    cursor?: MapIdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapIds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapIds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MapIds.
     */
    distinct?: MapIdScalarFieldEnum | MapIdScalarFieldEnum[]
  }


  /**
   * MapId findFirstOrThrow
   */
  export type MapIdFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter, which MapId to fetch.
     */
    where?: MapIdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapIds to fetch.
     */
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MapIds.
     */
    cursor?: MapIdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapIds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapIds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MapIds.
     */
    distinct?: MapIdScalarFieldEnum | MapIdScalarFieldEnum[]
  }


  /**
   * MapId findMany
   */
  export type MapIdFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter, which MapIds to fetch.
     */
    where?: MapIdWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapIds to fetch.
     */
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MapIds.
     */
    cursor?: MapIdWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapIds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapIds.
     */
    skip?: number
    distinct?: MapIdScalarFieldEnum | MapIdScalarFieldEnum[]
  }


  /**
   * MapId create
   */
  export type MapIdCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * The data needed to create a MapId.
     */
    data: XOR<MapIdCreateInput, MapIdUncheckedCreateInput>
  }


  /**
   * MapId createMany
   */
  export type MapIdCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MapIds.
     */
    data: MapIdCreateManyInput | MapIdCreateManyInput[]
  }


  /**
   * MapId update
   */
  export type MapIdUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * The data needed to update a MapId.
     */
    data: XOR<MapIdUpdateInput, MapIdUncheckedUpdateInput>
    /**
     * Choose, which MapId to update.
     */
    where: MapIdWhereUniqueInput
  }


  /**
   * MapId updateMany
   */
  export type MapIdUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MapIds.
     */
    data: XOR<MapIdUpdateManyMutationInput, MapIdUncheckedUpdateManyInput>
    /**
     * Filter which MapIds to update
     */
    where?: MapIdWhereInput
  }


  /**
   * MapId upsert
   */
  export type MapIdUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * The filter to search for the MapId to update in case it exists.
     */
    where: MapIdWhereUniqueInput
    /**
     * In case the MapId found by the `where` argument doesn't exist, create a new MapId with this data.
     */
    create: XOR<MapIdCreateInput, MapIdUncheckedCreateInput>
    /**
     * In case the MapId was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MapIdUpdateInput, MapIdUncheckedUpdateInput>
  }


  /**
   * MapId delete
   */
  export type MapIdDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    /**
     * Filter which MapId to delete.
     */
    where: MapIdWhereUniqueInput
  }


  /**
   * MapId deleteMany
   */
  export type MapIdDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MapIds to delete
     */
    where?: MapIdWhereInput
  }


  /**
   * MapId findRaw
   */
  export type MapIdFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * MapId aggregateRaw
   */
  export type MapIdAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * MapId.Map
   */
  export type MapId$MapArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    where?: MapArtWhereInput
  }


  /**
   * MapId without action
   */
  export type MapIdDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
  }



  /**
   * Model MapArt
   */

  export type AggregateMapArt = {
    _count: MapArtCountAggregateOutputType | null
    _avg: MapArtAvgAggregateOutputType | null
    _sum: MapArtSumAggregateOutputType | null
    _min: MapArtMinAggregateOutputType | null
    _max: MapArtMaxAggregateOutputType | null
  }

  export type MapArtAvgAggregateOutputType = {
    rotations: number | null
    vSize: number | null
    hSize: number | null
  }

  export type MapArtSumAggregateOutputType = {
    rotations: number[]
    vSize: number | null
    hSize: number | null
  }

  export type MapArtMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    vSize: number | null
    hSize: number | null
  }

  export type MapArtMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    description: string | null
    vSize: number | null
    hSize: number | null
  }

  export type MapArtCountAggregateOutputType = {
    id: number
    rotations: number
    createdAt: number
    updatedAt: number
    name: number
    description: number
    vSize: number
    hSize: number
    _all: number
  }


  export type MapArtAvgAggregateInputType = {
    rotations?: true
    vSize?: true
    hSize?: true
  }

  export type MapArtSumAggregateInputType = {
    rotations?: true
    vSize?: true
    hSize?: true
  }

  export type MapArtMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    vSize?: true
    hSize?: true
  }

  export type MapArtMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    vSize?: true
    hSize?: true
  }

  export type MapArtCountAggregateInputType = {
    id?: true
    rotations?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    description?: true
    vSize?: true
    hSize?: true
    _all?: true
  }

  export type MapArtAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MapArt to aggregate.
     */
    where?: MapArtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapArts to fetch.
     */
    orderBy?: MapArtOrderByWithRelationInput | MapArtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MapArtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapArts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapArts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MapArts
    **/
    _count?: true | MapArtCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MapArtAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MapArtSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MapArtMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MapArtMaxAggregateInputType
  }

  export type GetMapArtAggregateType<T extends MapArtAggregateArgs> = {
        [P in keyof T & keyof AggregateMapArt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMapArt[P]>
      : GetScalarType<T[P], AggregateMapArt[P]>
  }




  export type MapArtGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MapArtWhereInput
    orderBy?: MapArtOrderByWithAggregationInput | MapArtOrderByWithAggregationInput[]
    by: MapArtScalarFieldEnum[] | MapArtScalarFieldEnum
    having?: MapArtScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MapArtCountAggregateInputType | true
    _avg?: MapArtAvgAggregateInputType
    _sum?: MapArtSumAggregateInputType
    _min?: MapArtMinAggregateInputType
    _max?: MapArtMaxAggregateInputType
  }

  export type MapArtGroupByOutputType = {
    id: string
    rotations: number[]
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    vSize: number
    hSize: number
    _count: MapArtCountAggregateOutputType | null
    _avg: MapArtAvgAggregateOutputType | null
    _sum: MapArtSumAggregateOutputType | null
    _min: MapArtMinAggregateOutputType | null
    _max: MapArtMaxAggregateOutputType | null
  }

  type GetMapArtGroupByPayload<T extends MapArtGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MapArtGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MapArtGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MapArtGroupByOutputType[P]>
            : GetScalarType<T[P], MapArtGroupByOutputType[P]>
        }
      >
    >


  export type MapArtSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rotations?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    vSize?: boolean
    hSize?: boolean
    creator?: boolean | UserDefaultArgs<ExtArgs>
    mapIds?: boolean | MapArt$mapIdsArgs<ExtArgs>
    _count?: boolean | MapArtCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mapArt"]>

  export type MapArtSelectScalar = {
    id?: boolean
    rotations?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    description?: boolean
    vSize?: boolean
    hSize?: boolean
  }

  export type MapArtInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | UserDefaultArgs<ExtArgs>
    mapIds?: boolean | MapArt$mapIdsArgs<ExtArgs>
    _count?: boolean | MapArtCountOutputTypeDefaultArgs<ExtArgs>
  }


  export type $MapArtPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MapArt"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs>
      mapIds: Prisma.$MapIdPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rotations: number[]
      createdAt: Date
      updatedAt: Date
      name: string
      description: string
      vSize: number
      hSize: number
    }, ExtArgs["result"]["mapArt"]>
    composites: {}
  }


  type MapArtGetPayload<S extends boolean | null | undefined | MapArtDefaultArgs> = $Result.GetResult<Prisma.$MapArtPayload, S>

  type MapArtCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<MapArtFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: MapArtCountAggregateInputType | true
    }

  export interface MapArtDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MapArt'], meta: { name: 'MapArt' } }
    /**
     * Find zero or one MapArt that matches the filter.
     * @param {MapArtFindUniqueArgs} args - Arguments to find a MapArt
     * @example
     * // Get one MapArt
     * const mapArt = await prisma.mapArt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends MapArtFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtFindUniqueArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one MapArt that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {MapArtFindUniqueOrThrowArgs} args - Arguments to find a MapArt
     * @example
     * // Get one MapArt
     * const mapArt = await prisma.mapArt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends MapArtFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first MapArt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtFindFirstArgs} args - Arguments to find a MapArt
     * @example
     * // Get one MapArt
     * const mapArt = await prisma.mapArt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends MapArtFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtFindFirstArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first MapArt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtFindFirstOrThrowArgs} args - Arguments to find a MapArt
     * @example
     * // Get one MapArt
     * const mapArt = await prisma.mapArt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends MapArtFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more MapArts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MapArts
     * const mapArts = await prisma.mapArt.findMany()
     * 
     * // Get first 10 MapArts
     * const mapArts = await prisma.mapArt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mapArtWithIdOnly = await prisma.mapArt.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends MapArtFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a MapArt.
     * @param {MapArtCreateArgs} args - Arguments to create a MapArt.
     * @example
     * // Create one MapArt
     * const MapArt = await prisma.mapArt.create({
     *   data: {
     *     // ... data to create a MapArt
     *   }
     * })
     * 
    **/
    create<T extends MapArtCreateArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtCreateArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many MapArts.
     *     @param {MapArtCreateManyArgs} args - Arguments to create many MapArts.
     *     @example
     *     // Create many MapArts
     *     const mapArt = await prisma.mapArt.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends MapArtCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a MapArt.
     * @param {MapArtDeleteArgs} args - Arguments to delete one MapArt.
     * @example
     * // Delete one MapArt
     * const MapArt = await prisma.mapArt.delete({
     *   where: {
     *     // ... filter to delete one MapArt
     *   }
     * })
     * 
    **/
    delete<T extends MapArtDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtDeleteArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one MapArt.
     * @param {MapArtUpdateArgs} args - Arguments to update one MapArt.
     * @example
     * // Update one MapArt
     * const mapArt = await prisma.mapArt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends MapArtUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtUpdateArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more MapArts.
     * @param {MapArtDeleteManyArgs} args - Arguments to filter MapArts to delete.
     * @example
     * // Delete a few MapArts
     * const { count } = await prisma.mapArt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends MapArtDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, MapArtDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MapArts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MapArts
     * const mapArt = await prisma.mapArt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends MapArtUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one MapArt.
     * @param {MapArtUpsertArgs} args - Arguments to update or create a MapArt.
     * @example
     * // Update or create a MapArt
     * const mapArt = await prisma.mapArt.upsert({
     *   create: {
     *     // ... data to create a MapArt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MapArt we want to update
     *   }
     * })
    **/
    upsert<T extends MapArtUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, MapArtUpsertArgs<ExtArgs>>
    ): Prisma__MapArtClient<$Result.GetResult<Prisma.$MapArtPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Find zero or more MapArts that matches the filter.
     * @param {MapArtFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const mapArt = await prisma.mapArt.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
    **/
    findRaw(
      args?: MapArtFindRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a MapArt.
     * @param {MapArtAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const mapArt = await prisma.mapArt.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
    **/
    aggregateRaw(
      args?: MapArtAggregateRawArgs
    ): Prisma.PrismaPromise<JsonObject>

    /**
     * Count the number of MapArts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtCountArgs} args - Arguments to filter MapArts to count.
     * @example
     * // Count the number of MapArts
     * const count = await prisma.mapArt.count({
     *   where: {
     *     // ... the filter for the MapArts we want to count
     *   }
     * })
    **/
    count<T extends MapArtCountArgs>(
      args?: Subset<T, MapArtCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MapArtCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MapArt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MapArtAggregateArgs>(args: Subset<T, MapArtAggregateArgs>): Prisma.PrismaPromise<GetMapArtAggregateType<T>>

    /**
     * Group by MapArt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MapArtGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MapArtGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MapArtGroupByArgs['orderBy'] }
        : { orderBy?: MapArtGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MapArtGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMapArtGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MapArt model
   */
  readonly fields: MapArtFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MapArt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MapArtClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    creator<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    mapIds<T extends MapArt$mapIdsArgs<ExtArgs> = {}>(args?: Subset<T, MapArt$mapIdsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MapIdPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the MapArt model
   */ 
  interface MapArtFieldRefs {
    readonly id: FieldRef<"MapArt", 'String'>
    readonly rotations: FieldRef<"MapArt", 'Int[]'>
    readonly createdAt: FieldRef<"MapArt", 'DateTime'>
    readonly updatedAt: FieldRef<"MapArt", 'DateTime'>
    readonly name: FieldRef<"MapArt", 'String'>
    readonly description: FieldRef<"MapArt", 'String'>
    readonly vSize: FieldRef<"MapArt", 'Int'>
    readonly hSize: FieldRef<"MapArt", 'Int'>
  }
    

  // Custom InputTypes

  /**
   * MapArt findUnique
   */
  export type MapArtFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter, which MapArt to fetch.
     */
    where: MapArtWhereUniqueInput
  }


  /**
   * MapArt findUniqueOrThrow
   */
  export type MapArtFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter, which MapArt to fetch.
     */
    where: MapArtWhereUniqueInput
  }


  /**
   * MapArt findFirst
   */
  export type MapArtFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter, which MapArt to fetch.
     */
    where?: MapArtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapArts to fetch.
     */
    orderBy?: MapArtOrderByWithRelationInput | MapArtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MapArts.
     */
    cursor?: MapArtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapArts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapArts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MapArts.
     */
    distinct?: MapArtScalarFieldEnum | MapArtScalarFieldEnum[]
  }


  /**
   * MapArt findFirstOrThrow
   */
  export type MapArtFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter, which MapArt to fetch.
     */
    where?: MapArtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapArts to fetch.
     */
    orderBy?: MapArtOrderByWithRelationInput | MapArtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MapArts.
     */
    cursor?: MapArtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapArts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapArts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MapArts.
     */
    distinct?: MapArtScalarFieldEnum | MapArtScalarFieldEnum[]
  }


  /**
   * MapArt findMany
   */
  export type MapArtFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter, which MapArts to fetch.
     */
    where?: MapArtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MapArts to fetch.
     */
    orderBy?: MapArtOrderByWithRelationInput | MapArtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MapArts.
     */
    cursor?: MapArtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MapArts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MapArts.
     */
    skip?: number
    distinct?: MapArtScalarFieldEnum | MapArtScalarFieldEnum[]
  }


  /**
   * MapArt create
   */
  export type MapArtCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * The data needed to create a MapArt.
     */
    data: XOR<MapArtCreateInput, MapArtUncheckedCreateInput>
  }


  /**
   * MapArt createMany
   */
  export type MapArtCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MapArts.
     */
    data: MapArtCreateManyInput | MapArtCreateManyInput[]
  }


  /**
   * MapArt update
   */
  export type MapArtUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * The data needed to update a MapArt.
     */
    data: XOR<MapArtUpdateInput, MapArtUncheckedUpdateInput>
    /**
     * Choose, which MapArt to update.
     */
    where: MapArtWhereUniqueInput
  }


  /**
   * MapArt updateMany
   */
  export type MapArtUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MapArts.
     */
    data: XOR<MapArtUpdateManyMutationInput, MapArtUncheckedUpdateManyInput>
    /**
     * Filter which MapArts to update
     */
    where?: MapArtWhereInput
  }


  /**
   * MapArt upsert
   */
  export type MapArtUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * The filter to search for the MapArt to update in case it exists.
     */
    where: MapArtWhereUniqueInput
    /**
     * In case the MapArt found by the `where` argument doesn't exist, create a new MapArt with this data.
     */
    create: XOR<MapArtCreateInput, MapArtUncheckedCreateInput>
    /**
     * In case the MapArt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MapArtUpdateInput, MapArtUncheckedUpdateInput>
  }


  /**
   * MapArt delete
   */
  export type MapArtDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
    /**
     * Filter which MapArt to delete.
     */
    where: MapArtWhereUniqueInput
  }


  /**
   * MapArt deleteMany
   */
  export type MapArtDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MapArts to delete
     */
    where?: MapArtWhereInput
  }


  /**
   * MapArt findRaw
   */
  export type MapArtFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * MapArt aggregateRaw
   */
  export type MapArtAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }


  /**
   * MapArt.mapIds
   */
  export type MapArt$mapIdsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapId
     */
    select?: MapIdSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapIdInclude<ExtArgs> | null
    where?: MapIdWhereInput
    orderBy?: MapIdOrderByWithRelationInput | MapIdOrderByWithRelationInput[]
    cursor?: MapIdWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MapIdScalarFieldEnum | MapIdScalarFieldEnum[]
  }


  /**
   * MapArt without action
   */
  export type MapArtDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MapArt
     */
    select?: MapArtSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: MapArtInclude<ExtArgs> | null
  }



  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    username: 'username',
    hashedPw: 'hashedPw',
    mcUuid: 'mcUuid',
    discordId: 'discordId'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MapIdScalarFieldEnum: {
    id: 'id',
    name: 'name',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    data: 'data',
    imgUrl: 'imgUrl',
    creator: 'creator',
    mapId: 'mapId'
  };

  export type MapIdScalarFieldEnum = (typeof MapIdScalarFieldEnum)[keyof typeof MapIdScalarFieldEnum]


  export const MapArtScalarFieldEnum: {
    id: 'id',
    rotations: 'rotations',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    name: 'name',
    description: 'description',
    vSize: 'vSize',
    hSize: 'hSize'
  };

  export type MapArtScalarFieldEnum = (typeof MapArtScalarFieldEnum)[keyof typeof MapArtScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    username?: StringFilter<"User"> | string
    hashedPw?: StringFilter<"User"> | string
    mcUuid?: StringFilter<"User"> | string
    discordId?: StringFilter<"User"> | string
    mapIds?: MapIdListRelationFilter
    maps?: MapArtListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    hashedPw?: SortOrder
    mcUuid?: SortOrder
    discordId?: SortOrder
    mapIds?: MapIdOrderByRelationAggregateInput
    maps?: MapArtOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    hashedPw?: StringFilter<"User"> | string
    mcUuid?: StringFilter<"User"> | string
    discordId?: StringFilter<"User"> | string
    mapIds?: MapIdListRelationFilter
    maps?: MapArtListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    hashedPw?: SortOrder
    mcUuid?: SortOrder
    discordId?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    username?: StringWithAggregatesFilter<"User"> | string
    hashedPw?: StringWithAggregatesFilter<"User"> | string
    mcUuid?: StringWithAggregatesFilter<"User"> | string
    discordId?: StringWithAggregatesFilter<"User"> | string
  }

  export type MapIdWhereInput = {
    AND?: MapIdWhereInput | MapIdWhereInput[]
    OR?: MapIdWhereInput[]
    NOT?: MapIdWhereInput | MapIdWhereInput[]
    id?: StringFilter<"MapId"> | string
    name?: StringFilter<"MapId"> | string
    ownerId?: StringFilter<"MapId"> | string
    createdAt?: DateTimeFilter<"MapId"> | Date | string
    updatedAt?: DateTimeFilter<"MapId"> | Date | string
    data?: StringFilter<"MapId"> | string
    imgUrl?: StringFilter<"MapId"> | string
    creator?: StringFilter<"MapId"> | string
    mapId?: StringNullableFilter<"MapId"> | string | null
    owner?: XOR<UserRelationFilter, UserWhereInput>
    Map?: XOR<MapArtNullableRelationFilter, MapArtWhereInput> | null
  }

  export type MapIdOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    imgUrl?: SortOrder
    creator?: SortOrder
    mapId?: SortOrder
    owner?: UserOrderByWithRelationInput
    Map?: MapArtOrderByWithRelationInput
  }

  export type MapIdWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    data?: string
    AND?: MapIdWhereInput | MapIdWhereInput[]
    OR?: MapIdWhereInput[]
    NOT?: MapIdWhereInput | MapIdWhereInput[]
    name?: StringFilter<"MapId"> | string
    ownerId?: StringFilter<"MapId"> | string
    createdAt?: DateTimeFilter<"MapId"> | Date | string
    updatedAt?: DateTimeFilter<"MapId"> | Date | string
    imgUrl?: StringFilter<"MapId"> | string
    creator?: StringFilter<"MapId"> | string
    mapId?: StringNullableFilter<"MapId"> | string | null
    owner?: XOR<UserRelationFilter, UserWhereInput>
    Map?: XOR<MapArtNullableRelationFilter, MapArtWhereInput> | null
  }, "id" | "data">

  export type MapIdOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    imgUrl?: SortOrder
    creator?: SortOrder
    mapId?: SortOrder
    _count?: MapIdCountOrderByAggregateInput
    _max?: MapIdMaxOrderByAggregateInput
    _min?: MapIdMinOrderByAggregateInput
  }

  export type MapIdScalarWhereWithAggregatesInput = {
    AND?: MapIdScalarWhereWithAggregatesInput | MapIdScalarWhereWithAggregatesInput[]
    OR?: MapIdScalarWhereWithAggregatesInput[]
    NOT?: MapIdScalarWhereWithAggregatesInput | MapIdScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MapId"> | string
    name?: StringWithAggregatesFilter<"MapId"> | string
    ownerId?: StringWithAggregatesFilter<"MapId"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MapId"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MapId"> | Date | string
    data?: StringWithAggregatesFilter<"MapId"> | string
    imgUrl?: StringWithAggregatesFilter<"MapId"> | string
    creator?: StringWithAggregatesFilter<"MapId"> | string
    mapId?: StringNullableWithAggregatesFilter<"MapId"> | string | null
  }

  export type MapArtWhereInput = {
    AND?: MapArtWhereInput | MapArtWhereInput[]
    OR?: MapArtWhereInput[]
    NOT?: MapArtWhereInput | MapArtWhereInput[]
    id?: StringFilter<"MapArt"> | string
    rotations?: IntNullableListFilter<"MapArt">
    createdAt?: DateTimeFilter<"MapArt"> | Date | string
    updatedAt?: DateTimeFilter<"MapArt"> | Date | string
    name?: StringFilter<"MapArt"> | string
    description?: StringFilter<"MapArt"> | string
    vSize?: IntFilter<"MapArt"> | number
    hSize?: IntFilter<"MapArt"> | number
    creator?: XOR<UserRelationFilter, UserWhereInput>
    mapIds?: MapIdListRelationFilter
  }

  export type MapArtOrderByWithRelationInput = {
    id?: SortOrder
    rotations?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
    creator?: UserOrderByWithRelationInput
    mapIds?: MapIdOrderByRelationAggregateInput
  }

  export type MapArtWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MapArtWhereInput | MapArtWhereInput[]
    OR?: MapArtWhereInput[]
    NOT?: MapArtWhereInput | MapArtWhereInput[]
    rotations?: IntNullableListFilter<"MapArt">
    createdAt?: DateTimeFilter<"MapArt"> | Date | string
    updatedAt?: DateTimeFilter<"MapArt"> | Date | string
    name?: StringFilter<"MapArt"> | string
    description?: StringFilter<"MapArt"> | string
    vSize?: IntFilter<"MapArt"> | number
    hSize?: IntFilter<"MapArt"> | number
    creator?: XOR<UserRelationFilter, UserWhereInput>
    mapIds?: MapIdListRelationFilter
  }, "id">

  export type MapArtOrderByWithAggregationInput = {
    id?: SortOrder
    rotations?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
    _count?: MapArtCountOrderByAggregateInput
    _avg?: MapArtAvgOrderByAggregateInput
    _max?: MapArtMaxOrderByAggregateInput
    _min?: MapArtMinOrderByAggregateInput
    _sum?: MapArtSumOrderByAggregateInput
  }

  export type MapArtScalarWhereWithAggregatesInput = {
    AND?: MapArtScalarWhereWithAggregatesInput | MapArtScalarWhereWithAggregatesInput[]
    OR?: MapArtScalarWhereWithAggregatesInput[]
    NOT?: MapArtScalarWhereWithAggregatesInput | MapArtScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MapArt"> | string
    rotations?: IntNullableListFilter<"MapArt">
    createdAt?: DateTimeWithAggregatesFilter<"MapArt"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MapArt"> | Date | string
    name?: StringWithAggregatesFilter<"MapArt"> | string
    description?: StringWithAggregatesFilter<"MapArt"> | string
    vSize?: IntWithAggregatesFilter<"MapArt"> | number
    hSize?: IntWithAggregatesFilter<"MapArt"> | number
  }

  export type UserCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    mapIds?: MapIdCreateNestedManyWithoutOwnerInput
    maps?: MapArtCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    mapIds?: MapIdUncheckedCreateNestedManyWithoutOwnerInput
    maps?: MapArtUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    mapIds?: MapIdUpdateManyWithoutOwnerNestedInput
    maps?: MapArtUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    mapIds?: MapIdUncheckedUpdateManyWithoutOwnerNestedInput
    maps?: MapArtUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
  }

  export type UserUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
  }

  export type MapIdCreateInput = {
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    owner?: UserCreateNestedOneWithoutMapIdsInput
    Map?: MapArtCreateNestedOneWithoutMapIdsInput
  }

  export type MapIdUncheckedCreateInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    mapId?: string | null
  }

  export type MapIdUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    owner?: UserUpdateOneRequiredWithoutMapIdsNestedInput
    Map?: MapArtUpdateOneWithoutMapIdsNestedInput
  }

  export type MapIdUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    mapId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MapIdCreateManyInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    mapId?: string | null
  }

  export type MapIdUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
  }

  export type MapIdUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    mapId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MapArtCreateInput = {
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
    creator?: UserCreateNestedOneWithoutMapsInput
    mapIds?: MapIdCreateNestedManyWithoutMapInput
  }

  export type MapArtUncheckedCreateInput = {
    id?: string
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
    mapIds?: MapIdUncheckedCreateNestedManyWithoutMapInput
  }

  export type MapArtUpdateInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
    creator?: UserUpdateOneRequiredWithoutMapsNestedInput
    mapIds?: MapIdUpdateManyWithoutMapNestedInput
  }

  export type MapArtUncheckedUpdateInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
    mapIds?: MapIdUncheckedUpdateManyWithoutMapNestedInput
  }

  export type MapArtCreateManyInput = {
    id?: string
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
  }

  export type MapArtUpdateManyMutationInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
  }

  export type MapArtUncheckedUpdateManyInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type MapIdListRelationFilter = {
    every?: MapIdWhereInput
    some?: MapIdWhereInput
    none?: MapIdWhereInput
  }

  export type MapArtListRelationFilter = {
    every?: MapArtWhereInput
    some?: MapArtWhereInput
    none?: MapArtWhereInput
  }

  export type MapIdOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MapArtOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    hashedPw?: SortOrder
    mcUuid?: SortOrder
    discordId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    hashedPw?: SortOrder
    mcUuid?: SortOrder
    discordId?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    username?: SortOrder
    hashedPw?: SortOrder
    mcUuid?: SortOrder
    discordId?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MapArtNullableRelationFilter = {
    is?: MapArtWhereInput | null
    isNot?: MapArtWhereInput | null
  }

  export type MapIdCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    imgUrl?: SortOrder
    creator?: SortOrder
    mapId?: SortOrder
  }

  export type MapIdMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    imgUrl?: SortOrder
    creator?: SortOrder
    mapId?: SortOrder
  }

  export type MapIdMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    data?: SortOrder
    imgUrl?: SortOrder
    creator?: SortOrder
    mapId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type IntNullableListFilter<$PrismaModel = never> = {
    equals?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    has?: number | IntFieldRefInput<$PrismaModel> | null
    hasEvery?: number[] | ListIntFieldRefInput<$PrismaModel>
    hasSome?: number[] | ListIntFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type MapArtCountOrderByAggregateInput = {
    id?: SortOrder
    rotations?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
  }

  export type MapArtAvgOrderByAggregateInput = {
    rotations?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
  }

  export type MapArtMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
  }

  export type MapArtMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    description?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
  }

  export type MapArtSumOrderByAggregateInput = {
    rotations?: SortOrder
    vSize?: SortOrder
    hSize?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type MapIdCreateNestedManyWithoutOwnerInput = {
    create?: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput> | MapIdCreateWithoutOwnerInput[] | MapIdUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutOwnerInput | MapIdCreateOrConnectWithoutOwnerInput[]
    createMany?: MapIdCreateManyOwnerInputEnvelope
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
  }

  export type MapArtCreateNestedManyWithoutCreatorInput = {
    create?: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput> | MapArtCreateWithoutCreatorInput[] | MapArtUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: MapArtCreateOrConnectWithoutCreatorInput | MapArtCreateOrConnectWithoutCreatorInput[]
    createMany?: MapArtCreateManyCreatorInputEnvelope
    connect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
  }

  export type MapIdUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput> | MapIdCreateWithoutOwnerInput[] | MapIdUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutOwnerInput | MapIdCreateOrConnectWithoutOwnerInput[]
    createMany?: MapIdCreateManyOwnerInputEnvelope
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
  }

  export type MapArtUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput> | MapArtCreateWithoutCreatorInput[] | MapArtUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: MapArtCreateOrConnectWithoutCreatorInput | MapArtCreateOrConnectWithoutCreatorInput[]
    createMany?: MapArtCreateManyCreatorInputEnvelope
    connect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type MapIdUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput> | MapIdCreateWithoutOwnerInput[] | MapIdUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutOwnerInput | MapIdCreateOrConnectWithoutOwnerInput[]
    upsert?: MapIdUpsertWithWhereUniqueWithoutOwnerInput | MapIdUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: MapIdCreateManyOwnerInputEnvelope
    set?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    disconnect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    delete?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    update?: MapIdUpdateWithWhereUniqueWithoutOwnerInput | MapIdUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: MapIdUpdateManyWithWhereWithoutOwnerInput | MapIdUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
  }

  export type MapArtUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput> | MapArtCreateWithoutCreatorInput[] | MapArtUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: MapArtCreateOrConnectWithoutCreatorInput | MapArtCreateOrConnectWithoutCreatorInput[]
    upsert?: MapArtUpsertWithWhereUniqueWithoutCreatorInput | MapArtUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: MapArtCreateManyCreatorInputEnvelope
    set?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    disconnect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    delete?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    connect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    update?: MapArtUpdateWithWhereUniqueWithoutCreatorInput | MapArtUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: MapArtUpdateManyWithWhereWithoutCreatorInput | MapArtUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: MapArtScalarWhereInput | MapArtScalarWhereInput[]
  }

  export type MapIdUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput> | MapIdCreateWithoutOwnerInput[] | MapIdUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutOwnerInput | MapIdCreateOrConnectWithoutOwnerInput[]
    upsert?: MapIdUpsertWithWhereUniqueWithoutOwnerInput | MapIdUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: MapIdCreateManyOwnerInputEnvelope
    set?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    disconnect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    delete?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    update?: MapIdUpdateWithWhereUniqueWithoutOwnerInput | MapIdUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: MapIdUpdateManyWithWhereWithoutOwnerInput | MapIdUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
  }

  export type MapArtUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput> | MapArtCreateWithoutCreatorInput[] | MapArtUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: MapArtCreateOrConnectWithoutCreatorInput | MapArtCreateOrConnectWithoutCreatorInput[]
    upsert?: MapArtUpsertWithWhereUniqueWithoutCreatorInput | MapArtUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: MapArtCreateManyCreatorInputEnvelope
    set?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    disconnect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    delete?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    connect?: MapArtWhereUniqueInput | MapArtWhereUniqueInput[]
    update?: MapArtUpdateWithWhereUniqueWithoutCreatorInput | MapArtUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: MapArtUpdateManyWithWhereWithoutCreatorInput | MapArtUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: MapArtScalarWhereInput | MapArtScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMapIdsInput = {
    create?: XOR<UserCreateWithoutMapIdsInput, UserUncheckedCreateWithoutMapIdsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapIdsInput
    connect?: UserWhereUniqueInput
  }

  export type MapArtCreateNestedOneWithoutMapIdsInput = {
    create?: XOR<MapArtCreateWithoutMapIdsInput, MapArtUncheckedCreateWithoutMapIdsInput>
    connectOrCreate?: MapArtCreateOrConnectWithoutMapIdsInput
    connect?: MapArtWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMapIdsNestedInput = {
    create?: XOR<UserCreateWithoutMapIdsInput, UserUncheckedCreateWithoutMapIdsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapIdsInput
    upsert?: UserUpsertWithoutMapIdsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMapIdsInput, UserUpdateWithoutMapIdsInput>, UserUncheckedUpdateWithoutMapIdsInput>
  }

  export type MapArtUpdateOneWithoutMapIdsNestedInput = {
    create?: XOR<MapArtCreateWithoutMapIdsInput, MapArtUncheckedCreateWithoutMapIdsInput>
    connectOrCreate?: MapArtCreateOrConnectWithoutMapIdsInput
    upsert?: MapArtUpsertWithoutMapIdsInput
    disconnect?: boolean
    delete?: MapArtWhereInput | boolean
    connect?: MapArtWhereUniqueInput
    update?: XOR<XOR<MapArtUpdateToOneWithWhereWithoutMapIdsInput, MapArtUpdateWithoutMapIdsInput>, MapArtUncheckedUpdateWithoutMapIdsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type MapArtCreaterotationsInput = {
    set: number[]
  }

  export type UserCreateNestedOneWithoutMapsInput = {
    create?: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapsInput
    connect?: UserWhereUniqueInput
  }

  export type MapIdCreateNestedManyWithoutMapInput = {
    create?: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput> | MapIdCreateWithoutMapInput[] | MapIdUncheckedCreateWithoutMapInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutMapInput | MapIdCreateOrConnectWithoutMapInput[]
    createMany?: MapIdCreateManyMapInputEnvelope
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
  }

  export type MapIdUncheckedCreateNestedManyWithoutMapInput = {
    create?: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput> | MapIdCreateWithoutMapInput[] | MapIdUncheckedCreateWithoutMapInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutMapInput | MapIdCreateOrConnectWithoutMapInput[]
    createMany?: MapIdCreateManyMapInputEnvelope
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
  }

  export type MapArtUpdaterotationsInput = {
    set?: number[]
    push?: number | number[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutMapsNestedInput = {
    create?: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    connectOrCreate?: UserCreateOrConnectWithoutMapsInput
    upsert?: UserUpsertWithoutMapsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMapsInput, UserUpdateWithoutMapsInput>, UserUncheckedUpdateWithoutMapsInput>
  }

  export type MapIdUpdateManyWithoutMapNestedInput = {
    create?: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput> | MapIdCreateWithoutMapInput[] | MapIdUncheckedCreateWithoutMapInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutMapInput | MapIdCreateOrConnectWithoutMapInput[]
    upsert?: MapIdUpsertWithWhereUniqueWithoutMapInput | MapIdUpsertWithWhereUniqueWithoutMapInput[]
    createMany?: MapIdCreateManyMapInputEnvelope
    set?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    disconnect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    delete?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    update?: MapIdUpdateWithWhereUniqueWithoutMapInput | MapIdUpdateWithWhereUniqueWithoutMapInput[]
    updateMany?: MapIdUpdateManyWithWhereWithoutMapInput | MapIdUpdateManyWithWhereWithoutMapInput[]
    deleteMany?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
  }

  export type MapIdUncheckedUpdateManyWithoutMapNestedInput = {
    create?: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput> | MapIdCreateWithoutMapInput[] | MapIdUncheckedCreateWithoutMapInput[]
    connectOrCreate?: MapIdCreateOrConnectWithoutMapInput | MapIdCreateOrConnectWithoutMapInput[]
    upsert?: MapIdUpsertWithWhereUniqueWithoutMapInput | MapIdUpsertWithWhereUniqueWithoutMapInput[]
    createMany?: MapIdCreateManyMapInputEnvelope
    set?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    disconnect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    delete?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    connect?: MapIdWhereUniqueInput | MapIdWhereUniqueInput[]
    update?: MapIdUpdateWithWhereUniqueWithoutMapInput | MapIdUpdateWithWhereUniqueWithoutMapInput[]
    updateMany?: MapIdUpdateManyWithWhereWithoutMapInput | MapIdUpdateManyWithWhereWithoutMapInput[]
    deleteMany?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type MapIdCreateWithoutOwnerInput = {
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    Map?: MapArtCreateNestedOneWithoutMapIdsInput
  }

  export type MapIdUncheckedCreateWithoutOwnerInput = {
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    mapId?: string | null
  }

  export type MapIdCreateOrConnectWithoutOwnerInput = {
    where: MapIdWhereUniqueInput
    create: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput>
  }

  export type MapIdCreateManyOwnerInputEnvelope = {
    data: MapIdCreateManyOwnerInput | MapIdCreateManyOwnerInput[]
  }

  export type MapArtCreateWithoutCreatorInput = {
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
    mapIds?: MapIdCreateNestedManyWithoutMapInput
  }

  export type MapArtUncheckedCreateWithoutCreatorInput = {
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
    mapIds?: MapIdUncheckedCreateNestedManyWithoutMapInput
  }

  export type MapArtCreateOrConnectWithoutCreatorInput = {
    where: MapArtWhereUniqueInput
    create: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput>
  }

  export type MapArtCreateManyCreatorInputEnvelope = {
    data: MapArtCreateManyCreatorInput | MapArtCreateManyCreatorInput[]
  }

  export type MapIdUpsertWithWhereUniqueWithoutOwnerInput = {
    where: MapIdWhereUniqueInput
    update: XOR<MapIdUpdateWithoutOwnerInput, MapIdUncheckedUpdateWithoutOwnerInput>
    create: XOR<MapIdCreateWithoutOwnerInput, MapIdUncheckedCreateWithoutOwnerInput>
  }

  export type MapIdUpdateWithWhereUniqueWithoutOwnerInput = {
    where: MapIdWhereUniqueInput
    data: XOR<MapIdUpdateWithoutOwnerInput, MapIdUncheckedUpdateWithoutOwnerInput>
  }

  export type MapIdUpdateManyWithWhereWithoutOwnerInput = {
    where: MapIdScalarWhereInput
    data: XOR<MapIdUpdateManyMutationInput, MapIdUncheckedUpdateManyWithoutOwnerInput>
  }

  export type MapIdScalarWhereInput = {
    AND?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
    OR?: MapIdScalarWhereInput[]
    NOT?: MapIdScalarWhereInput | MapIdScalarWhereInput[]
    id?: StringFilter<"MapId"> | string
    name?: StringFilter<"MapId"> | string
    ownerId?: StringFilter<"MapId"> | string
    createdAt?: DateTimeFilter<"MapId"> | Date | string
    updatedAt?: DateTimeFilter<"MapId"> | Date | string
    data?: StringFilter<"MapId"> | string
    imgUrl?: StringFilter<"MapId"> | string
    creator?: StringFilter<"MapId"> | string
    mapId?: StringNullableFilter<"MapId"> | string | null
  }

  export type MapArtUpsertWithWhereUniqueWithoutCreatorInput = {
    where: MapArtWhereUniqueInput
    update: XOR<MapArtUpdateWithoutCreatorInput, MapArtUncheckedUpdateWithoutCreatorInput>
    create: XOR<MapArtCreateWithoutCreatorInput, MapArtUncheckedCreateWithoutCreatorInput>
  }

  export type MapArtUpdateWithWhereUniqueWithoutCreatorInput = {
    where: MapArtWhereUniqueInput
    data: XOR<MapArtUpdateWithoutCreatorInput, MapArtUncheckedUpdateWithoutCreatorInput>
  }

  export type MapArtUpdateManyWithWhereWithoutCreatorInput = {
    where: MapArtScalarWhereInput
    data: XOR<MapArtUpdateManyMutationInput, MapArtUncheckedUpdateManyWithoutCreatorInput>
  }

  export type MapArtScalarWhereInput = {
    AND?: MapArtScalarWhereInput | MapArtScalarWhereInput[]
    OR?: MapArtScalarWhereInput[]
    NOT?: MapArtScalarWhereInput | MapArtScalarWhereInput[]
    id?: StringFilter<"MapArt"> | string
    rotations?: IntNullableListFilter<"MapArt">
    createdAt?: DateTimeFilter<"MapArt"> | Date | string
    updatedAt?: DateTimeFilter<"MapArt"> | Date | string
    name?: StringFilter<"MapArt"> | string
    description?: StringFilter<"MapArt"> | string
    vSize?: IntFilter<"MapArt"> | number
    hSize?: IntFilter<"MapArt"> | number
  }

  export type UserCreateWithoutMapIdsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    maps?: MapArtCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutMapIdsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    maps?: MapArtUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutMapIdsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMapIdsInput, UserUncheckedCreateWithoutMapIdsInput>
  }

  export type MapArtCreateWithoutMapIdsInput = {
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
    creator?: UserCreateNestedOneWithoutMapsInput
  }

  export type MapArtUncheckedCreateWithoutMapIdsInput = {
    id?: string
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
  }

  export type MapArtCreateOrConnectWithoutMapIdsInput = {
    where: MapArtWhereUniqueInput
    create: XOR<MapArtCreateWithoutMapIdsInput, MapArtUncheckedCreateWithoutMapIdsInput>
  }

  export type UserUpsertWithoutMapIdsInput = {
    update: XOR<UserUpdateWithoutMapIdsInput, UserUncheckedUpdateWithoutMapIdsInput>
    create: XOR<UserCreateWithoutMapIdsInput, UserUncheckedCreateWithoutMapIdsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMapIdsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMapIdsInput, UserUncheckedUpdateWithoutMapIdsInput>
  }

  export type UserUpdateWithoutMapIdsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    maps?: MapArtUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutMapIdsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    maps?: MapArtUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type MapArtUpsertWithoutMapIdsInput = {
    update: XOR<MapArtUpdateWithoutMapIdsInput, MapArtUncheckedUpdateWithoutMapIdsInput>
    create: XOR<MapArtCreateWithoutMapIdsInput, MapArtUncheckedCreateWithoutMapIdsInput>
    where?: MapArtWhereInput
  }

  export type MapArtUpdateToOneWithWhereWithoutMapIdsInput = {
    where?: MapArtWhereInput
    data: XOR<MapArtUpdateWithoutMapIdsInput, MapArtUncheckedUpdateWithoutMapIdsInput>
  }

  export type MapArtUpdateWithoutMapIdsInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
    creator?: UserUpdateOneRequiredWithoutMapsNestedInput
  }

  export type MapArtUncheckedUpdateWithoutMapIdsInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateWithoutMapsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    mapIds?: MapIdCreateNestedManyWithoutOwnerInput
  }

  export type UserUncheckedCreateWithoutMapsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    username: string
    hashedPw: string
    mcUuid: string
    discordId: string
    mapIds?: MapIdUncheckedCreateNestedManyWithoutOwnerInput
  }

  export type UserCreateOrConnectWithoutMapsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
  }

  export type MapIdCreateWithoutMapInput = {
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    owner?: UserCreateNestedOneWithoutMapIdsInput
  }

  export type MapIdUncheckedCreateWithoutMapInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
  }

  export type MapIdCreateOrConnectWithoutMapInput = {
    where: MapIdWhereUniqueInput
    create: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput>
  }

  export type MapIdCreateManyMapInputEnvelope = {
    data: MapIdCreateManyMapInput | MapIdCreateManyMapInput[]
  }

  export type UserUpsertWithoutMapsInput = {
    update: XOR<UserUpdateWithoutMapsInput, UserUncheckedUpdateWithoutMapsInput>
    create: XOR<UserCreateWithoutMapsInput, UserUncheckedCreateWithoutMapsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMapsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMapsInput, UserUncheckedUpdateWithoutMapsInput>
  }

  export type UserUpdateWithoutMapsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    mapIds?: MapIdUpdateManyWithoutOwnerNestedInput
  }

  export type UserUncheckedUpdateWithoutMapsInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    username?: StringFieldUpdateOperationsInput | string
    hashedPw?: StringFieldUpdateOperationsInput | string
    mcUuid?: StringFieldUpdateOperationsInput | string
    discordId?: StringFieldUpdateOperationsInput | string
    mapIds?: MapIdUncheckedUpdateManyWithoutOwnerNestedInput
  }

  export type MapIdUpsertWithWhereUniqueWithoutMapInput = {
    where: MapIdWhereUniqueInput
    update: XOR<MapIdUpdateWithoutMapInput, MapIdUncheckedUpdateWithoutMapInput>
    create: XOR<MapIdCreateWithoutMapInput, MapIdUncheckedCreateWithoutMapInput>
  }

  export type MapIdUpdateWithWhereUniqueWithoutMapInput = {
    where: MapIdWhereUniqueInput
    data: XOR<MapIdUpdateWithoutMapInput, MapIdUncheckedUpdateWithoutMapInput>
  }

  export type MapIdUpdateManyWithWhereWithoutMapInput = {
    where: MapIdScalarWhereInput
    data: XOR<MapIdUpdateManyMutationInput, MapIdUncheckedUpdateManyWithoutMapInput>
  }

  export type MapIdCreateManyOwnerInput = {
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
    mapId?: string | null
  }

  export type MapArtCreateManyCreatorInput = {
    rotations?: MapArtCreaterotationsInput | number[]
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    description: string
    vSize: number
    hSize: number
  }

  export type MapIdUpdateWithoutOwnerInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    Map?: MapArtUpdateOneWithoutMapIdsNestedInput
  }

  export type MapIdUncheckedUpdateWithoutOwnerInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    mapId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MapIdUncheckedUpdateManyWithoutOwnerInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    mapId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MapArtUpdateWithoutCreatorInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
    mapIds?: MapIdUpdateManyWithoutMapNestedInput
  }

  export type MapArtUncheckedUpdateWithoutCreatorInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
    mapIds?: MapIdUncheckedUpdateManyWithoutMapNestedInput
  }

  export type MapArtUncheckedUpdateManyWithoutCreatorInput = {
    rotations?: MapArtUpdaterotationsInput | number[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    vSize?: IntFieldUpdateOperationsInput | number
    hSize?: IntFieldUpdateOperationsInput | number
  }

  export type MapIdCreateManyMapInput = {
    id?: string
    name: string
    ownerId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    data: string
    imgUrl: string
    creator: string
  }

  export type MapIdUpdateWithoutMapInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    owner?: UserUpdateOneRequiredWithoutMapIdsNestedInput
  }

  export type MapIdUncheckedUpdateWithoutMapInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
  }

  export type MapIdUncheckedUpdateManyWithoutMapInput = {
    name?: StringFieldUpdateOperationsInput | string
    ownerId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    data?: StringFieldUpdateOperationsInput | string
    imgUrl?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MapArtCountOutputTypeDefaultArgs instead
     */
    export type MapArtCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MapArtCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MapIdDefaultArgs instead
     */
    export type MapIdArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MapIdDefaultArgs<ExtArgs>
    /**
     * @deprecated Use MapArtDefaultArgs instead
     */
    export type MapArtArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = MapArtDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}