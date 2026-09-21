(function(){
"use strict";
function finite(value, name, min=0, max=Number.MAX_SAFE_INTEGER) {
  if(typeof value!=="number" || !Number.isFinite(value) || value<min || value>max) throw new Error(`${name} must be a finite number from ${min} to ${max}`);
  return value;
}
function clone(value){return JSON.parse(JSON.stringify(value));}
function unique(rows,key){if(new Set(rows.map(r=>r[key])).size!==rows.length)throw new Error(`Duplicate ${key}`);}
function ratio(a,b){return b ? a/b : null;}

const HAZARDS=[[/\b(swollen|bulging|smoking|overheating)\b/i,"Potential equipment hazard"],[/\b(smoke|sparks|burning smell)\b/i,"Potential equipment hazard"],[/\b(phishing|stolen session|suspicious login)\b/i,"Potential security incident"],[/\b(entire office|all users|company-wide)\b.*\b(unavailable|offline|down|outage)\b/i,"Broad service outage"]];
function route(row,threshold=.9,guard=true){
 finite(threshold,"Confidence threshold",0,1);finite(row.confidence,"Ticket confidence",0,1);
 const hazard=guard?HAZARDS.find(([pattern])=>pattern.test(row.summary)):null;
 if(row.urgent_flag||hazard)return {...row,decision:"HUMAN_REVIEW",reason:hazard?hazard[1]:"Existing urgency signal"};
 return {...row,decision:row.confidence>=threshold?"SUGGEST_QUEUE":"HUMAN_REVIEW",reason:row.confidence>=threshold?"Confidence meets threshold; confirmation still required":"Confidence below threshold"};
}
function evaluate(rows,threshold=.9,guard=true){
 if(!Array.isArray(rows)||!rows.length)throw new Error("Tickets are required");unique(rows,"id");
 const results=rows.map(r=>route(r,threshold,guard));const suggestions=results.filter(r=>r.decision==="SUGGEST_QUEUE");
 const urgent=results.filter(r=>r.urgent),caught=urgent.filter(r=>r.decision==="HUMAN_REVIEW");
 return {rows:results,total:rows.length,suggested:suggestions.length,coverage:ratio(suggestions.length,rows.length),wrong_queue:suggestions.filter(r=>r.predicted_queue!==r.expected_queue).length,urgent_misses:urgent.length-caught.length,urgent_recall:ratio(caught.length,urgent.length),nonurgent_review:results.filter(r=>!r.urgent&&r.decision==="HUMAN_REVIEW").length};
}
const API={route,evaluate};

if(typeof module!=="undefined"&&module.exports)module.exports=API;else window.Product=API;
})();
