import { Container } from "./Container";

export class SingletonContainer implements Container {
    private declarations: Map<any, any>;
    private instances: Map<any, any>;

    constructor() {
        this.declarations = new Map();
        this.instances = new Map();
    }

    protected instantiate<Service>(service: any): Service {
        let dependencies = service.prototype ? (service.prototype["reflect:paramtypes"] || []).map((dependency: any) => {
            return this.resolve(dependency);
        }) : [];
        try {
            return Reflect.construct(service, dependencies);
        } catch (e) {
            return Reflect.apply(service, undefined, dependencies);
        }
    }

    register(serviceInterface: any, serviceImplementation: Function): void {
        this.declarations.set(serviceInterface, serviceImplementation);
    }

    resolve<Service>(serviceInterface: Function & { readonly prototype: Service }): Service {
        if (serviceInterface == Container as unknown as { prototype: Service }) return this as unknown as Service;

        if (!this.instances.has(serviceInterface)) {
            let serviceInstance = this.declarations.has(serviceInterface) ?
                this.instantiate<Service>(this.declarations.get(serviceInterface)) :
                this.instantiate<Service>(serviceInterface);

            let target = this.declarations.get(serviceInterface) || serviceInterface;

            this.instances.set(serviceInterface, serviceInstance);
        }

        return this.instances.get(serviceInterface);
    }
}