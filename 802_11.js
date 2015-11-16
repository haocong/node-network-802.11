var crc = require('crc');
var fs  = require('fs');
var buffer = require('buffer');
var iconv = require('iconv-lite');
var mac = require('getmac');

module.exports = (function() {
	var e802_11 = {};

	e802_11.getFrames = function(buf, size, dstMac, cb) {
		var frameBodys = this.slice(buf, size);
		var frames = [];
		mac.getMac(function(err, addr) {
			for (var i = 0 ; i < frameBodys.length; i++) {
				var bin = i.toString(2);
				while (bin.length < 4) {
					bin = '0' + bin;
				}
				var frame = {
					fc: '0804',
					did: '0080',
					addr: [dstMac || '000000000000', addr.split(':').join(''), '000000000000', '000000000000'],
					sc: '0' + parseInt(bin, 2).toString(16) + '00',
					fb: iconv.decode(frameBodys[i], 'GBK'),
					rawfb: frameBodys[i].toString('hex')
				}
				if (i == frameBodys.length - 1) {
					frame.fc = '0800';
				}
				frame.fcs = crc.crc32(new Buffer(frame.fc + frame.did + frame.addr[0] + frame.addr[1] + frame.addr[2] + frame.sc + frame.addr[3] + frame.rawfb, 'hex')).toString(16);
				delete frame.rawfb;
				frames.push(frame);
			}
			cb(err, frames);
		});
	};

	e802_11.slice = function(buf, size) {
		var totalLength = buf.length;
		var output = [];
		for (var i = 0; i < totalLength; i += size) {
			output.push(buf.slice(i, i + size));
		}
		return output;
	}

	return e802_11;
})();