export abstract class Container {
    abstract resolve<Service>(service: Function & { readonly prototype: Service }): Service;
}