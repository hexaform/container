export abstract class Container {
    abstract construct<Service>(serviceInterface: any): Service;
    abstract resolve<Service>(serviceInterface: any): Service;
}