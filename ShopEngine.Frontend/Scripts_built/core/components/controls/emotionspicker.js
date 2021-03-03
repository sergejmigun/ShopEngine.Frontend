app.registerComponent('emotionsPicker', 'UI', [
    '$',
    'Promise',
    'Utils.dom',
    'Services.eventsInitializer',
    'Collections',
    function ($, promise, dom, eventsInitializer, collections) {
        'use strict';
        var _emotionsMap = {
            angel: 'Face-Angel',
            angry: 'Face-Angry',
            cool: 'Face-Cool',
            crying: 'Face-Crying',
            devil: 'Face-Devilish',
            embarrassed: 'Face-Embarrassed',
            kiss: 'Face-Kiss',
            laugh: 'Face-Laugh',
            plain: 'Face-Plain',
            raspberry: 'Face-Raspberry',
            sad: 'Face-Sad',
            smile: 'Face-Smile',
            teeth: 'Face-Smile-Big',
            wink: 'Face-Smirk',
            surprise: 'Face-Surprise',
            tired: 'Face-Tired',
            question: 'Face-Uncertain',
            worried: 'Face-Worried'
        };
        function getEmotionPath(size, emotionSrc) {
            return '/Content/img/emotions/' + size + '/' + emotionSrc + '.png';
        }
        function getEmotionWrapper(size, path, emotionName) {
            return $('<img class="emotion-item emotion-item-' + size + '" />').attr('src', path).attr('alt', emotionName);
        }
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="emotions-wrapper" />'), _events = eventsInitializer.init(control, ['pick']);
                function setWrapperWidth(emotionsCount) {
                    var sideCount = Math.ceil(Math.sqrt(emotionsCount)), totalWidth = (6 + initData.size) * sideCount;
                    _$wrapper.append('<div class="clear" />');
                    _$wrapper.css('width', totalWidth);
                }
                function appendEmotion(emotionName, path) {
                    var $emotionWrapper = getEmotionWrapper(initData.size, path, emotionName);
                    $emotionWrapper.click(function () {
                        _events.pick.invoke({
                            html: dom.getOuterHtml($emotionWrapper),
                            name: emotionName
                        });
                    });
                    _$wrapper.append($emotionWrapper);
                }
                function initEmotion(emotionName, emotionSrc) {
                    var path = getEmotionPath(initData.size, emotionSrc);
                    appendEmotion(emotionName, path);
                }
                function initEmotions(emotions) {
                    var counter = 0;
                    collections.foreach(emotions, function (emotionName) {
                        var emotionSrc = _emotionsMap[emotionName];
                        if (emotionSrc) {
                            initEmotion(emotionName, emotionSrc);
                            counter += 1;
                        }
                    });
                    setWrapperWidth(counter);
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    if (!initData.emotions) {
                        var counter = 0;
                        collections.foreach(_emotionsMap, function (emotionSrc, emotionName) {
                            initEmotion(emotionName, emotionSrc);
                            counter += 1;
                        });
                        setWrapperWidth(counter);
                    }
                    else {
                        initEmotions(initData.emotions);
                    }
                    success(control);
                }
                control.remove = function () {
                    _$wrapper.remove();
                };
                return promise.create(function (success) {
                    init(success);
                });
            },
            getEmotionHtml: function (emotionName, size) {
                if (!_emotionsMap[emotionName]) {
                    return;
                }
                var emotionSize = size, path = getEmotionPath(emotionSize, _emotionsMap[emotionName]), $emotionWrapper = getEmotionWrapper(emotionSize, path, emotionName);
                return dom.getOuterHtml($emotionWrapper);
            }
        };
    }
]);
