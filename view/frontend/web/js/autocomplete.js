define([
    'jquery',
    'uiComponent',
    'Vendic_GoogleAutocomplete/js/google-maps',
    'uiRegistry'
], function (
    $,
    Component,
    GoogleMapsLoader,
    uiRegistry
) {
    'use strict';

    return Component.extend({
        defaults: {
            registry: {
                street: 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street.0',
                street_number: 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street.1',
                city: 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.city',
                postcode: 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.postcode',
                country_id: 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.country_id'
            },
            street: null
        },

        initialize: function () {
            var self = this;

            this._super();

            GoogleMapsLoader.then(function (maps) {
                var googleMapError = false;

                window.gm_authFailure = function () {
                    googleMapError = true;
                };

                setTimeout(function () {
                    if (!googleMapError) {
                        var autocomplete,
                            street = self.getElement('street');

                        autocomplete = new maps.places.Autocomplete(street[0]);

                        autocomplete.addListener('place_changed', function () {
                            var place = autocomplete.getPlace();

                            self.parseAddress(place);
                        });
                    }
                }, 4000);

            }).fail(function () {
                console.error("ERROR: Google Maps failed to load");
            });

            return this;
        },

        getElement: function (name) {
            var elementRegistry = uiRegistry.get(this.registry[name]);

            if (elementRegistry === undefined) {
                return false;
            }

            var elementId = elementRegistry.uid;

            return $('#' + elementId);
        },

        setElementValue: function (name, value) {
            var element = this.getElement(name);

            element.val(value);

            element.change();
        },

        parseAddress: function (place) {
            var components = place.address_components;

            components.forEach(function (component) {
                var types = component.types,
                    type;

                type = types[0];

                if (type === 'route') {
                    this.setElementValue('street', component.long_name);
                } else if (type === 'locality') {
                    this.setElementValue('city', component.long_name);
                } else if (type === 'postal_code') {
                    this.setElementValue('postcode', component.long_name);
                } else if (type === 'country') {
                    this.setElementValue('country_id', component.short_name);
                } else if (type === 'street_number') {
                    this.setElementValue('street_number', component.long_name);
                }
            }.bind(this));
        }
    });
});