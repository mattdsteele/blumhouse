const _ = require('lodash');
const { getYear } = require('date-fns');
const { Datastore } = require('@google-cloud/datastore');
module.exports = async () => {
  const store = new Datastore({
    projectId: 'blumhouse'
  });
  const query = store.createQuery('Tweet-firedhuskers').order('Date');
  const [res, _more] = await store.runQuery(query);
  groupedVals = _.groupBy(res, v => {
    return getYear(new Date(v.Date));
  });
  console.log('grouped vals', Object.keys(groupedVals));
  const vals = Object.keys(groupedVals).reduce((prev, curr) => {
    prev[curr] = {
      year: curr,
      data: groupedVals[curr].map(v => JSON.stringify(v))
    };
    return prev;
  }, {});
  console.log(vals);
  return vals;
};
