"use strict"
const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];  // List of all header tags
const longString = "                                                                                                 ";
var theRoute = [];
//
// This walks down the constant contact html tree to find the stuff we want to process
//
function startingContentWrapper(path,limit=12){
  iteratePath(path);
  // console.log("The Discovered Route =",theRoute.join(", "));
  // console.log("                      ",longString.slice(0,((limit-1)*3)-1),"^");
  theRoute.slice(0, limit).forEach(i => {
    path = path.childNodes[i];
  })
  return path;
}
//
//
//
function iteratePath(path,textRoute="",route=[]){
  var i = -1;
  path.childNodes.forEach((childNode)=>{
    i++;
    route.push(i);
    if (childNode.nodeType == 1){
      if ( headerTags.includes(childNode.rawTagName.toLowerCase())){
        // console.log(childNode.rawTagName,childNode.innerText,"\n---",textRoute);
        theRoute = [...route]; // hopefully the last one is the same as the previous?
      }
     iteratePath(childNode,textRoute+", "+i,route);
    }
    route.pop();
    return;
  })
}


module.exports = {findStartingContent:startingContentWrapper};