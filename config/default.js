module.exports = {
  adminPort: 6800,
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
        region: 'oss-cn-beijing',
        accessKeyId: '__accessKeyId__',
        accessKeySecret: '<OSS accessKeySecret>',
        bucket: '__bucket__',
        secure: true,
      },
      uploader: {
        region: 'oss-cn-beijing',
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
}
