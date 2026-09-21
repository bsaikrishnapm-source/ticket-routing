"use strict";
const assert=require("node:assert/strict");const {test}=require("node:test");const fs=require("node:fs");const vm=require("node:vm");const path=require("node:path");const P=require("./demo/engine.js");const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,"demo/data.js"),"utf8"),context);const data=JSON.parse(JSON.stringify(context.window.DEMO_DATA));const person={tenant:"alpha",role:"support",revoked:false};

test("baseline reproduces original 0.90 result",()=>{const r=P.evaluate(data,.9,false);assert.equal(r.suggested,9);assert.equal(r.wrong_queue,2);assert.equal(r.urgent_misses,1);});
test("override catches T18 without reading truth labels",()=>{const row={...data.find(r=>r.id==="T18"),urgent:false};assert.equal(P.route(row,.9,true).decision,"HUMAN_REVIEW");});
test("override removes original urgent miss",()=>{const r=P.evaluate(data,.9,true);assert.equal(r.urgent_misses,0);assert.equal(r.suggested,8);assert.equal(r.wrong_queue,2);});
test("new hardware hazard wording is escalated",()=>{for(const summary of ["Battery is bulging","Smoke coming from laptop","Burning smell near dock"]){assert.equal(P.route({...data[0],summary},.9,true).decision,"HUMAN_REVIEW");}});
test("ordinary battery request is not escalated by keyword rule",()=>{assert.equal(P.route({...data[0],summary:"Laptop battery will not charge"},.9,true).decision,"SUGGEST_QUEUE");});
test("threshold bounds rejected",()=>{assert.throws(()=>P.evaluate(data,1.1));assert.throws(()=>P.evaluate(data,NaN));});
test("stricter threshold plus override removes constructed failures",()=>{const r=P.evaluate(data,.95,true);assert.equal(r.urgent_misses,0);assert.equal(r.wrong_queue,0);assert.equal(r.suggested,3);});
