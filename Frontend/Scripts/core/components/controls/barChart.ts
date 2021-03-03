app.registerComponent('barChart', 'UI', [
    '$',
    'Promise',
    'Utils.colors',
    'Collections',
    'Services.eventsInitializer',
    'Services.chartHelper',
    'Utils.strings',
    function ($: JQueryStatic,
        promise: IPromise,
        colors: Utils.IColors,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        chartHelper: Services.Charts.IChartHelper,
        strings: Utils.IStrings) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IBarChart,
                    _$wrapper = $('<div class="chart-wrapper" />'),
                    _$canvas = $('<canvas id="myChart" />'),
                    _$legend = $('<div class="legend-wrapper" />'),
                    _barChart,
                    _events = eventsInitializer.init(control, ['renderComplete', 'click']);

                function getChartInstance() {
                    var ctx = (_$canvas.get(0) as any).getContext("2d");

                    return new window['Chart'](ctx);
                }

                function getChartJsDataSet(dataSet: UI.BarChartDataSet) {
                    if (!dataSet.color) {
                        dataSet.color = colors.getRandomColor();
                    }

                    if (initData.showLegend) {
                        chartHelper.appendToLegend(_$legend, dataSet.label, dataSet.color, container.ready());
                    }

                    var rgbColor = colors.hexToRgb(dataSet.color),
                        result = {
                            data: dataSet.data,
                            label: dataSet.label,
                            fillColor: dataSet.color
                        } as any;

                    if (rgbColor) {
                        result.strokeColor = strings.format("rgba({0},{1},{2},0.8)", rgbColor.r, rgbColor.g, rgbColor.b);
                        result.highlightFill = strings.format("rgba({0},{1},{2},0.75)", rgbColor.r, rgbColor.g, rgbColor.b);
                        result.highlightStroke = strings.format("rgba({0},{1},{2},1)", rgbColor.r, rgbColor.g, rgbColor.b);
                    }

                    return result;
                }

                function initBarChart() {
                    chartHelper.initLegend(_$wrapper, _$legend, initData);

                    var chartJsData = {
                        labels: initData.labels,
                        datasets: collections.from(initData.dataSets).select(getChartJsDataSet).toArray()
                    };

                    chartHelper.placeLegend(_$wrapper, _$legend, initData);

                    if (initData.direction === UI.BarChartDirection.Horizontal) {
                        _barChart = getChartInstance().HorizontalBar(chartJsData, chartHelper.getBasicChartJsOptions(_events));
                    } else {
                        _barChart = getChartInstance().Bar(chartJsData, chartHelper.getBasicChartJsOptions(_events));
                    }

                    _$canvas[0].onclick = function (evt) {
                        var activeBars = _barChart.getBarsAtEvent(evt);

                        if (activeBars.length) {
                            var eventData = {
                                label: activeBars[0].label,
                                bars: collections.from(activeBars).select(function (chartJsElement: any) {
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

                    initBarChart();

                    success(control);
                }

                control.addSeria = function (label, data) {
                    _barChart.addData(data, label);

                    collections.foreach(_barChart.datasets as any[], function (dataset) {
                        //Chart.js bug - no highlights for newly added seria
                        var lastBar = dataset.bars[initData.labels.length - 1],
                            prevBar = dataset.bars[initData.labels.length - 2];

                        lastBar.highlightFill = prevBar.highlightFill;
                        lastBar.highlightStroke = prevBar.highlightStroke;
                    });
                };

                control.addDataSet = function (dataSet) {
                    var chartJsDataSet = getChartJsDataSet(dataSet);
                    var bars = [];

                    collections.foreach(chartJsDataSet.data, function (value) {
                        bars.push(new _barChart.BarClass({
                            value: value,
                            label: chartJsDataSet.label,
                            x: 0,
                            y: 0,
                            width: _barChart.scale.calculateBarWidth(_barChart.datasets.length + 1),
                            strokeColor: chartJsDataSet.strokeColor,
                            fillColor: chartJsDataSet.fillColor,
                            highlightFill: chartJsDataSet.highlightFill,
                            highlightStroke: chartJsDataSet.highlightStroke
                        }));
                    });

                    _barChart.datasets.push({
                        bars: bars
                    });

                    _barChart.update();
                };

                control.changeValue = function (seriaIndex, dataSetIndex, value) {
                    _barChart.datasets[dataSetIndex].bars[seriaIndex].value = value;
                    _barChart.update();
                };

                control.removeDataSet = function (dataSetIndex) {
                    collections.removeByIndex(_barChart.datasets, dataSetIndex);
                    chartHelper.removeFromLegend(_$legend, dataSetIndex);
                    _barChart.update();
                };

                control.removeSeria = function (seriaIndex) {
                    collections.removeByIndex(_barChart.scale.xLabels, seriaIndex);
                    _barChart.scale.valuesCount -= 1;
                    _barChart.scale.fit();

                    collections.foreach(_barChart.datasets as any[], function (dataset) {
                        collections.removeByIndex(dataset.bars, seriaIndex);
                    });

                    _barChart.update();
                };

                control.remove = function () {
                    _$wrapper.remove();
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IBarChartFactory;
    }
]);