import { apiEndpoint } from "../ApiEndpoint/ApiEndpoint";

const GraphQlConfig = (query) => {
  var data = JSON.stringify({
    query: query,
    variables: {},
  });

  var config = {
    method: "post",
    url: `${apiEndpoint}/graphql`,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  return config;
};

export default GraphQlConfig;
