$(document).ready(function () {
    var $searchBar = $('#searchBar');
    var $currenciesSelect = $('#currenciesSelect');
    var $currencyLabel = $('#currencyLabel');
    var $languageLabel = $('#languageLabel');
    var $languageOptions = $('.languageOption');
    var $currentLanguageImg = $('#currentLanguageImg');

    function setCurrency() {
        shopApp.state.currency = $currenciesSelect.val();
        $currencyLabel.text(shopApp.state.currency);
    }

    function setLanguage($img) {
        shopApp.state.language = $img.attr('code');
        var $newCurrentLanguageImg = $img.clone();
        $currentLanguageImg.replaceWith($newCurrentLanguageImg);
        $currentLanguageImg = $newCurrentLanguageImg;
        $languageLabel.text(shopApp.state.language);
    }

    $searchBar.typeahead({
        minLength: 3,
        highlight: true
    },
        {
            name: 'my-dataset',
            source: function (query, syncResults, asyncResults) {
                shopApp.sendApiRequest($searchBar.attr('autocomplete-url'), { query: query }, 'POST')
                    .then(function (data) {
                        asyncResults(data);
                });
            },
            async: true
        });

    $currenciesSelect.change(function () {
        setCurrency();
    });

    $languageOptions.click(function () {
        var $img = $(this).find('img');
        setLanguage($img);
    });

    shopApp.state.language = $currentLanguageImg.attr('code');

    setCurrency();
});