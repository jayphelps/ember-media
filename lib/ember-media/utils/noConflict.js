import Ember from 'ember';

var previousVideoView = Ember.VideoView;

export default function noConflict() {
    if (previousVideoView === undefined) {
        delete Ember.VideoView;
    } else {
        Ember.VideoView = previousVideoView;
    }
    
    return this;
}