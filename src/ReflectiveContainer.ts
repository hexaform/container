import { Container } from "./Container";
import { ServiceNotDefinedException } from "./ServiceNotDefinedException";
import { Constructable } from "./Constructable";
import { ReflectedConstructorParams } from "./ReflectedConstructorParams";

export class ReflectiveContainer implements Container {
    private declarations: Map<any, any>;
    private instances: Map<any, any>;

    constructor() {
        this.declarations = new Map();
        this.instances = new Map();
    }

    instance(serviceInterface: any, serviceInstance: any): void {
        this.instances.set(serviceInterface, serviceInstance);
    }

    register(serviceInterface: any, serviceImplementation: any): void {
        this.declarations.set(serviceInterface, serviceImplementation);
    }

    construct<Service>(serviceInterface: Constructable<Service> & ReflectedConstructorParams): Service {
        if (!this.instances.has(serviceInterface)) {
            let dependencies = serviceInterface.prototype["reflect:paramtypes"] || [];
            let serviceInstance = Reflect.construct(serviceInterface, (dependencies || []).map((dependency: any) => {
                return this.resolve(dependency);
            }));

            this.instance(serviceInterface, serviceInstance);
        }

        return this.instances.get(serviceInterface);
    }

    resolve<Service>(serviceInterface: { readonly prototype: Service }): Service {
        if (serviceInterface == Container as unknown as { prototype: Service }) return this as unknown as Service;

        if (!this.instances.has(serviceInterface)) {
            if (!this.declarations.has(serviceInterface)) {
                let serviceName = (serviceInterface as Function).name;
                throw new ServiceNotDefinedException(serviceName);
            }

            let serviceImplementation = this.declarations.get(serviceInterface);
            let dependencies = serviceImplementation.prototype["reflect:paramtypes"] || [];
            let serviceInstance = Reflect.construct(serviceImplementation, (dependencies || []).map((dependency: any) => {
                return this.resolve(dependency);
            }));

            this.instance(serviceInterface, serviceInstance);
        }

        return this.instances.get(serviceInterface);
    }
}