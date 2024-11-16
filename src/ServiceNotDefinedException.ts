export class ServiceNotDefinedException extends Error {
    constructor(service: string) {
        super(`Service not defined: ${service}`);
    }
}