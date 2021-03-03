app.registerComponent('lineChart', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Utils.colors',
    'Collections',
    'Services.eventsInitializer',
    'Services.chartHelper',
    function ($, promise, objects, colors, collections, eventsInitializer, chartHelper) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="chart-wrapper" />'), _$canvas = $('<canvas id="myChart" />'), _$legend = $('<div class="legend-wrapper" />'), _lineChart, _events = eventsInitializer.init(control, ['renderComplete', 'click']);
                function getChartInstance() {
                    var ctx = objects.tryCall(_$canvas.get(0), 'getContext', '2d');
                    return new window['Chart'](ctx);
                }
                function getChartJsDataSet(dataSet) {
                    if (!dataSet.color) {
                        dataSet.color = colors.getRandomColor();
                    }
                    if (initData.showLegend) {
                        chartHelper.appendToLegend(_$legend, dataSet.label, dataSet.color, container.ready());
                    }
                    return {
                        data: dataSet.data,
                        label: dataSet.label,
                        strokeColor: dataSet.color,
                        pointColor: dataSet.color,
                        pointStrokeColor: '#fff',
                        pointHighlightFill: '#fff',
                        pointHighlightStroke: dataSet.color
                    };
                }
                function initLineChart() {
                    chartHelper.initLegend(_$wrapper, _$legend, initData);
                    var chartJsData = {
                        labels: initData.labels,
                        datasets: collections.from(initData.dataSets).select(getChartJsDataSet).toArray()
                    };
                    var chartJsOptions = chartHelper.getBasicChartJsOptions(_events);
                    chartJsOptions.datasetFill = false;
                    chartJsOptions.bezierCurve = initData.curved;
                    chartJsOptions.datasetStroke = !initData.hideStrokes;
                    chartJsOptions.pointDot = !initData.hidePoints;
                    chartHelper.placeLegend(_$wrapper, _$legend, initData);
                    _lineChart = objects.tryCall(getChartInstance(), 'Line', chartJsData, chartJsOptions);
                    _$canvas[0].onclick = function (evt) {
                        var activePoints = _lineChart.getPointsAtEvent(evt);
                        if (activePoints.length) {
                            var eventData = {
                                label: activePoints[0].label,
                                points: collections.from(activePoints).select(function (chartJsElement) {
                                    return {
                                        label: chartJsElement.datasetLabel,
                                        value: chartJsElement.value
                                    };
                                }).toArray()
                            };
                            _events.click.invoke(eventData);
                        }
                    };
                }
                function init(success) {
                    var $canvasWrapper = $('<div class="chart-canvaswrapper" />');
                    $canvasWrapper.append(_$canvas);
                    _$wrapper.append($canvasWrapper);
                    container.setContent(_$wrapper);
                    if (!initData.width) {
                        initData.width = 600;
                    }
                    if (!initData.height) {
                        initData.height = 400;
                    }
                    _$canvas.attr('width', initData.width);
                    _$canvas.attr('height', initData.height);
                    initLineChart();
                    success(control);
                }
                control.addSeria = function (label, data) {
                    _lineChart.addData(data, label);
                    collections.foreach(_lineChart.datasets, function (dataset) {
                        // chart.js bug - no highlights for newly added seria
                        var lastPoint = dataset.points[initData.labels.length - 1], prevPoint = dataset.points[initData.labels.length - 2];
                        lastPoint.highlightFill = prevPoint.highlightFill;
                        lastPoint.highlightStroke = prevPoint.highlightStroke;
                    });
                };
                control.addDataSet = function (dataSet) {
                    var chartJsDataSet = getChartJsDataSet(dataSet);
                    var points = [];
                    collections.foreach(chartJsDataSet.data, function (value, i) {
                        points.push(new _lineChart.PointClass({
                            value: value,
                            datasetLabel: chartJsDataSet.label,
                            fillColor: chartJsDataSet.pointColor,
                            highlightFill: chartJsDataSet.pointHighlightFill,
                            highlightStroke: chartJsDataSet.pointHighlightStroke,
                            label: initData.labels[i],
                            strokeColor: chartJsDataSet.pointStrokeColor,
                            x: 0,
                            y: 0
                        }));
                    });
                    _lineChart.datasets.push({
                        label: chartJsDataSet.label,
                        strokeColor: chartJsDataSet.strokeColor,
                        points: points
                    });
                    _lineChart.update();
                };
                control.changeValue = function (seriaIndex, dataSetIndex, value) {
                    _lineChart.datasets[dataSetIndex].points[seriaIndex].value = value;
                    _lineChart.update();
                };
                control.removeDataSet = function (dataSetIndex) {
                    collections.removeByIndex(_lineChart.datasets, dataSetIndex);
                    chartHelper.removeFromLegend(_$legend, dataSetIndex);
                    _lineChart.update();
                };
                control.removeSeria = function (seriaIndex) {
                    collections.removeByIndex(_lineChart.scale.xLabels, seriaIndex);
                    _lineChart.scale.valuesCount -= 1;
                    _lineChart.scale.fit();
                    collections.foreach(_lineChart.datasets, function (dataset) {
                        collections.removeByIndex(dataset.points, seriaIndex);
                    });
                    _lineChart.update();
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
