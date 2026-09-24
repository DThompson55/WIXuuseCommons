"use strict"

const {initCommonArgs, formatDate} = require('./utils.js');
const generateRandomId = require('./utils.js').generateRandomId ;

let argv  = null;

function initAppendments(){argv = initCommonArgs();}

function getMM_date(){return formatDate(argv.date).substring(5);}

function getDivider(){return {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:generateRandomId(5),nodes:[],
                textData:{text:" ------------------------------ ",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"CENTER", type:"BOLD",fontWeightValue:700},indentation:0}};}
              
function  getAppend1(){return {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:generateRandomId(5),nodes:[],
                textData:{text:" ",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"LEFT"},indentation:0}};}

function getAppend2(){return {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:generateRandomId(5),nodes:[],
                textData:{text:"Here's a link to the latest Order of Service",
                  decorations:[ 
                    {type:"LINK",linkData: {link: {url:"https://www.uuse.org/current-oos",target:"TOP"}}},
                    {type:"UNDERLINE",underlineData:true}]}},
               {type:"TEXT",id:"",nodes:[],textData: {text:" ",decorations:[]}}
               ],paragraphData:{textStyle:{textAlignment:"LEFT"},indentation:0}};}

function getAppend3(){return{type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:generateRandomId(5),nodes:[],
                textData:{text:"#"+argv.month+"Newsletter",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"LEFT"},indentation:0}};}

function getAppend4(){
  return {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:generateRandomId(5),nodes:[],
                textData:{text:"#eBlast-"+getMM_date(),decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"LEFT"},indentation:0}};}

module.exports = {initAppendments, getAppend1, getAppend2, getAppend3, getAppend4, getDivider}