"use strict";
const redactions = require('./redact.js').redactions;
const generateRandomId = require('./utils.js').generateRandomId ;
const {divider} = require('./appendments.js')
const timestamp = new Date().toISOString();    // used in Rich Content annotations

const redact=true;

//
// this is a utility function that walks through the
// constant contact HTML to find #news tags I've inserted
//
const tagTable = {
'A':A_func, 'B':STRONG_func, 'BR':BR_func, 'DIV':DIV_func, 
'H1':H1_func, 'H2':H2_func, 'H3':H3_func, 'H4':H4_func, 
'H5':H5_func, 'H6':H6_func, 'HR':BR_func, 'IMG':IMG_func, 
'LI':LI_func, 'OL':OL_func, 'P':P_func, 'SPAN':SPAN_func, 
'STRONG':STRONG_func, 'SUP':SUP_func, 'TABLE':TABLE_func,
'TBODY':TBODY_func, 'EM':STRONG_func, 
'TD':TD_func, 'text':text_func, 'TR':TR_func, 'UL':UL_func}

function htmlToRichContent(path, content, layer=0, parentStyle={}){  
  if (path.nodeType == 3) path.tagName = "text";
  let style = { ...parentStyle, ...path.attributes,...((path.attributes?.style)?parseStyleString(path.attributes.style ):{}) };
  //console.log(layer+1,style);
  //console.log(layer+1,"dispatch",path.tagName)
  if (tagTable[path.tagName])
    tagTable[path.tagName](path, content, layer+1, style)
  else {    
    throw new Error(`Tag Name Not in Table ${path.tagName}`  )
  }
}

function getRCParagraph(){
    return {
    type:"PARAGRAPH",
    id:generateRandomId(5),
    nodes:[],
    paragraphData:{textStyle:{textAlignment:"AUTO", lineHeight:"1.1"},indentation:0},style:{paddingTop:"2px","paddingBottom":"0px"}
  }
}


function P_func(path, content, layer, style){//path, content, layer, style, redact){
//  console.log("\n"+layer,"paragraph",path.nodeType,path.tagName);

  const align = (style?.textAlign || "AUTO").toUpperCase();
  const paragraph = {
    type:"PARAGRAPH",
    id:generateRandomId(5),
    nodes:[],
    paragraphData:{textStyle:{textAlignment:align, lineHeight:"1.1"},indentation:0},style:{paddingTop:"2px","paddingBottom":"0px"}
  }
  path.childNodes.forEach((node)=>{
    htmlToRichContent(node, paragraph.nodes, layer, style);     
  })
  content.push(paragraph);
}

function TABLE_func(path, content, layer, style){
  //
  // tables are the magic thing that separates articles
  //
    const tableMarker = {
    type:"PARAGRAPH",
    tableMarker:true,
    id:generateRandomId(5),
    paragraphData:{textStyle:{textAlignment:"AUTO", lineHeight:"1.0"},
    indentation:0},style:{paddingTop:"2px","paddingBottom":"0px"},
    nodes:[{"type": "TEXT","id": "","nodes": [],"textData": 
      {"text": "Table Marker","decorations": [{"type": "COLOR",
        "colorData": {"foreground": "#FF0000"}}]}}]};

  content.push(tableMarker);  
  passthrough(path,content,layer,style);
}

function IMG_func(path, content, layer, style){
  if (style.class === 'image_content'){
    //
    // Disconnected for now
    //
  const image = {
    type:"PARAGRAPH",
    id:generateRandomId(5),
    paragraphData:{textStyle:{textAlignment:"AUTO", lineHeight:"1.0"},indentation:0},style:{paddingTop:"2px","paddingBottom":"0px"},
    nodes:[{
    type:"TEXT",
    id:generateRandomId(5),
      "textData":{"text":"Image","decorations":[
      {type:"LINK",linkData:{link:{url:style.src, target:"BLANK"}}},
      {type:"COLOR",colorData:{foreground:"#0000FF"}},
      {type:"UNDERLINE",underlineData:true}
    ]}}]}

  path.childNodes.forEach((node)=>{
    htmlToRichContent(node, content, layer, style);     
  })
//  console.log("IMG_func is disabled")
//  if (articles.length>0){

    //
    // disabled for now
    //
//    params.articles[params.articles.length-1].push(image)
//  }

  //passthrough
}}


