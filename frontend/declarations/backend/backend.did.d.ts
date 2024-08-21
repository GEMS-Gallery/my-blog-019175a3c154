import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Post {
  'id' : bigint,
  'title' : string,
  'body' : string,
  'author' : string,
  'timestamp' : Time,
}
export type Time = bigint;
export interface _SERVICE {
  'createPost' : ActorMethod<[string, string, string], bigint>,
  'getPosts' : ActorMethod<[], Array<Post>>,
}
