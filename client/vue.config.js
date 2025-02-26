
module.exports = {
  lintOnSave: false,
  transpileDependencies: ["vuetify"],
  //publicPath: 'http://localhost:8080'
  //devServer: {
  //  host: '0.0.0.0',
  //  https: false,
  //  port: 8080,
  //  public: 'http://0.0.0.0'
  //},
  publicPath: process.env.NODE_ENV === "production" ? "/learnjs/" : "/",
};
