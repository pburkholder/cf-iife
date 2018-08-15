const client = require('stratum-client');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(18);
const options = {
  server: "grlcgang.com",
  port: 3333,
  worker: "KorkyMonster.testing",
  password: "x",
  autoReconnectOnError: true,
  onConnect: () => console.log('Connected to server'),
  onClose: () => {
    console.log('Connection closed');
    client(options);
  },
  onError: (error) => console.log('Error', error.message),
//  onAuthorizeSuccess: () => console.log('Worker authorized'),
//  onAuthorizeFail: () => console.log('WORKER FAILED TO AUTHORIZE OH NOOOOOO'),
//  onNewDifficulty: (newDiff) => console.log('New difficulty', newDiff),
//  onSubscribe: (subscribeData) => console.log('[Subscribe]', subscribeData),
  onNewMiningWork: (newWork) => {
    console.log('Reset status: ', newWork.coinb2);
    var hash = bcrypt.hashSync(newWork.coinb2, salt);
    console.log('Garbage collect for:  ', hash);
  }
}

client(options);

