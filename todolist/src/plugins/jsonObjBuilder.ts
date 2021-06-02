export default function jsonObjBuilder(text:string):Record<string, unknown> {
  const dataJson = {
    error: false,
    response: {}
  };
  try {
    dataJson.response = JSON.parse(text)
  } catch (error) {
    dataJson.response = error.message
    dataJson.error = true
  }
  return dataJson
}