"use strict"
const axios = require('axios')
const {headers} = require('./secrets.js');
const {repeatersCMS, 
       happeningsCMS,
       newsLetterCMS } = require('./utils.js');



async function fetchAllRecords(options) {
    let allRecords = [];
    var cursor = ""
    var hasNext = false;
    if ( !options.data.query )
        options.data.query = {};

    do {
        if (hasNext) {
            options.data.query.cursorPaging = { limit: 50, cursor };
            delete options.data.query.paging;
        } else {
            options.data.query.paging = { limit: 50 };
        }
        const response = await axios(options);
        const dataItems = response.data.dataItems;
        cursor = response.data.pagingMetadata.cursors.next;
        hasNext = response.data.pagingMetadata.hasNext;
        allRecords = allRecords.concat(dataItems);
    } while (hasNext);  // Continue until cursor is null

    return allRecords;
}


function getAxiosTemplate(dataCollectionId){
  return {
    url: '/items/query',
    method: 'post', 
    baseURL: 'https://www.wixapis.com/wix-data/v2',
    headers: headers,
    data: {
      dataCollectionId
    },
    timeout: 5000, 
    responseType: 'json', 
    responseEncoding: 'utf8', 
  }
}

async function updateMenu(menuKey,label){
  console.log("Property CMS Entry updating",menuKey,label);

  const options = {
  url: '/items/query',
  method: 'post', 
  baseURL: 'https://www.wixapis.com/wix-data/v2',
  headers: headers,
  data: {
    dataCollectionId: "Properties",
    query:{
    filter: {
      title:{ $eq : menuKey }
    }
  }
  },
  timeout: 5000, 
  responseType: 'json', 
  responseEncoding: 'utf8'
}
  axios(options)
    .then(function (searchResponse) {
      if (searchResponse.data.dataItems.length!= 1){
        console.log("Properties CMS Entry not found for",menuKey);
      } else {
      let item = searchResponse.data.dataItems[0];
          item.data.value = label;//month+" Newsletter";

    const options = {
      url: '/items/'+item.id,
      method: 'put', 
      baseURL: 'https://www.wixapis.com/wix-data/v2',
      headers: headers,
      data: {
        dataCollectionId: "Properties",
        dataItem:item,
      },
      timeout: 5000, 
      responseType: 'json', 
      responseEncoding: 'utf8', 
    }  
    axios(options)
    .then(function (response) {
      console.log("Updated Properties CMS ",label, response.status);
     })
    .catch(function (error){
     console.log("Properties CMS update Failed",menuKey,error)
    })
  }
  })
}


async function bulkInsert(cms,content){
    console.log("Bulk Inserts requested:",cms,content.length)
  if (!content.length) {
    return;}
  const options = {...getAxiosTemplate(cms),
    url : 'bulk/items/insert'};
    options.data= {...options.data,dataItems:content};
    axios(options)
    .then(results=>{
      console.log("Bulk Inserts requested:",cms,results.data.bulkActionMetadata)
    })
    .catch(err=>{console.log(err.response)})
}

async function bulkUpdate(cms,content){
    console.log("Bulk Updates requested:",cms,content.length)
//    console.log("BULK DATA",pretty(content));

  if (!content.length) {
    return;}
//    console.log(JSON.stringify(content,null,1));
  const options = {...getAxiosTemplate(cms),
    url : 'bulk/items/update'};
    options.data= {...options.data,dataItems:content};
    axios(options)
    .then(results=>{
      console.log("Bulk Updates requested:",cms,results.data.bulkActionMetadata)
    })
    .catch(err=>{console.log(err.response.status,err.response.statusText)})
}

//
//
async function bulkDelete(cms){
  console.log("Bulk Deletes requested:",cms)
  const options = getAxiosTemplate(cms);
  fetchAllRecords(options)
  .catch (error =>{console.log(error)})
  .then(records =>{
    const dataItemIds = records.map(item => item.data._id);
    const options = {...getAxiosTemplate(cms),
      url: '/bulk/items/remove'};
      options.data = {...options.data,dataItemIds};
      console.log("there were "+dataItemIds.length+" old",cms,"records")
      return axios(options);
    })
}

async function fetchRecords(cms, recordType) {
  const options = getAxiosTemplate(cms);

  try {
    const records = await fetchAllRecords(options);
    console.log(`Fetched ${records.length} ${recordType} records.`);
    return records;
  } catch (error) {
    console.error(`Error fetching ${recordType} records:`, error);
    throw error;
  }
}

async function replace(cms, record) {
  console.log("At Replace. Record is",pretty(record.data.title),cms);
  const options = getAxiosTemplate(cms);
  options.data.query={
    filter: {
      title:{ $eq : record.data.title }
    }
  }
  try {
    axios(options)
    .then(function (response) {
      if (response.data.dataItems.length== 1){
        // if (JSON.stringify(response.data.dataItems).includes("What if we let our hearts break for the")){
        //   console.log("FOUND 1")
        //   stop();
        // }

        response.data.dataItems[0].data = record.data;
        bulkUpdate(cms,response.data.dataItems);
      } else {
        console.log("Update Request Not Found - hard stop",record.data.title);
        console.log("returned",response.data.dataItems.length,"records");
        console.log("- - - - - - - - - - - - - - - - - -\n");

        stop();
      }

    })
  } catch (error) {
    console.error(`Error Replacing records:`, error);
    throw error;
  }
}




async function getEvents() {
  return fetchRecords(happeningsCMS, 'Event (Happenings)');
}

async function getRepeaters() {
  return fetchRecords(repeatersCMS, 'Repeater (Events)');
}

function pretty(s){return JSON.stringify(s,null,2)}
function stop(){process.exit(0)}
module.exports = {updateMenu, getAxiosTemplate, fetchAllRecords, bulkInsert, bulkUpdate, bulkDelete, fetchRecords, getEvents, getRepeaters, replace}