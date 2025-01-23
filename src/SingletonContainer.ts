import { Container } from "./Container";
import { AbstractConstructor } from "./AbstractConstructor";

export class SingletonContainer implements Container {
    private declarations: Map<any, AbstractConstructor<any>>;
    private instances: Map<any, any>;

    constructor() {
        this.declarations = new Map();
        this.instances = new Map();
    }

    protected instantiate<Service>(service: AbstractConstructor<Service>): Service {
        let dependencies = service.prototype ? (service.prototype["reflect:paramtypes"] || []).map((dependency: any) => {
            return this.resolve(dependency);
        }) : [];
        try {
            return Reflect.construct(service, dependencies);
        } catch (e) {
            return Reflect.apply(service, undefined, dependencies);
        }
    }

    register(serviceInterface: any, serviceImplementation: AbstractConstructor<any>): void {
        this.declarations.set(serviceInterface, serviceImplementation);
    }

    resolve<Service>(serviceInterface: AbstractConstructor<Service>): Service {
        if (serviceInterface == Container) return this as unknown as Service;

        if (!this.instances.has(serviceInterface)) {
            let serviceInstance = this.declarations.has(serviceInterface) ?
                this.instantiate<Service>(this.declarations.get(serviceInterface)) :
                this.instantiate<Service>(serviceInterface);

            this.instances.set(serviceInterface, serviceInstance);
        }

        return this.instances.get(serviceInterface);
    }
}