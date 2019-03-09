const { Datastore } = require('@google-cloud/datastore');
module.exports = async () => {
  const store = new Datastore({
    projectId: 'blumhouse'
  });
  const query = store.createQuery('Tweet-firedhuskers').order('Date');
  const [res, more] = await store.runQuery(query);
  console.log('more', res.length);
  console.log(more.moreResults);
  return res;
};