function A_func(path, content, layer, style){
    //
    // Anchors are supposed to have some subordinate text, so let's look for that
    // we need to recurse down a level to find it.
    //
    let count = 1;
    path.childNodes.forEach((node)=>{
      htmlToRichContent(node, content, layer, style);     
    })
    try {

    const link = redactions(path.attributes.href, false);
//    console.log("LINK =",link, redactions(link));

    const r = content[content.length-1].textData.decorations; // this gets the decorations of that text
      r.push({type:"LINK",linkData:{link:{url:link, target:"BLANK"}}});
      r.push({type:"COLOR",colorData:{foreground:"#0000FF"}});
      r.push({type:"UNDERLINE",underlineData:true})
    } catch (error){
        console.log("A_Func Error, no internal text?",error.message);
        // stop();
        // console.log("Ignore A tag, link is",path.attributes.href);
    }
}

function getRCText(text=""){
  return {  type:"TEXT",
    id:"",
    nodes:[],
    textData:{
      text, // text data here
      decorations:[]
    }       
  }
}


function text_func(path, content, layer, style){
  // passthrough(path, content, layer, style);
  // return;
//  console.log("TEXT PARAMS",params.style)
  let text = path.text;
  let preText = path.text;
  text = redactions(text,redact);

// allow all empty and whitespace text through the machine

  // if (content.length==0) {//dtt 
  // if (/^\s*$/.test(text)) {
  //   console.log(layer,'empty text');
  //   return; // whitespace or empty?
  // }}
  // if (/^\s*$/.test(text)){
  //   console.log("Space",content);
  // }

//  console.log(params.layer,"text",text);
  const contentItem = {  type:"TEXT",
    id:"",
    nodes:[],
    textData:{
      text:text, // text data here
      decorations:[]
    }       
  }


  decorate(style,contentItem.textData.decorations,text);

  content.push(contentItem);//2
}



function H1_func(path, content, layer, style){H_func(path, content, layer, style, 1)} 
function H2_func(path, content, layer, style){H_func(path, content, layer, style, 2)} 
function H3_func(path, content, layer, style){H_func(path, content, layer, style, 3)} 
function H4_func(path, content, layer, style){H_func(path, content, layer, style, 4)} 
function H5_func(path, content, layer, style){H_func(path, content, layer, style, 5)} 
function H6_func(path, content, layer, style){H_func(path, content, layer, style, 6)} 

function H_func(path, content, layer, style, strength){ 
  let text = path.text;
  text = redactions(text,redact);
  const align = (style?.textAlign || "CENTER").toUpperCase();
  const heading   = {type:"HEADING",
                   id:generateRandomId(5),nodes:[],
                  headingData:{level:strength,textStyle:{textAlignment:align},indentation:0}};
  path.childNodes.forEach((node)=>{
    htmlToRichContent(node,heading.nodes,layer,style)
  })
  content.push(heading);
}

function list_functions(path, content, layer, style, type){
  const list = {
    type, id:generateRandomId(5), nodes:[]
  }
  path.childNodes.forEach((node)=>{
    htmlToRichContent(node, list.nodes, layer, style, node)
  })

  const filteredList = list.nodes.filter(item => !(item.type === "TEXT" && item.textData?.text === " "));
  list.nodes = filteredList;
  content.push(list);
}
function UL_func(path, content, layer, style){
//  const x = [];
  list_functions(path, content, layer, style,"BULLETED_LIST")
  // console.log(pretty(x));
  // stop();

}
function OL_func(path, content, layer, style){
  list_functions(path, content, layer, style,"ORDERED_LIST")
}
function LI_func(path, content, layer, style){
  list_functions(path, content, layer, style,"LIST_ITEM")
}

var dtt=0;

