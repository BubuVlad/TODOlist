import xml2js from 'xml2js';
import jsonxml from 'jsontoxml';
import js2xmlparser from 'js2xmlparser';
import {cloneDeep} from 'lodash';

async function validadeXMLTags(data: string):Promise<any>  {
  console.log('DATA validadeXMLTags: ', data)
  const xmlObj = {
    error: false,
    response: {}
  }
  const parser = new xml2js.Parser(/* options */);
  const builder = new xml2js.Builder({headless: true});

  try {
    const result = await parser.parseStringPromise(data)
    xmlObj.response = result
    return xmlObj
  } catch (err){
    console.error(err)
    xmlObj.error = true
    xmlObj.response = err.message
    return xmlObj
  }

  // parser.parseStringPromise(data).then(function (result): any {
  //   console.log('REsult')
  //   console.log(result)
  //   xmlObj.response = result
  //   return result
  // })
  // .catch(function (err): void {
  //   xmlObj.error = true
  //   xmlObj.response = err.message
  // });
  return xmlObj
}

function builderXML(data: any):any {
  const builder = new xml2js.Builder({headless: true});
  console.log('DATA din xmlbuilder: ', data)
  const xml = builder.buildObject(data);
  console.log('XML: ', xml)
  return xml
  // let result:Record<string, unknown>|string ;
  // try {
  //   result = js2xmlparser.parse(data)
  // } catch (err) {
  //   result = err.message
  // }
  // return result
}

function jsontoxmlBuilder(data: any): any{
  // const dataClean = JSON.stringify(data, null, 2)
  // // const buffer = Buffer.from?Buffer.from(JSON.stringify(data)):new Buffer(JSON.stringify(data));
  // const convertor = jsonxml(dataClean, {indent: ' ', prettyPrint:true, removeIllegalNameCharacters:true});
  // console.log('Convertor: ', convertor)
  // return `<root>${convertor}</root>`


  let result:Record<string, unknown>|string ;
  try {
    result = js2xmlparser.parse('root', data)
  } catch (err) {
    result = err.message
  }
  return result
 }
export {validadeXMLTags, builderXML, jsontoxmlBuilder}
