import { assert } from "console";
import { Subject } from "rxjs";
import { ReaderGuacamoleReader } from "../../src/io/ReaderGuacamoleReader";

describe("ReaderGuacamoleReader", () => {
    let sb: Subject<Buffer>;
    beforeEach(() => {
        sb = new Subject();
    });
    it("create ok", () => {
        expect(new ReaderGuacamoleReader(sb.asObservable())).toBeInstanceOf(ReaderGuacamoleReader);
    })
    it("can read message",(done)=>{
       let rgl= new ReaderGuacamoleReader(sb.asObservable());
       rgl.read().subscribe(bf=>{
           expect(bf.toString()).toMatch("2.ok;");
           done();
       });
       sb.next(Buffer.from("2.ok;"));
    })
    it("can read buffer msg",(done)=>{
        let rgl= new ReaderGuacamoleReader(sb.asObservable(),3);
        rgl.read().subscribe(bf=>{
            expect(bf.toString()).toMatch("4.send,3.msg;");
            done();
        });
        sb.next(Buffer.from("4.send"));
        sb.next(Buffer.from(",3.msg;"))
     })

     it("can read instruction",(done)=>{
        let rgl= new ReaderGuacamoleReader(sb.asObservable(),3);
        rgl.readInstruction().subscribe(bf=>{
            expect(bf.opcode).toMatch("select");
            expect(bf.args.length).toEqual(1);
            expect(bf.args[0]).toMatch("rdp")
            done();
        });
        sb.next(Buffer.from("6.select"));
        sb.next(Buffer.from(",3.rdp;"))
     })
})