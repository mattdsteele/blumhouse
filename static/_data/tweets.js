const { Datastore } = require('@google-cloud/datastore');
module.exports = async () => {
  const store = new Datastore({
    projectId: 'blumhouse'
  });
  const query = store.createQuery('Tweet-firedhuskers').order('Date');
  const [res, _more] = await store.runQuery(query);
  return res.map(r => JSON.stringify(r));
};
