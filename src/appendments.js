"use strict"
const {month,date,yargs} = require('./utils.js');

const mm_date = date.substring(5)

const divider = {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:"",nodes:[],
                textData:{text:" ------------------------------ ",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"CENTER", type:"BOLD",fontWeightValue:700},indentation:0}};
              
const append1 = {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:"",nodes:[],
                textData:{text:" ",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"AUTO"},indentation:0}};

const append2 = {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:"",nodes:[],
                textData:{text:"Here's a link to the latest Order of Service",
                  decorations:[ 
                    {type:"LINK",linkData: {link: {url:"https://www.uuse.org/current-oos",target:"TOP"}}},
                    {type:"UNDERLINE",underlineData:true}]}},
               {type:"TEXT",id:"",nodes:[],textData: {text:" ",decorations:[]}}
               ],paragraphData:{textStyle:{textAlignment:"AUTO"},indentation:0}};

const append3 = {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:"",nodes:[],
                textData:{text:"#"+month+"Newsletter",
                  decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"AUTO"},indentation:0}};

const append4 = {type:"PARAGRAPH",id:"foo",nodes:
              [{type:"TEXT",id:"",nodes:[],
                textData:{text:"#eBlast-"+mm_date,decorations:[]}}],
              paragraphData:{textStyle:{textAlignment:"AUTO"},indentation:0}};

module.exports = {append1, append2, append3, append4, divider}