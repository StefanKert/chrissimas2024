var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width, height, lastNow;
var snowflakes;
var maxSnowflakes = 100;
var settledSnowflakes = [];
var groundLevel;

function init() {
    snowflakes = [];
    settledSnowflakes = [];
    groundLevel = height;
    resize();
    render(lastNow = performance.now());
}

function render(now) {
    requestAnimationFrame(render);

    var elapsed = now - lastNow;
    lastNow = now;

    ctx.clearRect(0, 0, width, height);
    if (snowflakes.length < maxSnowflakes)
        snowflakes.push(new Snowflake());

    ctx.fillStyle = ctx.strokeStyle = '#fff';

    // Draw settled snowflakes first
    settledSnowflakes.forEach(function(snowflake) {
        ctx.beginPath();
        ctx.arc(snowflake.x, snowflake.y, snowflake.size * 0.1, 0, Math.PI * 2, false);
        ctx.fill();
    });

    // Draw active snowflakes
    snowflakes.forEach(function (snowflake) { return snowflake.update(elapsed, now); });
}

function pause() {
    cancelAnimationFrame(render);
}

function resume() {
    lastNow = performance.now();
    requestAnimationFrame(render);
}

var Snowflake = function () {
    function Snowflake() {
        _classCallCheck(this, Snowflake);
        this.spawn();
    } _createClass(Snowflake, [{
        key: 'spawn', value: function spawn() {
            var anyY = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            this.x = rand(0, width);
            this.y = anyY === true ?
                rand(-50, height + 50) :
                rand(-50, -10);
            this.xVel = rand(-.05, .05);
            this.yVel = rand(.02, .1);
            this.angle = rand(0, Math.PI * 2);
            this.angleVel = rand(-.001, .001);
            this.size = rand(7, 12) 
            this.sizeOsc = rand(.01, .5);
        }
    }, {
        key: 'update', value: function update(elapsed, now) {
            var xForce = rand(-.001, .001);

            if (Math.abs(this.xVel + xForce) < .075) {
                this.xVel += xForce;
            }

            this.x += this.xVel * elapsed;
            this.y += this.yVel * elapsed;
            this.angle += this.xVel * 0.05 * elapsed;

            // Check for collision with ground or settled snowflakes
            if (this.y + this.size >= groundLevel) {
                this.settle();
                return;
            }

            // Check collision with settled snowflakes
            for (var i = 0; i < settledSnowflakes.length; i++) {
                var settled = settledSnowflakes[i];
                var dx = this.x - settled.x;
                var dy = this.y - settled.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < (this.size + settled.size) * 0.01) { // Reduced collision distance (was 0.5)
                    this.settle();
                    return;
                }
            }

            if (this.x + this.size < 0 || this.x - this.size > width) {
                this.spawn();
            }

            this.render();
        }
    }, {
        key: 'settle', value: function settle() {
            this.yVel = 0;
            this.xVel = 0;
            settledSnowflakes.push({
                x: this.x,
                y: this.y,
                size: this.size
            });
            this.spawn();
        }
    }, {
        key: 'render', value: function render() {
            ctx.save(); var
                x = this.x, y = this.y, angle = this.angle, size = this.size;
            ctx.beginPath();
            ctx.arc(x, y, size * 0.15, 0, Math.PI * 2, false); // Smaller rendered size (was 0.2)
            ctx.fill();
            ctx.restore();
        }
    }]); return Snowflake;
}();

// Utils
var rand = function rand(min, max) { return min + Math.random() * (max - min); };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    groundLevel = height;
}

window.addEventListener('resize', resize);
window.addEventListener('blur', pause);
window.addEventListener('focus', resume);
init();