function passthrough(path, content, layer, style){
//    console.log(layer,"passthrough",path.nodeType,path.tagName);
    path.childNodes.forEach((node)=>{
        htmlToRichContent(node, content, layer, style);     
    })

}

function BR_func(path, content, layer, style){
  passthrough(path, content, layer, style);
}

function STRONG_func(path, content, layer, style){
  style.bold = true;
  passthrough(path, content, layer, style);
}

function TR_func(path, content, layer, style){
  passthrough(path, content, layer, style)
}

function TD_func(path, content, layer, style){
  passthrough(path, content, layer, style)
}

function SPAN_func(path, content, layer, style){
//  console.log(style) // sup should process any embedded text
  passthrough(path, content, layer, style)
}

function SUP_func(path, content, layer, style){
console.log("SUP_func");
//  console.log(style)
  passthrough(path, content, layer, style)
}

function TBODY_func(path, content, layer, style){
//  console.log("TBODY_func");
//  console.log(style)
  passthrough(path, content, layer, style)
}


function DIV_func(path, content, layer, style){
  passthrough(path, content, layer, style)
}


function decorate(style,r,text=""){


if (style.fontStyle){
  if (style.fontStyle === "italic"){
    r.push({ type:"ITALIC", italicData:true});
  }
  if (style.fontStyle !== "italic"){
    console.log("Invalid fontStyle",style.fontStyle);
    stop();
  }
}

let fontWeightValue = (style.fontWeight) || 700;
if (style.bold) fontWeightValue = 700;

if (fontWeightValue === 'bold') {
    style.bold = true;
}

const styleMappings = [
  { key: "bold", type: "BOLD", value: () => ({ fontWeightValue }) },
  { key: "italic", type: "ITALIC", value: () => ({italicData:true}) },
  { key: "textDecoration", type: "UNDERLINE", value: () => ({underlineData:true }) },
  { key: "color", type: "COLOR", value: (style) => ({ colorData: { foreground: colorToHex(style.color) } }) },
  // Add more styles here as needed...
];

styleMappings.forEach(({ key, type, value }) => {
//  console.log("xxx",style[key],key,type,value);
  if (style[key]) {
    r.push({ type, ...value(style) });
  }
});

//console.log(pretty(r));
// if (("underline" === styleProperties['text-decoration']) ||
//    ('underline')===(styleProperties['font-style'])){
//   r.push({ type:"UNDERLINE", underlineData:true });
// }
}


function colorToHex(color) {
//  console.log("COLOR TO HEX",color);  
  if (color === "rgb(255, 255, 255)") return "#000000" // white on white doesn't work
  // Check if the input is already a hex color value
  if (color === "black") {
    return "#000000";
  } else
  if (color.startsWith('#')) {
    // Validate if it's a proper 3 or 6 digit hex color
    const hexMatch = /^#([0-9A-F]{3}){1,2}$/i.test(color);
    if (hexMatch) {
      return color.toLowerCase();
    } else {
      console.log("Bad Color 1",color)
      return "#000000";
    }
  }

  // If not hex, check if it is an RGB value
  const rgbMatch = color.match(/^rgb\((\d{1,3}), *(\d{1,3}), *(\d{1,3})\)$/);
  if (rgbMatch) {
    // Convert RGB values to hexadecimal
    const hex = rgbMatch
      .slice(1)
      .map(num => {
        const hexValue = parseInt(num, 10).toString(16);
        return hexValue.length === 1 ? '0' + hexValue : hexValue;
      })
      .join('');
    return `#${hex}`;
  }
//  console.log("Bad Color 2",color)
  return "#000000";
}

function mergeTextIntoParagraphs(list) {
  let result = [];
  
  for (let i = 0; i < list.length; i++) {
    let currentItem = list[i];

    if (currentItem.type === "PARAGRAPH") {
      // Add PARAGRAPH to result
      result.push({ ...currentItem });

      // Merge following TEXT nodes into this PARAGRAPH
      while (list[i + 1] && list[i + 1].type === "TEXT") {
        result[result.length - 1].nodes.push(...list[i + 1].nodes);
        i++; // Skip the TEXT node
      }
    } else {
      // Non-PARAGRAPH items are added as is
      result.push(currentItem);
    }
  }
  return content;
//  return mergeTextIntoParagraphs(content);
}


