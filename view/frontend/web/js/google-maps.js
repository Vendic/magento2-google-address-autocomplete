var google_maps_loaded_def = null;

define(['jquery'], function ($) {
    'use strict';

    if (!google_maps_loaded_def) {
        google_maps_loaded_def = $.Deferred();

        window.google_maps_loaded = function () {
            google_maps_loaded_def.resolve(window.google.maps);
        };

        var api_key = window.checkoutConfig === undefined ?
                window.vendic_google_autocomplete.api_key : window.checkoutConfig.vendic_google_autocomplete.api_key,
            defaultCountryId = window.checkoutConfig === undefined ?
                window.vendic_google_autocomplete.defaultCountryId : window.checkoutConfig.defaultCountryId;

        if (api_key !== false && api_key !== null) {
            var url = 'https://maps.googleapis.com/maps/api/js?v=quarterly&key=' + api_key +
                '&libraries=places&callback=google_maps_loaded';

            /* eslint-disable-next-line max-depth */
            if (defaultCountryId) {
                url += '&region=' + defaultCountryId;
            }

            require([url], function () {}, function () {
                google_maps_loaded_def.reject();
            });
        }
    }

    return google_maps_loaded_def.promise();
});
