app.registerComponent('chartHelper', 'Services', [
    '$',
    'UI.truncatedText',
    'Services.containerHelper',
    function (
        $: JQueryStatic,
        truncatedText: UI.ITruncatedTextFactory,
        containerHelper: Services.IContainerHelper) {
    'use strict';

    return {
        getBasicChartJsOptions: function (events) {
            return {
                onAnimationComplete: function () {
                    events.renderComplete.invoke();
                }
            };
        },
        appendToLegend: function ($legend, label, color, containerReady) {
            var $legendItem = $('<div class="legend-item legendItem" />'),
                $legendText = $('<div class="legend-label" />');

            $legendItem.append($('<span class="legend-color" />').css('background-color', color))
                .append($legendText);

            $legend.append($legendItem);
            truncatedText.init(containerHelper.appendTo($legendText, containerReady), {
                text: label
            });
        },
        placeLegend: function ($wrapper, $legend, chartOptions) {
            if (!chartOptions.showLegend) {
                return;
            }

            if (chartOptions.legendPosition === 'right') {
                $legend.css('top', chartOptions.height / 2 - $legend.height() / 2);
                $legend.css('left', chartOptions.width + 20);
            } else {
                $legend.css('top', chartOptions.height + 20);
                $legend.css('left', chartOptions.width / 2 - $legend.width() / 2);

                $wrapper.css('padding-bottom', $legend.height() + 20);
            }
        },
        initLegend: function ($wrapper, $legend, chartOptions) {
            if (!chartOptions.showLegend) {
                return;
            }

            if (chartOptions.showLegend) {
                $wrapper.append($legend);
            }

            $legend.css('width', chartOptions.legendPosition === 'right'
                ? 200
                : chartOptions.width / 2);
        },
        removeFromLegend: function ($legend, index) {
            $legend.find('.legendItem:eq(' + index + ')').remove();
        }
    } as Services.Charts.IChartHelper;
}]);