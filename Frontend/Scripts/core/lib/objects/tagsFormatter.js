app.registerComponent('tagsFormatter', 'Lib.objects', [
    'Collections',
    'Utils.strings',
    'Utils.objects',
    function (collections, strings, objects) {
        'use strict';

        var formatter = {};

        function MatchingContext(startTag, endTag, matched) {
            var self = this,
                body,
                current = '',
                maxLength = startTag.length,
                currentIndex;

            if (endTag.length > maxLength) {
                maxLength = endTag.length;
            }

            function compare(target) {
                if (current.length < target.length) {
                    return false;
                }

                return current.substr(current.length - target.length) === target;
            }

            function match() {
                body = body.substring(0, body.length - (endTag.length - 1));
                var fullLength = startTag.length + endTag.length + body.length;

                matched({
                    body: body,
                    startIndex: currentIndex + 1 - fullLength,
                    fullLength: fullLength
                });
            }

            function trackSameSymbols(symbol) {
                if (compare(startTag)) {
                    if (body !== undefined) {
                        match();
                    }

                    body = '';
                } else {
                    if (body !== undefined) {
                        body += symbol;
                    }
                }
            }

            function trackDifferentSymbols(symbol) {
                function handleStart() {
                    body = '';
                }

                function handleEnd() {
                    if (body !== undefined) {
                        match();
                        body = undefined;
                    }
                }

                function handleOther(symbol) {
                    if (body !== undefined) {
                        body += symbol;
                    }
                }

                if (compare(startTag)) {
                    handleStart(symbol);
                } else if (compare(endTag)) {
                    handleEnd(symbol);
                } else {
                    handleOther(symbol);
                }
            }

            self.track = function (symbol, originalIndex) {
                currentIndex = originalIndex;

                if (current.length < maxLength) {
                    current += symbol;
                } else {
                    current = current.substr(1) + symbol;
                }

                var method = startTag !== endTag
                    ? trackDifferentSymbols
                    : trackSameSymbols;

                method(symbol);
            };
        }

        formatter.format = function (str, formatters) {
            var matchers = [],
                matchedResults = [],
                offset = 0;

            // register matching contexts
            collections.foreach(formatters, function (formatter) {
                var context = new MatchingContext(formatter.startTag, formatter.endTag, function (matchedResult) {
                    matchedResult.format = formatter.format;
                    matchedResults.push(matchedResult);
                });

                matchers.push(context);
            });

            // iterate input string
            collections.foreach(str, function (symbol, i) {
                collections.foreach(matchers, function (matcher) {
                    matcher.track(symbol, i);
                });
            });

            // iterate input string
            var orderedMatchedResults = collections.orderBy(matchedResults, function (matchedResult1, matchedResult2) {
                return objects.compareValues(matchedResult1.startIndex, matchedResult2.startIndex);
            });

            var filteredMatchedResults = [];

            function addMatchedResult(matchedResult) {
                var last = collections.last(filteredMatchedResults);

                function tryToPush() {
                    var formattedString = matchedResult.format(matchedResult.body);

                    if (formattedString !== undefined) {
                        matchedResult.formattedString = formattedString;
                        filteredMatchedResults.push(matchedResult);
                    }
                }

                function tryToReplaceLast() {
                    var formattedString = matchedResult.format(matchedResult.body);

                    if (formattedString !== undefined) {
                        matchedResult.formattedString = formattedString;
                        filteredMatchedResults[filteredMatchedResults.length - 1] = matchedResult;
                    }
                }

                if (last) {
                    if (last.startIndex === matchedResult.startIndex) {
                        if (matchedResult.fullLength > last.fullLength) {
                            tryToReplaceLast();
                        }
                    } else {
                        if (matchedResult.startIndex >= last.startIndex + last.fullLength) {
                            tryToPush();
                        }
                    }
                } else {
                    tryToPush();
                }
            }

            collections.foreach(orderedMatchedResults, function (orderedMatchedResult) {
                addMatchedResult(orderedMatchedResult);
            });

            collections.foreach(filteredMatchedResults, function (result) {
                str = strings.splice(str, result.startIndex + offset, result.fullLength, result.formattedString);
                offset = offset + result.formattedString.length - result.fullLength;
            });

            return str;
        };

        return formatter;
    }
]);