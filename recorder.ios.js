var React = require('react-native');
var {
  PropTypes,
  StyleSheet,
  requireNativeComponent,
  NativeModules,
  View,
} = React;

/******* ENUM **********/

var constants = {
  // Flash enum
  SCFlashModeOff: NativeModules.RNRecorderManager.SCFlashModeOff,
  SCFlashModeOn: NativeModules.RNRecorderManager.SCFlashModeOn,
  SCFlashModeAuto: NativeModules.RNRecorderManager.SCFlashModeAuto,
  SCFlashModeLight: NativeModules.RNRecorderManager.SCFlashModeLight,
};

/******* STYLES **********/

var styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

/******* RECORDER COMPONENT **********/

var Recorder = React.createClass({

  propTypes: {
    config: PropTypes.object,
    device: PropTypes.string,
    realtimePreview: PropTypes.bool,
    palindromicSaveMode: PropTypes.bool,
    discardRatio: PropTypes.number,
    onNewSegment: PropTypes.function,
  },

  getInitialState() {
    return {
      recording: false,
    };
  },

  /*** PUBLIC METHODS ***/

  // Start recording of the current session
  record() {
    if (this.state.recording) return;
    this.state.recording = true;
    NativeModules.RNRecorderManager.record();
  },

  // Capture a picture
  capture(callback) {
    NativeModules.RNRecorderManager.capture(callback);
  },

  // Pause recording of the current session
  pause() {
    if (!this.state.recording) return;

    var onNewSegment = this.props.onNewSegment || function() {};
    NativeModules.RNRecorderManager.pause(onNewSegment);
    this.state.recording = false;
  },

  // Save the recording
  save(callback) {
    NativeModules.RNRecorderManager.save(callback);
  },

  // Remove last segment of the session
  removeLastSegment() {
    NativeModules.RNRecorderManager.removeLastSegment();
  },

  // Remove all segments of the session
  removeAllSegments() {
    NativeModules.RNRecorderManager.removeAllSegments();
  },

  // Remove segment at the specified index
  removeSegmentAtIndex(index) {
    NativeModules.RNRecorderManager.removeSegmentAtIndex(index);
  },

  // Start recorder running
  startRunning(callback) {
    callback = !!callback ? callback : () => {};
    NativeModules.RNRecorderManager.startRunning(callback);
  },

  // Stop recorder running
  stopRunning(callback) {
    callback = !!callback ? callback : () => {};
    NativeModules.RNRecorderManager.stopRunning(callback);
  },

  /*** RENDER ***/

  render() {
    var config = {...{
      autoSetVideoOrientation: false,
      flashMode: constants.SCFlashModeOff,

      video: {
        enabled: true,
        bitrate: 2000000, // 2Mbit/s
        timescale: 1, // Higher than 1 makes a slow motion, between 0 and 1 makes a timelapse effect
        format: 'MPEG4',
        quality: 'HighestQuality', // HighestQuality || MediumQuality || LowQuality
        filters: [
          /*{
            'CIfilter': 'CIColorControls',
            'animations': [{
              'name': 'inputSaturation',
              'startValue': 100,
              'endValue': 0,
              'startTime': 0,
              'duration': 0.5
            }]
          },*/
          /*{'file': 'b_filter'},*/
          /*{'CIfilter':'CIColorControls', 'inputSaturation': 0},
          {'CIfilter':'CIExposureAdjust', 'inputEV': 0.7}*/
        ],
      },
      audio: {
        enabled: true,
        bitrate: 128000, // 128kbit/s
        channelsCount: 1, // Mono output
        format: 'MPEG4AAC',
        quality: 'HighestQuality', // HighestQuality || MediumQuality || LowQuality
      },
    }, ...this.props.config};

    var nativeProps = {...this.props, ...{
      config: config,
      device: this.props.device || 'front',
    }};

    return (
      <RNRecorder {...nativeProps}>
        <View style={styles.wrapper}>{this.props.children}</View>
      </RNRecorder>
    );
  },

});

var RNRecorder = requireNativeComponent('RNRecorder', Recorder);

Recorder.constants = constants;

module.exports = Recorder;
