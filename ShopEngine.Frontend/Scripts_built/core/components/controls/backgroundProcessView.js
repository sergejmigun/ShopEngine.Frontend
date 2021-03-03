app.registerComponent('backgroundProcessView', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    'Services.apiService',
    'UI.progressBar',
    'Shared',
    function ($, promise, objects, eventsInitializer, apiService, progressBar, shared) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="bg-process-view" />'), _currentProgressInfo, _rootProcessId, _processData = {}, _events = eventsInitializer.init(control, ['requestCompleted', 'progressChanged', 'statusChanged']);
                function clearAndHide($el) {
                    $el.html('').hide();
                }
                function getProcessData(processId, processTitle, $wrapper) {
                    if (!_processData[processId]) {
                        var $processItemContainer = $('<div class="bg-process-item" />'), $progressbarContainer = $('<div class="bg-process-item-bar" />'), $resultMessageContainer = $('<div class="bg-process-item-result-message" />'), $innerProcessContainer = $('<div class="bg-process-item-inner" />').hide();
                        $wrapper.show().append($processItemContainer);
                        $processItemContainer.append($('<h4 />').text(processTitle))
                            .append($progressbarContainer)
                            .append($resultMessageContainer)
                            .append($innerProcessContainer);
                        _processData[processId] = {
                            container: $processItemContainer,
                            progressbarContainer: $progressbarContainer,
                            resultMessageContainer: $resultMessageContainer,
                            innerProcessContainer: $innerProcessContainer,
                            remove: function () {
                                $processItemContainer.remove();
                            }
                        };
                    }
                    return _processData[processId];
                }
                function displayInfo(progressInfo, processTitle, $wrapper) {
                    var processData = getProcessData(progressInfo.processId, processTitle, $wrapper);
                    function renderMessage(css) {
                        processData.resultMessageContainer.append($('<i class="fa" />').addClass(css))
                            .append($('<span class="margin-l-10" />').text(progressInfo.resultMessage));
                    }
                    function renderCompleted() {
                        clearAndHide(processData.progressbarContainer);
                        if (processData.innerProces) {
                            processData.innerProces.remove();
                        }
                        if (progressInfo.status === UI.IProcessStatus.Completed) {
                            renderMessage('fa-check color-green');
                        }
                        else if (progressInfo.status === UI.IProcessStatus.Aborted) {
                            renderMessage('fa-exclamation color-red');
                        }
                        else if (progressInfo.status === UI.IProcessStatus.Canceled) {
                            renderMessage('fa-ban color-dark-gray');
                        }
                        else if (progressInfo.status === UI.IProcessStatus.CompletedWithErrors) {
                            renderMessage('fa-exclamation-triangle color-yellow');
                        }
                        if (initData.renderResult) {
                            var $resultWrapper = $('<div />');
                            processData.resultMessageContainer.append($resultWrapper);
                            initData.renderResult($resultWrapper, progressInfo.result);
                        }
                    }
                    function renderInProgress() {
                        processData.resultMessageContainer.html('');
                        if (initData.progressable) {
                            var progressData = {
                                progress: progressInfo.progress,
                                status: progressInfo.statusMessage,
                                enableProgressAnimation: true
                            };
                            if (!processData.progressBar) {
                                progressBar.init(processData.progressbarContainer, progressData).then(function (progressBar) {
                                    processData.progressBar = progressBar;
                                });
                            }
                            else {
                                processData.progressBar.update(progressData);
                            }
                        }
                        else {
                            if (!processData.spinner) {
                                processData.spinner = $('<div class="spinner-wrapper">'
                                    + '<i class="glyphicon glyphicon-refresh spinning font-20" />'
                                    + '<span class="margin-l-15 statusMessage" /></div>');
                                processData.progressbarContainer.append(processData.spinner);
                            }
                            processData.spinner.find('.statusMessage').text(progressInfo.statusMessage);
                        }
                        if (progressInfo.innerProcess) {
                            processData.innerProces = displayInfo(progressInfo.innerProcess.progressInfo, progressInfo.innerProcess.title, processData.innerProcessContainer);
                        }
                    }
                    function renderNotStarted() {
                        processData.resultMessageContainer.html('<span class="color-dark-gray">The process is not started</span>');
                    }
                    if (progressInfo.status === 0) {
                        renderNotStarted();
                    }
                    else if (progressInfo.status === 1) {
                        renderInProgress();
                    }
                    else {
                        renderCompleted();
                    }
                    return processData;
                }
                function run() {
                    return apiService.get(initData.getProgressUrl).then(function (progressInfo) {
                        if (_rootProcessId && _rootProcessId !== progressInfo.processId) {
                            throw 'Invalid process ID';
                        }
                        _events.requestCompleted.invoke(progressInfo);
                        _rootProcessId = progressInfo.processId;
                        if (objects.tryGet(_currentProgressInfo, 'status') !== progressInfo.status) {
                            _events.statusChanged.invoke(progressInfo.status);
                        }
                        if (objects.tryGet(_currentProgressInfo, 'progress') !== progressInfo.progress) {
                            _events.progressChanged.invoke(progressInfo.progress);
                        }
                        displayInfo(progressInfo, initData.processTitle, _$wrapper);
                        _currentProgressInfo = progressInfo;
                        // not started or in progress
                        if (progressInfo.status === 0 || progressInfo.status === 1) {
                            shared.window.setTimeout(function () {
                                run();
                            }, initData.pingInterval);
                        }
                    });
                }
                function init(success) {
                    if (!initData.getProgressUrl) {
                        throw 'Get info url is not specified';
                    }
                    container.setContent(_$wrapper);
                    if (!initData.pingInterval) {
                        initData.pingInterval = 1500;
                    }
                    if (initData.progressInfo) {
                        displayInfo(initData.progressInfo, initData.processTitle, _$wrapper);
                    }
                    if (initData.autoStart) {
                        run();
                    }
                    success(control);
                }
                control.start = function () {
                    run();
                };
                control.cancel = function () {
                    if (!initData.cancelUrl) {
                        throw 'Cancel url is not specified';
                    }
                    if (objects.tryGet(_currentProgressInfo, 'isCancelable')) {
                        apiService.post(initData.cancelUrl, _currentProgressInfo.processId);
                    }
                };
                control.getInfo = function (processId) {
                    return objects.clone(_processData[processId || _rootProcessId]);
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);
