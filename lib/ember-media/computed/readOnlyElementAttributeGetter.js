import Ember from 'ember';

var get = Ember.get, computed = Ember.computed;

export default function readOnlyElementAttributeGetter(attributeName) {
    return computed(function (defaultName) {
        attributeName = attributeName || defaultName;
        var el = get(this, 'element');
        return (el) ? el.getAttribute(attributeName) : undefined;
    }).property().volatile().readOnly();
}