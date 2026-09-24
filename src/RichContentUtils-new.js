"use strict"
// function richContentToText(rc){
// var texts = "";
// var title;
// var allTexts = "";

// rc.forEach(node=>{
//   if (title == null){
//     title = "";
//     node.nodes.forEach(text=>{
//       title += text.textData.text;
//     })
//   } else {
//     node.nodes.forEach(text=>{
//       if (text.textData)
//       texts += text.textData.text;
//     })
//   }
//   node.nodes.forEach(text=>{
//     if (text.textData)
//     allTexts += text.textData.text;
//   })
//   texts+=" ";
//   allTexts+=" ";  


// })
// const result1 = texts.replace(/  +/g, " ").trim();
// const result2 = allTexts.replace(/  +/g, " ").trim();

// return result1
// }

let failsafe = 2;

function getTextFromArticle(article) {
return article
  .filter(node => {
    if (!node) {
      console.warn("⚠️ Skipping null/undefined node");
      // console.log(JSON.stringify(article,null,2));
      // if (failsafe-- <= 0 )
      // process.exit(0);
      return false;
    }
    return (
      node.type === "PARAGRAPH" ||
      node.type === "HEADING" ||
      node.type === "BULLETED_LIST"
    );
  })
  .map(node => {
    if (node.type === "PARAGRAPH" || node.type === "HEADING") {
      return (node.nodes ?? [])
        .filter(innerNode => {
          if (!innerNode) {
            console.warn("⚠️ Skipping null/undefined innerNode in paragraph/heading");
            return false;
          }
          return innerNode.type === "TEXT";
        })
        .map(innerNode => innerNode.textData?.text ?? "")
        .join("");
    } 
    
    if (node.type === "BULLETED_LIST") {
      return (node.nodes ?? [])
        .filter(innerNode => {
          if (!innerNode) {
            console.warn("⚠️ Skipping null/undefined innerNode in list");
            return false;
          }
          return innerNode.type === "LIST_ITEM";
        })
        .map(listItem =>
          "• " +
          (listItem.nodes ?? [])
            .filter(listItemNode => {
              if (!listItemNode) {
                console.warn("⚠️ Skipping null/undefined listItemNode");
                return false;
              }
              return listItemNode.type === "TEXT";
            })
            .map(listItemNode => listItemNode.textData?.text ?? "")
            .join("")
        )
        .join("\n");
    }

    return "";
  })
  .join("\n")
  .trim();
}

function getLongDescriptionFromArticle(article){
  let s = getTextFromArticle(article);
  let lines = s.split('\n');
  s = lines.join('\n');
  return s;
}

function getGeneratedDescriptionFromArticle(article){
  let s = getLongDescriptionFromArticle(article).slice(0,180)+"...";
  return s;
}


function newEvent(mnl) {
  const retval ={
    why:"New Event from mnl",
    data: {
      title: mnl.data.title,
      isService: false,
      date:mnl.data.foundDate,
      richcontent: mnl.data.richcontent,
      longdescription: mnl.data.longdescription,
      generatedDescription: mnl.data.generatedDescription,
      isExpired: false,
      isFeatured: false
    }
  }
    return retval;
}

module.exports = {//richContentToText,
getGeneratedDescriptionFromArticle,
getLongDescriptionFromArticle,
getTextFromArticle, newEvent}