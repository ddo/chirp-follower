var ChirpRest = require('chirp-rest');
var debug     = require('debug')('chirp-follower');

module.exports = Follower;

function Follower(opt) {
    if(!(this instanceof Follower)) {
        return new Follower(opt);
    }

    if(!(opt.consumer && opt.consumer.public && opt.consumer.secret)) {
        throw new Error('consumer.public and consumer.secret are required');
    }

    if(!(opt.token && opt.token.public && opt.token.secret)) {
        throw new Error('token.public and token.secret are required');
    }

    this.rest = new ChirpRest({
        consumer:   opt.consumer,
        token:      opt.token
    });
}

Follower.prototype.follow = function(user, callback) {
    var self = this;

    var user_id = user;

    if(typeof user === 'object') {
        user_id = user.id_str
    }

    debug('#follow', user_id);

    self.rest.post('https://api.twitter.com/1.1/friendships/create.json', {
        user_id: user_id,
        follow: true
    }, function(err, res) {
        if(err) {
            debug('#follow err', err);
            return callback(err);
        }

        debug('#follow success');

        return callback(null, res);
    });
};

Follower.prototype.unfollow = function(user, callback) {
    var self = this;

    var user_id = user;

    if(typeof user === 'object') {
        user_id = user.id_str
    }

    debug('#unfollow', user_id);

    self.rest.post('https://api.twitter.com/1.1/friendships/destroy.json', {
        user_id: user_id,
    }, function(err, res) {
        if(err) {
            debug('#unfollow err', err);
            return callback(err);
        }

        debug('#unfollow success');

        return callback(null, res);
    });
};