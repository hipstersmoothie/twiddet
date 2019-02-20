declare module '@flatten/array' {
  function flatten<P>(arr: P[][]): P[];
  export = flatten;
}
