app.registerComponent('progressBar', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    function ($, promise, objects) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="progress-bar-wrapper" />'), _$valueWrapper = $('<div class="progress-value" />'), _$progressBarContainer = $('<div class="progress-bar-inner" />'), _$progressBarStatus = $('<div class="progress-bar-status" />');
                function setStatus(status) {
                    _$progressBarStatus.text(status);
                }
                function setProgress(progress) {
                    var progressText = Math.round(progress) + '%', progressValue = progress + '%';
                    if (initData.enableProgressAnimation && progress > 0) {
                        var animateOptions = {
                            duration: 400,
                            easing: 'swing'
                        };
                        var animatedProperty = {
                            width: progressValue
                        };
                        _$valueWrapper.animate(animatedProperty, animateOptions).text(progressText);
                        _$progressBarContainer.animate(animatedProperty, animateOptions);
                    }
                    else {
                        _$valueWrapper.css('width', progressValue).text(progressText);
                        _$progressBarContainer.css('width', progressValue);
                    }
                }
                function setData(data) {
                    if (data.progress !== undefined) {
                        setProgress(data.progress);
                    }
                    if (data.status !== undefined) {
                        setStatus(data.status);
                    }
                }
                function init(success) {
                    _$wrapper.append(_$valueWrapper);
                    _$wrapper.append(_$progressBarContainer.wrap('<div class="progress-bar-container" />').parent());
                    _$wrapper.append(_$progressBarStatus);
                    container.setContent(_$wrapper);
                    if (objects.isNullOrUndefined(initData.progress)) {
                        initData.progress = 0;
                    }
                    setData(initData);
                    success(control);
                }
                control.update = function (data) {
                    setData(data);
                };
                control.updateProgress = function (progress) {
                    setProgress(progress);
                };
                control.updateStatus = function (status) {
                    setStatus(status);
                };
                control.remove = function () {
                    _$wrapper.remove();
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
