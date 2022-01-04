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

    var shippingAddresFieldsetPath = 'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset';

    return Component.extend({
        defaults: {
            registry: {
                street: shippingAddresFieldsetPath + '.street.0',
                street_number: shippingAddresFieldsetPath + '.street.1',
                street_number_addition: shippingAddresFieldsetPath + '.street.2',
                city: shippingAddresFieldsetPath + '.city',
                postcode: shippingAddresFieldsetPath + '.postcode',
                country_id: shippingAddresFieldsetPath + '.country_id'
            },
            street: null,
            streetLinesQty: 2
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
            var self = this,
                components = place.address_components;

            if (!components) {
                return;
            }

            var street = '',
                houseNumber,
                houseNumberAddition,
                city,
                postcode,
                countryId;

            components.forEach(function (component) {
                var type = component.types[0];

                if (type === 'route') {
                    if (self.streetLinesQty == '1') {
                        street = component.long_name + ', ' + street;
                    } else {
                        street = component.long_name;
                    }
                } else if (type === 'street_number') {
                    if (self.streetLinesQty == '1') {
                        street += component.long_name;
                    } else if (self.streetLinesQty == '2') {
                        houseNumber = component.long_name;
                    } else {
                        houseNumber = component.long_name.match(/\d+/)[0];
                        houseNumberAddition = '';

                        /* eslint-disable-next-line max-depth */
                        if (component.long_name.match(/[a-zA-Z]+/g) && component.long_name.match(/[a-zA-Z]+/g)[0]) {
                            houseNumberAddition = component.long_name.match(/[a-zA-Z]+/g)[0];
                        }
                    }
                } else if (type === 'locality') {
                    city = component.long_name;
                } else if (type === 'postal_code') {
                    postcode = component.long_name;
                } else if (type === 'country') {
                    countryId = component.short_name;
                }
            });

            if (street) {
                this.setElementValue('street', street);
            }

            if (houseNumber) {
                this.setElementValue('street_number', houseNumber);
            }

            if (houseNumberAddition) {
                this.setElementValue('street_number_addition', houseNumberAddition);
            } else {
                this.setElementValue('street_number_addition', '');
            }

            if (city) {
                this.setElementValue('city', city);
            }

            if (postcode) {
                this.setElementValue('postcode', postcode);
            }

            if (countryId) {
                this.setElementValue('country_id', countryId);
            }
        }
    });
});
