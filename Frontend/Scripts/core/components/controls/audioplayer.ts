app.registerComponent('audioPlayer', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    'Services.apiService',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        apiService: Services.IApiService) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IAudioPlayer,
                    _mediaData = [],
                    _currentMediaIndex: number,
                    _$wrapper = $('<div class="player-container" />'),
                    _$element: JQuery,
                    _events = eventsInitializer.init(control, ['playStart', 'playEnd']);

                function getCurrentMedia() {
                    return _mediaData[_currentMediaIndex];
                }

                function checkMedia() {
                    if (!_mediaData.length) {
                        throw 'No media';
                    }
                }

                function setPlayerMedia() {
                    var media = _mediaData[_currentMediaIndex];
                    _$element['jPlayer']("setMedia", media);
                }

                function setInitialPlayerMedia() {
                    _currentMediaIndex = 0;
                    setPlayerMedia();
                }

                function initPlayer(success, options?) {
                    var jPlayerOptions = {
                        ready: function () {
                            success(control);
                        },
                        loop: initData.repeat,
                        repeat: function (event) {
                            initData.repeat = event['jPlayer'].options.loop;
                        },
                        play: function () {
                            _events.playStart.invoke(getCurrentMedia());
                        }
                    };

                    if (options) {
                        objects.map(options, jPlayerOptions);
                    }

                    _$element['jPlayer'](jPlayerOptions);
                }

                function init(success) {
                    container.setContent(_$wrapper);

                    if (initData.noSkin) {
                        _$element = _$wrapper;
                        initPlayer(success);
                    } else {
                        var playerId = 'audioPlayer_' + Date.now();
                        _$wrapper.attr('id', playerId);

                        apiService.getTemplateHtml('AudioPlayerTemplate').then(function (html) {
                            _$wrapper.html(html);

                            var $playPrev = _$wrapper.find('.jp-previous'),
                                $playNext = _$wrapper.find('.jp-next'),
                                playerOptions = {
                                    useStateClassSkin: true,
                                    cssSelectorAncestor: '#' + playerId
                                } as any;

                            if (initData.palylist) {
                                _$wrapper.addClass('audio-player-playlist');

                                $playNext.click(function () {
                                    control.playNext();
                                    $playNext.blur();
                                });

                                $playPrev.click(function () {
                                    control.playPrev();
                                    $playPrev.blur();
                                });

                                playerOptions.ended = function () {
                                    _events.playEnd.invoke(getCurrentMedia());
                                    control.playNext();
                                };

                            } else {
                                playerOptions.ended = function () {
                                    _events.playEnd.invoke(getCurrentMedia());
                                };

                                $playNext.remove();
                                $playPrev.remove();
                            }

                            _$element = _$wrapper.find('.jp-jplayer');
                            initPlayer(success, playerOptions);
                        });
                    }
                }

                control.setMedia = function (title, source, sourceFormat) {
                    if (!sourceFormat) {
                        sourceFormat = 'mp3';
                    }

                    var media = {
                        title: title
                    };

                    media[sourceFormat] = source;
                    _mediaData.push(media);

                    if (!initData.palylist) {
                        setInitialPlayerMedia();
                    } else {
                        if (_mediaData.length === 1) {
                            setInitialPlayerMedia();
                        }
                    }
                };

                control.play = function () {
                    checkMedia();
                    _$element['jPlayer']("play");
                };

                control.playNext = function () {
                    if (!initData.palylist) {
                        return;
                    }

                    checkMedia();
                    var index = _currentMediaIndex + 1;

                    if (index >= _mediaData.length) {
                        if (!initData.repeat) {
                            return;
                        }

                        setInitialPlayerMedia();
                    } else {
                        _currentMediaIndex = index;
                        setPlayerMedia();
                    }

                    _$element['jPlayer']("play");
                };

                control.playPrev = function () {
                    if (!initData.palylist) {
                        return;
                    }

                    checkMedia();
                    var index = _currentMediaIndex - 1;

                    if (index < 0) {
                        if (!initData.repeat) {
                            return;
                        }

                        _currentMediaIndex = _mediaData.length - 1;
                    } else {
                        _currentMediaIndex = index;
                    }

                    setPlayerMedia();
                    _$element['jPlayer']("play");
                };

                control.pause = function () {
                    checkMedia();
                    _$element['jPlayer']("pause");
                };

                control.stop = function () {
                    checkMedia();
                    _$element['jPlayer']("stop");
                };

                control.clear = function () {
                    checkMedia();
                    _$element['jPlayer']("clearMedia");
                };

                control.setVolume = function (volume) {
                    _$element['jPlayer']("volume", volume);
                };

                control.mute = function () {
                    _$element['jPlayer']("mute", true);
                };

                control.unMute = function () {
                    _$element['jPlayer']("unmute", true);
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IAudioPlayerFactory;
    }
]);