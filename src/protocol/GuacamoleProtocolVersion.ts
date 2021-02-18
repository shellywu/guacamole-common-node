export class GuacamoleProtocolVersion {
    static readonly VERSION_1_0_0 = new GuacamoleProtocolVersion(1, 0, 0);
    static readonly VERSION_1_1_0 = new GuacamoleProtocolVersion(1, 1, 0);
    static readonly VERSION_1_3_0 = new GuacamoleProtocolVersion(1, 3, 0);
    static readonly LATEST = new GuacamoleProtocolVersion(1, 3, 0);
    static readonly VERSION_PATTERN = /^VERSION_([0-9]+)_([0-9]+)_([0-9]+)$/i;
    /**
     *
     */
    constructor(private _major: number, private _minor: number, private _patch: number) {

    }
    get major() {
        return this._major;
    }
    get minor() {
        return this._minor;
    }
    get patch() {
        return this._patch;
    }
    atLeast(otherVersion: GuacamoleProtocolVersion) {
        if (this.major != otherVersion.major) {
            return this.major > otherVersion.major;
        }
        if (this.minor != otherVersion.minor) {
            return this.minor > otherVersion.minor;
        }
        return this.patch >= otherVersion.patch;
    }

    static parseVersion(version: string) {
        if (!this.VERSION_PATTERN.test(version)) {
            return null;
        }
        var r = this.VERSION_PATTERN.exec(version);
        if(!r){
            throw Error("version error:"+version);
        }
        return new GuacamoleProtocolVersion(
            parseInt(r![1]),
            parseInt(r![2]),
            parseInt(r![3]));
    }
    toString() {
        return `VERSION_${this.major}_${this.minor}_${this.patch}`
    }
}