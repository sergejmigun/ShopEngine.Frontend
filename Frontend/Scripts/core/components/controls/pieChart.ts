/*global Chart*/
app.registerComponent('pieChart', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Utils.colors',
    'Collections',
    'Services.eventsInitializer',
    'Services.chartHelper',
    'Utils.strings',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        colors: Utils.IColors,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        chartHelper: Services.Charts.IChartHelper,
        strings: Utils.IStrings) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IPieChart,
                    _$wrapper = $('<div class="chart-wrapper" />'),
                    _$canvas = $('<canvas id="myChart" />'),
                    _$legend = $('<div class="legend-wrapper" />'),
                    _total = 0,
                    _pieChart,
                    _events = eventsInitializer.init(control, ['renderComplete', 'click'])

                function getChartInstance() {
                    var ctx = objects.tryCall(_$canvas.get(0), 'getContext', '2d') as any;

                    ctx.total = function () {
                        return _total;
                    };

                    return new window['Chart'](ctx);
                }

                function getChartJsDataSet(dataSet: UI.IPieChartDataSet) {
                    if (!dataSet.color) {
                        dataSet.color = colors.getRandomColor();
                    }

                    if (initData.showLegend) {
                        chartHelper.appendToLegend(_$legend, dataSet.label, dataSet.color, container.ready());
                    }

                    _total += dataSet.value;

                    var rgbColor = colors.hexToRgb(dataSet.color),
                        result = {
                            value: dataSet.value,
                            label: dataSet.label,
                            color: dataSet.color
                        } as any;

                    if (rgbColor) {
                        result.highlight = strings.format("rgba({0},{1},{2},0.8)", rgbColor.r, rgbColor.g, rgbColor.b);
                    }

                    return result;
                }

                function initPieChart() {
                    chartHelper.initLegend(_$wrapper, _$legend, initData);

                    var chartJsData = collections.from(initData.dataSets).select(getChartJsDataSet).toArray();

                    var chartJsOptions = chartHelper.getBasicChartJsOptions(_events);
                    chartJsOptions.animationEasing = 'easeInOutQuart';
                    chartJsOptions.animationSteps = 45;

                    chartHelper.placeLegend(_$wrapper, _$legend, initData);

                    if (initData.showPercents) {
                        chartJsOptions.tooltipTemplate = "<%if (label){%><%=label %>: <%}%><%= Math.round(value * 100 / ctx.total()) + '%' %>";
                    }

                    if (initData.doughnut) {
                        _pieChart = objects.tryCall(getChartInstance(), 'Doughnut', chartJsData, chartJsOptions);
                    } else {
                        _pieChart = objects.tryCall(getChartInstance(), 'Pie', chartJsData, chartJsOptions);
                    }

                    _$canvas[0].onclick = function (evt) {
                        var segments = _pieChart.getSegmentsAtEvent(evt);

                        if (segments.length) {
                            var eventData = {
                                label: segments[0].label,
                                value: segments[0].value
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

                    initPieChart();

                    success(control);
                }

                control.addData = function (data, dataIndex) {
                    var chartJsDataSet = getChartJsDataSet(data);
                    _pieChart.addData(chartJsDataSet, dataIndex);
                };

                control.removeData = function (dataIndex) {
                    _total = _total - _pieChart.segments[dataIndex].value;
                    _pieChart.removeData(dataIndex);
                    chartHelper.removeFromLegend(_$legend, dataIndex);
                };

                control.changeValue = function (dataIndex, value) {
                    _total = _total - _pieChart.segments[dataIndex].value + value;
                    _pieChart.segments[dataIndex].value = value;
                    _pieChart.update();
                };

                control.remove = function () {
                    _$wrapper.remove();
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IPieChartFactory;
    }
]);