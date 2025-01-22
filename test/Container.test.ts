import { SingletonContainer } from "../src";

abstract class Logger {
    abstract log(message: string): void;
}
class ConsoleLogger extends Logger {
    log(message: string): void {
        console.log(message);
    }
}

abstract class Repository {
    abstract getLogger(): Logger;
}
class DatabaseRepository extends Repository {
    private logger: Logger;

    constructor(logger: Logger) {
        super();
        this.logger = logger;
    }

    getLogger(): Logger {
        return this.logger;
    }
}
Object.defineProperty(DatabaseRepository.prototype, "reflect:paramtypes", { get() { return [ Logger ]; }});

let arrowFunction = () => undefined;

describe("Container", () => {
    let container = new SingletonContainer();
    container.register(Logger, ConsoleLogger);
    container.register(Repository, DatabaseRepository);
    container.register(arrowFunction, () => "arrow");

    describe("resolve", () => {
        test("returns service instance for a given interface", () => {
            expect(container.resolve(Logger)).toBeInstanceOf(ConsoleLogger);
        });

        test("injects declared dependencies into service instance", () => {
            expect(container.resolve(Repository).getLogger()).toBeInstanceOf(ConsoleLogger);
        });

        test("injects declared dependencies into service instance even if service is not registered", () => {
            expect(container.resolve(DatabaseRepository).getLogger()).toBeInstanceOf(ConsoleLogger);
        });

        test("resolves arrow function by calling it", () => {
            expect(container.resolve(arrowFunction)).toBe("arrow");
        });
    });
});
