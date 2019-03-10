const _ = require('lodash');
const { Datastore } = require('@google-cloud/datastore');
module.exports = async () => {
  const store = new Datastore({
    projectId: 'blumhouse'
  });
  const query = store.createQuery('Tweet-firedhuskers').order('Date');
  const [res, _more] = await store.runQuery(query);
  groupedVals = _.groupBy(res, v => v.FaveCount);
  const vals = Object.keys(groupedVals).reduce((prev, curr) => {
    prev[curr] = {
      faveCount: curr,
      data: groupedVals[curr].map(v => JSON.stringify(v))
    };
    return prev;
  }, {});
  return vals;
};
