export class GuacamoleConfiguration {
    private _connectionId: string;
    get connectionId() {
        return this._connectionId;
    }

    set connectionId(id: string) {
        this._connectionId = id;
    }

    private _protocol: string;
    get protocol() {
        return this._protocol;
    }
    set protocol(prot: string) {
        this._protocol = prot;
    }

    private _parameters: Map<string, string>;
    getParameter(name: string) {
        return this._parameters.get(name);
    }
    setParameter(name: string, value: string) {
        this._parameters.set(name, value);

    }

    getParameterNames() {
        return this._parameters.keys();
    }
    getParameters() {
        return this._parameters;
    }
    setParameters(params: Map<string, string>) {
        this._parameters.clear();
        params.forEach((k, v) => {
            this._parameters.set(k, v);
        });
    }
    /**
     *
     */
    constructor(config?: GuacamoleConfiguration) {
        this._protocol="";
        this._connectionId="";
        this._parameters=new Map();
        if (config) {

            this._protocol = config.protocol;
            this._connectionId = config.connectionId;
            config.getParameters().forEach((k, v) => {
                this._parameters.set(k, v);
            });
        }
    }
}