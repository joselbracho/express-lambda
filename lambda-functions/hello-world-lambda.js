exports.handler = async (event) => {
  if(!('key1' in event)){
      return {
          statusCode: 400,
          body: JSON.stringify(`key1: field is required.`),
      };      
  }
  
  const response = {
      statusCode: 200,
      body: JSON.stringify(`Hello from Lambda! ${event.key1}`),
  };
  return response;
};
