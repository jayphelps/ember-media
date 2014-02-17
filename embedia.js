(function (root, Ember) {
    var get = Ember.get, set = Ember.set, on = Ember.on,
        computed = Ember.computed,
        alias = computed.alias,
        arraySlice = Array.prototype.slice;

    var Embedia = root.Embedia = Ember.Namespace.create();

    var View = Embedia.View = Ember.View.extend({

    });

    var required = Ember.required;

    Embedia.VideoInterfaceMixin = Ember.Mixin.create({
        canPlayType: required(Function)
    });

    Embedia.computed = function () {
        return computed.appy(Ember, arguments);
    };

    Embedia.computed.readOnlyElementAttributeGetter = function (attributeName) {
        return computed(function (defaultName) {
            attributeName = attributeName || defaultName;
            var el = get(this, 'element');
            return (el) ? el.getAttribute(attributeName) : undefined;
        }).property().volatile().readOnly();
    };

    Embedia.computed.readOnlyElementPropertyGetter = function (propertyName) {
        return computed(function (defaultName) {
            propertyName = propertyName || defaultName;
            var el = get(this, 'element');
            return (el) ? el[propertyName] : undefined;
        }).property().volatile().readOnly();
    };

    var EmberLogger = Ember.Logger;

    function loggerMethod(name) {
        var method = EmberLogger[name];
        var wrapper = function () {
            method.apply(EmberLogger, arguments);
        };

        wrapper.displayName = 'console.' + name;

        return wrapper;
    }

    Embedia.log = loggerMethod('log');
    Embedia.warn = loggerMethod('warn');
    Embedia.error = loggerMethod('error');
    Embedia.info = loggerMethod('info');
    Embedia.debug = loggerMethod('debug');
    Embedia.assert = loggerMethod('assert');

    Embedia.mediaEvents = {
        abort: 'didAbortPlayback',
        canplay: 'canPlay',
        canplaythrough: 'canPlayThrough',
        durationchange: 'durationDidChange',
        emptied: 'didEmptyMedia',
        ended: 'didEndPlayback',
        error: 'error',
        loadeddata: 'didLoadFirstFrame',
        loadedmetadata: 'didLoadMetaData',
        loadstart: 'willStartLoadingMedia',
        pause: 'didPausePlayback',
        play: 'didStartPlayback',
        playing: 'didStartPlaying',
        progress: 'didReceiveProgress',
        ratechange: 'playbackSpeedDidChange',
        seeked: 'didSeek',
        seeking: 'willSeek',
        stalled: 'didStall',
        suspend: 'didSuspend',
        timeupdate: 'currentTimeDidChange',
        volumechange: 'volumeDidChange',
        waiting: 'didStartWaiting'
    };

    var EmbediaComputed = Embedia.computed,
        readOnlyElementAttributeGetter = EmbediaComputed.readOnlyElementAttributeGetter,
        readOnlyElementPropertyGetter = EmbediaComputed.readOnlyElementPropertyGetter,
        log = Embedia.log;

    function unshiftArguments(targetArgs) {
        var targetArgs = arraySlice.call(targetArgs),
            addArgs = arraySlice.call(arguments, 1);
        
        targetArgs.unshift.apply(targetArgs, addArgs);

        return targetArgs;
    }

    function elementGuard(callback) {
        return function () {
            var element = get(this, 'element');
            if (element) {
                alert(this._methodName);
                callback.apply(this, unshiftArguments(arguments, element));
            } else {
                throw new Error('asdf');
                //throw new Ember.Error();
            }
        };
    }

    Embedia.MediaMixin = Ember.Mixin.create({
        attributeBindings: [
            'width',
            'height',
            'src',
            'loop',
            'audioTracks',
            'shouldAutoBuffer:autobuffer',
            'shouldAutoPlay:autoplay',
            'showNativeControls:controls',
            'crossOrigin:crossorigin',
            'defaultMuted:defaultMuted',
            'isMuted:muted',
            'currentSrc',
            'defaultPlaybackRate'
        ],

        _mediaEvents: Embedia.mediaEvents,
        audioTracks: null,
        bufferedTimeRange: null,
        currentSrc: null,
        currentTime: null,
        crossOrigin: null,
        currentTime: readOnlyElementPropertyGetter(),
        defaultPlaybackRate: null,
        duration: readOnlyElementPropertyGetter(),
        shouldAutoBuffer: false,
        shouldAutoPlay: false,
        shouldLoop: false,
        showNativeControls: true,
        defaultMuted: false,
        isMuted: false,

        seekTo: elementGuard(function (element, time) {
            element.currentTime = time;
        }),

        canPlayType: function () {
            get(this, 'element')
        },

        _getElement: function () {

        },

        _didInsertElement: on('didInsertElement', function () {
            this._bindMediaEvents();
        }),

        _willDestroyElement: on('willDestroyElement', function () {
            this._unbindMediaEvents();
        }),

        _bindMediaEvents: function () {
            var events = this._mediaEvents;

            for (var key in events) {
                if (events.hasOwnProperty(key)) {
                    this._bindMediaElementEvent(key, events[key]);
                }
            }
        },

        _unbindMediaEvents: function () {
            // All media events are added under the .embedia namespace so we can
            // remove them all at once.
            this.$().off('.embedia');
        },

        /**
         * Internal helper to do the actual event binding using jQuery.
         * 
         * @param  {String}     nativeEventName The native browser event to use.
         * @param  {String}     eventName       The Ember-idiomatic event name
         */
        _bindMediaElementEvent: function (nativeEventName, eventName) {
            var view = this;

            this.$().on(nativeEventName + '.embedia', function () {
                view.trigger.apply(view, unshiftArguments(arguments, eventName));
            });
        }
    });
        
    Embedia.MediaMixin.reopen(generateMediaEventHandlers());

    function generateMediaEventHandlers(VideoView) {
        var info = Embedia.info,
            inspect = Ember.inspect,
            mediaEvents = Embedia.mediaEvents,
            mediaEventHandlers = {};

        for (var key in mediaEvents) {
            if (mediaEvents.hasOwnProperty(key)) {
                addMediaEventHandler(mediaEventHandlers, key, mediaEvents[key]);
            }
        }

        return mediaEventHandlers;

        function addMediaEventHandler(obj, nativeEventName, eventName) {
            obj[eventName] = function () {
                info('MEDIA EVENT: ' + inspect(this) + ' ' + nativeEventName + ' -> ' + eventName);
            };
        }
    }

    Embedia.VideoView = View.extend(Embedia.MediaMixin, {
        tagName: 'video',

        didInsertElement: function () {
            this._super();

            window.videoView = this;
        }
    });

})(this, this.Ember);

var App = Ember.Application.create();

App.IndexView = Embedia.VideoView.extend({
    src: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
});