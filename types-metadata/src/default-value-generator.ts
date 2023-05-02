export class DefaultValueGenerator<T, TProp> {
    generator:(instance:T) => TProp;
}