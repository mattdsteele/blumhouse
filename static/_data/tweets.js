const _ = require('lodash');
const { getYear, format } = require('date-fns');
const { Datastore } = require('@google-cloud/datastore');
module.exports = async () => {
  const store = new Datastore({
    projectId: 'blumhouse'
  });
  const query = store
    .createQuery(`Tweet-${process.env.BLUMHOUSE_TWITTER_NAME}`)
    .order('Date');
  let [res, _more] = await store.runQuery(query, { wrapNumbers: true });
  console.log(_more);
  res = res.map(r => {
    return {
      ...r,
      dateAsStr: format(new Date(r.Date), 'MMM d y H:m')
    };
  });
  groupedVals = _.groupBy(res, v => {
    return getYear(new Date(v.Date));
  });
  const vals = Object.keys(groupedVals).reduce((prev, curr) => {
    prev[curr] = {
      year: curr,
      data: groupedVals[curr].map(v => JSON.stringify(v))
    };
    return prev;
  }, {});
  return vals;
};
