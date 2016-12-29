function tokenizeWord(word){
	return word.split(" ");
}

function getDocModel(doc){
  var d = doc.split("##");
  return {classLabel: d[1], words : tokenizeWord(d[0])};
}

var dataMap={clasz:{},totalDocN:0};
var generalWordMap = {};

var getNewClassMap = function(){
 return {n:0, words:{}};
}
var getNewWordMap = function(){
return {n:0};
}

var getClassMap = function(model){
	var obj = dataMap.clasz[model.classLabel];
  if(!obj){
  	 obj = dataMap.clasz[model.classLabel] = getNewClassMap();
  }
  return obj;
}

var ensureWordMap  = function(mapObj,word){
  var wordMap = mapObj.words[word];
  if(!wordMap){
      mapObj.words[word]= getNewWordMap();
  }
  
}

function registerWord (obj,word){
   obj.words[word].n++;
   var gWord = generalWordMap[word];
   if(gWord){
     generalWordMap[word]=generalWordMap[word]+1;
   }
   else{
     generalWordMap[word] = 1;
   }
}

function registerClass(model){
 var obj = getClassMap(model);
  obj.n++;
   return obj;
}
function registerDoc(model) {

  var obj =  registerClass(model);
  var words = model.words;
  var wordLen = words.length;
  for(var i =0 ;i<wordLen;i++){
  	  var word = words[i];
      ensureWordMap(obj,word);
      registerWord(obj,word);
  }
   
}


function traindoc(rawDoc){
    dataMap.totalDocN = dataMap.totalDocN || 0;
    dataMap.totalDocN++;
    var model = getDocModel(rawDoc);
    registerDoc(model);

    afterTrainDocInstantProbs();
}

function afterTrainDocInstantProbs(){

    var clasz = dataMap.clasz;
    var docsLength= dataMap.totalDocN;
    for(var cl in clasz){
         var obj = clasz[cl];
         var p = (obj.n*1.0) / docsLength;
         obj.p= p;
    }
    
    voc=0;
    for(var k in generalWordMap){
        voc++;
    }
    
    dataMap.voc=voc;
}

function traindocs(rawDocs){
   var docsLength = rawDocs.length;
   dataMap.totalDocN=docsLength;
   for(var i = 0;i<docsLength;i++){
   var model = getDocModel(rawDocs[i]);
    registerDoc(model);
   }
   
    afterTrainDocInstantProbs();
}

function calculateWordProbability(clasz,word){

  var words = clasz.words;
  var word=words[word];
  var wc = word? word.n:0;
  var sum = 0;
  for(var k in words){
     sum += words[k].n;
  }
  wc = wc || 0.0;
  var p =  ((1.0*wc)+1)/(sum+dataMap.voc);
  return p;
}

function guess(rawDoc) {
  var scores={};
  var model = getDocModel(rawDoc);
  var words = model.words;
  var clasz = dataMap.clasz;
  

  var totalP = 0;
  for(var cl in clasz){
     
     var m = 1.0;
     for(var i = 0;i<words.length;i++){
     		 m=m*calculateWordProbability(clasz[cl],words[i]);
     }
     //scores[cl] = Math.log(clasz[cl].p*m);
     scores[cl]=clasz[cl].p*m;
     totalP+=scores[cl];
  }
  for(var s in scores){
    scores[s] = ((scores[s]/totalP)*100).toFixed(2);
  }

  return scores;
}


