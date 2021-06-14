import {
  AcceptedDataTypes,
  AdapterType,
  BuilderTypeToObjectProps,
  DetectType,
  IsTypeProps,
  MyError,
  ObjectData,
} from "../components/interfaces/interfaces";
import jsonObjBuilder from "./jsonObjBuilder";
import { builderXML, jsontoxmlBuilder, validadeXMLTags } from "./xmlObjBuilder";

export default class DataAdapter implements AdapterType {
  public async detectType(
    props: BuilderTypeToObjectProps
  ): Promise<DetectType> {
    const { data } = props;

    const typesArray = [AcceptedDataTypes.JSON, AcceptedDataTypes.XML];

    let result: DetectType | MyError = new MyError("Not supported type!");

    //Pattern pentru un for cu async inauntru: algorithm async in for
    const promises = typesArray.map((type) => {
      return new Promise((resolve, reject) => {
        this.isType({ type, data }).then((typeOrError) => {
          if (!(typeOrError instanceof MyError) && typeOrError === true) {
            resolve(type);
          } else {
            resolve(false);
          }
        });
      });
    });

    const types: Array<AcceptedDataTypes | false> = (await Promise.all(
      promises
    )) as Array<AcceptedDataTypes | false>;

    const foundTypes: Array<AcceptedDataTypes | false> = types.filter(
      (type) => type !== false
    )!;

    if (foundTypes.length > 0 && foundTypes[0] !== false) {
      result = foundTypes[0];
    }

    return result;
  }

  public async builderTypeToObject(props: BuilderTypeToObjectProps) {
    const { data } = props;

    const detectedTypeOrError = await this.detectType({ data: data });

    if (detectedTypeOrError instanceof MyError) {
      return detectedTypeOrError;
    } else if (detectedTypeOrError === AcceptedDataTypes.JSON) {
      const dataJson = jsonObjBuilder(data);
      return {
        data: dataJson.response,
        type: AcceptedDataTypes.JSON,
      };
    } else if (detectedTypeOrError === AcceptedDataTypes.XML) {
      const dataXML = await validadeXMLTags(data);
      return {
        data: dataXML.response.root,
        type: AcceptedDataTypes.XML,
      };
      return dataXML;
    }
    // return new MyError('Type not supported!')
  }

  public builderObjectToType(props: ObjectData) {
    const { data, type } = props;

    if (type === AcceptedDataTypes.JSON) {
      const convertedListOfLists = JSON.parse(JSON.stringify(data, null, 2));
      return convertedListOfLists;
    }

    if (type === AcceptedDataTypes.XML) {
      const convertedListOfLists = jsontoxmlBuilder(data);
      return convertedListOfLists;
    }
  }

  public async isType(props: IsTypeProps) {
    const { type, data } = props;

    const jsonRegex = /^[\],:{}\s]*$/;
    const regexXML = /(<.[^(><.)]+>)/g;

    if (
      type === AcceptedDataTypes.JSON &&
      jsonRegex.test(
        data
          .replace(/\\["\\/bfnrtu]/g, "@")
          .replace(
            /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+,-]?\d+)?/g,
            "]"
          )
          .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
      )
    ) {
      const dataJson = jsonObjBuilder(data);

      if (dataJson.error === false) {
        return true;
      } else {
        return new MyError("Invalid JSON FORMAT");
      }
    }

    if (type === AcceptedDataTypes.XML && regexXML.test(data)) {
      const dataXML = await validadeXMLTags(data);

      if (dataXML.error === false) {
        return true;
      } else {
        return new MyError("Invalid XML FORMAT");
      }
    }

    return false;
  }
}