function htmlToRichContentWrapper(node){
      let content = [];
      let layer = 0;
      let style = {};
      htmlToRichContent(node, content, layer, style);
      // get rid of any 1st level TEXT, which got in through tds, trs, etc.
      const filteredList = content.filter(item => item.type !== "TEXT");
      return filteredList;
    }

function isArrayEmptyOrNestedEmpty(arr) {
  // Check if the array is empty
  if (!Array.isArray(arr) || arr.length === 0) return true;

  // Recursively check each element in the array
  return arr.every(item => Array.isArray(item) && isArrayEmptyOrNestedEmpty(item));
}

//
//
//
function getArticlesFromHTML(path){ 
  let consolidatedArticles = [];
  let articles = [];
  let nodeNum = 0;
  let lastNodeNum = 0;
  //
  // where does the separator come in?
  //
  path.childNodes.forEach(node=>{
    const content = htmlToRichContentWrapper(node);
    if (content.length == 0){
      return;
    } 
    let {result,separated} = splitByTableMarker(content);
    if (separated){
      articles.push(result);
    }
  })
  //
  //
  // at this point articles is list of articles
  // the articles themselves are lists of RC components
  // Including groups of table tags
  //

// console.log(JSON.stringify(articles,null, 2));
//   process.exit(0);


  var cleanArticles = [];
  var goodArticles = [];
  var xxx = 0;
  articles.forEach(bother=>{
    bother.forEach(line => {
      const cleanList = line.filter(item => !item.tableMarker);
      if (cleanList.length >0)
        cleanArticles.push(cleanList);
    })
    if (cleanArticles.length>0)
     goodArticles.push(cleanArticles)
     cleanArticles = [];
  })
  // if (tmpArticle.length){
  //   goodArticles.push([...tmpArticle]);
  // }

// 
// At this point goodArticles is a list of separate articles 
// each separate article is a list of RC components
//

  // console.log(goodArticles);
  // process.exit(0);

  return goodArticles;
}

function getAllArticles(groups){
//
// ConsolidatedArticles will be one long list of RC components
// Representing the entire newsletter, or eBlast or whatever
//
  // articles can get edited by some other routine
  // so it gets built near the end with this call
  //
  const result = [];
  groups.forEach(subGroup =>{
    subGroup.forEach(item =>{
      item.forEach(thing =>{
      result.push(thing);
    })
      result.push(divider);

    })
  })

  return result;
}

function pretty(s){return JSON.stringify(s,null,2)}
function stop(){process.exit(0)}
function parseStyleString(styleString) {
  // let x = styleString
  //     .split(";")
  //     .map(rule => rule.split(":").map(part => part.trim()))
  //     .filter(([key, value]) => key && value)
  //     .map(([key, value]) => [toCamelCase(key), value])


  // console.log("___",x.flat());

  return Object.fromEntries(
  styleString
      .split(";")
      .map(rule => rule.split(":").map(part => part.trim()))
      .filter(([key, value]) => key && value)
      .map(([key, value]) => [toCamelCase(key), value])
  );
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function splitByTableMarker(items) {
  let result = [];
  let currentGroup = [];
  let separated = true;
  for (const item of items) {
    if (item.tableMarker) {
      if (currentGroup.length) {
      result.push(currentGroup); // Save the previous group if not empty
      //result.push("1---------")
      //console.log("1---------")
      }
      currentGroup = []; // Start a new group
    } //else {
      currentGroup.push(item);
    //}
  }

  if (currentGroup.length) {
  result.push(currentGroup); // Push the last group if not empty
  //console.log("2---------")
  }

  if ( result.length == 0){
    result = [];
    separated = false;
    // console.log("problem")
    // stop();
  }

//  result = [result];
  // console.log("Retval",pretty(retval));
  // stop();
  return {result,separated};
}

module.exports = {getArticlesFromHTML, htmlToRichContent, 
  getAllArticles, getRCParagraph, getRCText};