import { AbstractConstructor } from "./AbstractConstructor";

export abstract class Container {
    abstract resolve<Service>(service: AbstractConstructor<Service>): Service;
}