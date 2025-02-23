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

function getTextFromArticle(article) {
  return article
    .filter(node => node.type === "PARAGRAPH" || node.type === "HEADING" || node.type === "BULLETED_LIST")
    .map(node => {
      if (node.type === "PARAGRAPH" || node.type === "HEADING" ) {
        // Process paragraph nodes
        return node.nodes
          .filter(innerNode => innerNode.type === "TEXT")
          .map(innerNode => innerNode.textData.text)
          .join('');
      } else if (node.type === "BULLETED_LIST") {
        // Process bulleted list nodes
        return node.nodes
          .filter(innerNode => innerNode.type === "LIST_ITEM")
          .map(listItem => 
            '• ' + listItem.nodes
              .filter(listItemNode => listItemNode.type === "TEXT")
              .map(listItemNode => listItemNode.textData.text)
              .join('')
          )
          .join('\n'); // Separate list items with a newline
      }
      return '';
    })
    .join('\n') // Separate paragraphs and lists with a newline
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
      isFeatured: false,
      doNotShow: false
    }
  }
    return retval;
}

module.exports = {//richContentToText,
getGeneratedDescriptionFromArticle,
getLongDescriptionFromArticle,
getTextFromArticle, newEvent}