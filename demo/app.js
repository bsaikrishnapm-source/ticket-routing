"use strict";
const $=id=>document.getElementById(id);
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function num(id){const v=$(id).value;if(v.trim()==="")throw new Error("Enter a value for "+id);return Number(v);}
function field(id,label,value,options){
 const wrap=el("label");wrap.append(el("span",label));let input;
 if(options){input=el("select");for(const item of options){const o=el("option",typeof item==="string"?item:item[1]);o.value=typeof item==="string"?item:item[0];input.append(o);}}
 else{input=el("input");input.type=typeof value==="number"?"number":"text";if(input.type==="number"){input.step="any";input.min="0";}}
 input.id=id;input.value=value;wrap.append(input);$("controls").append(wrap);return input;
}
function button(label,fn,secondary=false){const b=el("button",label,secondary?"secondary":"");b.type="button";b.onclick=()=>{try{$("error").textContent="";fn();}catch(e){$("error").textContent=e.message;}};$("actions").append(b);return b;}
function metric(label,value){const c=el("div",undefined,"metric");c.append(el("span",label),el("strong",String(value)));$("metrics").append(c);}
function clear(){for(const id of ["metrics","results","notes"])$(id).replaceChildren();}
function message(text){$("notes").append(el("p",text));}
function table(title,rows,columns){
 const section=el("section",undefined,"result-section");section.append(el("h2",title));if(!rows.length){section.append(el("p","No records for this scenario."));$("results").append(section);return;}
 const wrap=el("div",undefined,"table-scroll"),t=el("table"),head=el("thead"),hr=el("tr");
 for(const [key,label]of columns)hr.append(el("th",label));head.append(hr);t.append(head);
 const body=el("tbody");for(const row of rows){const tr=el("tr");for(const [key]of columns){const v=row[key];tr.append(el("td",v===null||v===undefined?"—":Array.isArray(v)?v.join(", "):String(v)));}body.append(tr);}t.append(body);wrap.append(t);section.append(wrap);$("results").append(section);
}
function download(name,data,type="application/json"){
 const body=typeof data==="string"?data:JSON.stringify(data,null,2);
 const url=URL.createObjectURL(new Blob([body],{type}));const a=el("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
}
function csv(rows){if(!rows.length)return "";const keys=Object.keys(rows[0]);const cell=v=>{let s=typeof v==="object"?JSON.stringify(v):String(v??"");if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return [keys.map(cell).join(","),...rows.map(r=>keys.map(k=>cell(r[k])).join(","))].join("\r\n");}
function pct(n){return n===null?"N/A":(n*100).toFixed(1)+"%";}
function money(n){return "$"+n.toFixed(2);}
const copies=[];
function saveComparison(label,result){copies.push({label,at:new Date().toISOString(),result:JSON.parse(JSON.stringify(result))});if(copies.length>5)copies.shift();$("saved").textContent=copies.length+" comparison snapshots saved in this tab";}
let lastResult=null;


field("threshold","Confidence threshold",.90);field("guard","Urgency override","on",[["on","Enabled"],["off","Original baseline"]]);
let decisions={};
function run(){clear();const results=Product.evaluate(DEMO_DATA,num("threshold"),$("guard").value==="on");lastResult={...results,confirmed:decisions};
 metric("Suggestion coverage",pct(results.coverage));metric("Wrong queue suggestions",results.wrong_queue);metric("Urgent misses",results.urgent_misses);metric("Urgent recall",pct(results.urgent_recall));
 table("Triage queue",results.rows.map(r=>({...r,confidence:pct(r.confidence)})),[["id","Ticket"],["summary","Summary"],["predicted_queue","Suggested queue"],["confidence","Confidence"],["decision","Decision"],["reason","Reason"]]);
 message("Every suggestion requires confirmation. The override uses authored keywords and existing flags; it is not a trained hazard classifier. It may miss new wording or over-escalate negated phrases. Ground-truth urgent labels are used only to evaluate results.");
 table("Confirmed assignments",Object.entries(decisions).map(([id,queue])=>({id,queue})),[["id","Ticket"],["queue","Human-selected queue"]]);
}
field("ticket","Ticket to review","T18",DEMO_DATA.map(r=>r.id));field("queue","Human-selected queue","Hardware",["Identity","Network","Hardware"]);
button("Evaluate routing policy",run);button("Confirm assignment",()=>{decisions[$("ticket").value]=$("queue").value;run();message("Assignment stored for this tab only; no service desk was contacted.");},true);
run();

button("Save comparison snapshot",()=>{if(!lastResult)throw new Error("Run the scenario first");saveComparison("Scenario "+(copies.length+1),lastResult);table("Saved comparisons",copies.map(c=>({label:c.label,time:c.at})),[["label","Snapshot"],["time","Captured (UTC)"]]);},true);
button("Download evidence JSON",()=>download("product-evidence.json",{current:lastResult,comparisons:copies,scope:"Independent prototype; synthetic data only"}),true);
