const { createReceiver } = require('ilp-protocol-psk2');
const EventEmitter = require('events');
const getIlpPlugin = require('ilp-plugin');

class WebMonetisation {
  constructor(opts) {
    this.connected = false;
    this.plugin = (opts && opts.plugin) || getIlpPlugin();
    this.buckets = new Map();
    this.balanceEvents = new EventEmitter;
    this.maxBalance = (opts && opts.maxBalance) || Infinity;
  }

  async connect() {
    if(this.connected) return
    this.connected = true;

    await this.plugin.connect();
    this.receiver = await createReceiver({
      plugin: this.plugin,
      paymentHandler: async params => {
        const amount = params.prepare.amount;
        const id = params.prepare.destination.split('.').slice(-3)[0];
        let balance = this.buckets.get(id) || 0;
        balance = Math.min(balance + Number(amount), this.maxBalance);
        this.buckets.set(id, balance);
        setImmediate(() => this.balanceEvents.emit(id, balance));
        console.log("Got money for bucket. Amount = " + amount + ", id = " + id + ", balance = " + balance)

        await params.acceptSingleChunk();
      }
    })
  }

  awaitBalance(id , balance) {
    console.log('awaiting balance. id=' + id, 'balance=' + balance)
    return new Promise(resolve => {
      const handleBalanceUpdate = _balance => {
        if (_balance < balance) return

        setImmediate(() =>
          this.balanceEvents.removeListener(id, handleBalanceUpdate))
        resolve()
      }

      this.balanceEvents.on(id, handleBalanceUpdate)
    })
  }

  spend (id, price) {
    const balance = this.buckets.get(id)
    console.log("spending balance", balance, price);
    if (!balance) {
      throw new Error('No balance found!');
    }
    if (balance < price) {
      throw new Error('insufficient balance on id.' +
      ' id=' + id,
      ' price=' + price,
      ' balance=' + balance);
    }
    console.log('spent money. id=' + id, 'price=' + price);
    this.buckets.set(id, balance - price);
  }

  paid({ price, awaitBalance = false }) {
    return async(req, res, next) => {
      const id = req.params.id;
      if(!id) {
        res.status(500).send('No Id found!')
      }
      const _price = (typeof price === 'function')
        ? Number(price(req))
        : Number(price)
      if (awaitBalance) {
        await this.awaitBalance(id, _price)
      }

      try {
        this.spend(id, _price);
        next();
      } catch (e) {
        res.status(402).send(e.message)
      }
    }
  }

  receiver() {
    return async(req, res, next) => {
      await this.connect();

      const { destinationAccount, sharedSecret } =
        this.receiver.generateAddressAndSecret();

      const segments = destinationAccount.split('.')
      const resultAccount = segments.slice(0, -2).join('.') +
        '.' + req.params.id +
        '.' + segments.slice(-2).join('.');
      res.header("Content-Type", "application/spsp+json");
      res.send({
        destination_account: resultAccount,
        shared_secret: sharedSecret.toString('base64')
      });
    }
  }
}

module.exports = WebMonetisation;
