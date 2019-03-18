
var PROXY_CONFIG = [
  {
    context: [
      "/Runtime"
    ],
    target: "http://localhost:92",
    "pathRewrite": {
      "^/Runtime": "/Runtime/server"
    },
    "secure": false
  },
];
module.exports = PROXY_CONFIG;
