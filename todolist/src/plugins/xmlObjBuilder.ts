import xml2js from "xml2js";
import jsonxml from "jsontoxml";
import js2xmlparser from "js2xmlparser";
import { cloneDeep } from "lodash";
import xmljs from "xml-js";
// import jsonXML from "jsonxml";

async function validadeXMLTags(data: string): Promise<any> {
  console.log("DATA validadeXMLTags: ", data);
  const xmlObj = {
    error: false,
    response: {},
  };
  const parser = new xml2js.Parser(/* options */);
  // const builder = new xml2js.Builder({ headless: true });

  try {
    const result = await parser.parseStringPromise(data);
    xmlObj.response = result;
    console.log("RESULT: ", result);
    return xmlObj;
  } catch (err) {
    console.error(err);
    xmlObj.error = true;
    xmlObj.response = err.message;
    return xmlObj;
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
  return xmlObj;
}

async function builderXML(data: any): Promise<any> {
  // var result1 = convert.xml2json(xml, {compact: true});
  const result = xmljs.xml2json(data, { compact: false, spaces: 4 });
  console.log("RESULT: ", result);
  return result;
  // const builder = new xml2js.Builder({ headless: true });
  // console.log("DATA din xmlbuilder: ", data);
  // const xml = builder.buildObject(data);
  // console.log("XML: ", xml);
  // return xml;
  // const builder = new xml2js.Builder();
  // const xml = builder.buildObject(data);
  // return xml;
  // xml2js
  //   .parseStringPromise(data /*, options */)
  //   .then(function (result) {
  //     return result;
  //     // console.log('Done');
  //   })
  //   .catch(function (err) {
  //     // Failed
  //     return err;
  //   });
  // const parser = new xml2js.Parser();
  // parser
  //   .parseStringPromise(data)
  //   .then(function (result) {
  //     console.log("Root: ", result.root);
  //     return result.root;
  //   })
  //   .catch(function (err) {
  //     // Failed
  //   });
  // const parseString = xml2js.parseString;
  // const xml = data;
  // const response = parseString(
  //   xml,
  //   { trim: true },
  //   function (err: Error, result: Record<string, unknown> | string) {
  //     console.log(result);
  //     // return new Promise((resolve, reject) => resolve(cloneDeep(result)));
  //     // return dataToImport;
  //     const resultToImport = cloneDeep(result);
  //     return resultToImport;
  //   }
  // );
  // return response;
  // let result: Record<string, unknown> | string;
  // try {
  //   result = js2xmlparser.parse(JSON.stringify(data));
  // } catch (err) {
  //   result = err.message;
  // }
  // return result;
}

function jsontoxmlBuilder(data: any): any {
  // const dataClean = JSON.stringify(data, null, 2);
  const convertor = jsonxml(data, {
    escape: true,
    indent: " ",
    prettyPrint: true,
    removeIllegalNameCharacters: true,
  });
  return `<root>${convertor}</root>`;
}
export { validadeXMLTags, builderXML, jsontoxmlBuilder };
