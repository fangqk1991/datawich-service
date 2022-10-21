module.exports = {
  adminPort: 8081,
  adminBaseURL: 'http://localhost:8080',
  mysql: {
    datawichDB: {
      host: '127.0.0.1',
      port: 3306,
      database: 'general_data',
      username: 'root',
      password: '',
      dialect: 'mysql',
      timezone: '+08:00',
      logging: false,
    },
  },
  datawichDownloadDir: '/data/datawich-zone/downloads',
  ossOptions: {
    Default: {
      visitor: {
        region: 'oss-cn-shanghai',
        accessKeyId: '__accessKeyId__',
        accessKeySecret: '<OSS accessKeySecret>',
        bucket: '__bucket__',
        secure: true,
      },
      uploader: {
        region: 'oss-cn-shanghai',
        accessKeyId: '__accessKeyId__',
        accessKeySecret: '<OSS accessKeySecret>',
        bucket: '__bucket__',
        secure: true,
      },
      uploadSignature: {
        accessKeyId: '__accessKeyId__',
        accessKeySecret: '<OSS accessKeySecret>',
        bucketURL: '<bucketURL>',
        timeout: 3000,
      },
      remoteRootDir: 'datawich-staging',
      downloadRootDir: '/data/datawich-zone/downloads',
    },
  },
  adminSSO: {
    baseURL: 'https://sso.example.com',
    clientId: '<clientId>',
    clientSecret: '<clientSecret>',
    authorizePath: '/api/v1/oauth/authorize',
    tokenPath: '/api/v1/oauth/token',
    logoutPath: '/api/v1/logout',
    scope: 'basic',
    callbackUri: 'http://localhost:8080/api/v1/handleSSO',
    userInfoURL: 'https://sso.example.com/api/v1/oauth/user-info',
  },
}
