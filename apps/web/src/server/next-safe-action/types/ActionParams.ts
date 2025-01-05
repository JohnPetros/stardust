export type ActionParams<Action extends (...params: any) => any> = Parameters<Action>[0]
