import { doesNotMatch } from "assert";
import { InetGuacamoleSocket } from "../../src/net/InetGuacamoleSocket"

describe("InetGuacamoleSocket", () => {
    let ip: string;
    let port: number;
    beforeEach(() => {
        ip = "192.168.124.10";
        port = 4822;
    });
    // it("instance create", () => {
    //     let igs=new InetGuacamoleSocket(ip, port);
    //     expect(igs).toBeInstanceOf(InetGuacamoleSocket);
    //     expect(igs.close()).toBeUndefined();
    // })
    it("down up ok", (done) => {
        let igs = new InetGuacamoleSocket(ip, port);
        igs.reader.read().subscribe(d => {console.dir(d);done(); },e=>{console.log(e)});
        igs.writer.write(Buffer.from('6.select,3.rdp;'));
    })
})