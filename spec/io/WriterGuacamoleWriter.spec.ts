import { Observable, of, Subject, Subscriber } from "rxjs"
import { WriterGuacamoleWriter } from "../../src/io/WriterGuacamoleWriter";

describe("WriterGuacamoleWriter",()=>{
    
    it("create instance",()=>{
        expect(new WriterGuacamoleWriter(()=>{})).toBeInstanceOf(WriterGuacamoleWriter)
    })
    it("down message",(done)=>{
       let writer= new WriterGuacamoleWriter(d=>{
        expect(d?.toString()).toMatch("ok");
       });
       of(Buffer.from("ok")).subscribe(d=>{
           writer.write(d);
           done();
       });
    })
})