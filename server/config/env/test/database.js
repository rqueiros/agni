module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/unitTest.db'),
    },
    useNullAsDefault: true,
    debug: false
  },
});
