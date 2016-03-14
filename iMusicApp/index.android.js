/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    Image,
    TouchableNativeFeedback,
    View
} from 'react-native';
import Sound from 'react-native-sound';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'row'
    },
    playBox: {
        width: 300,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBoxLogo: {
        width: 200,
        height: 200
    },
    playBoxBar: {
        flexDirection: 'row',
        marginTop: 20
    },
    playBoxBarBtn: {},
    playBoxBtnIcon: {
        width: 45,
        height: 45,
        marginLeft: 5,
        marginRight: 5,
    },
});

class iMusicApp extends Component {
    constructor(props) {
        super(props);
        this.isPlaying = false;
        this.whoosh = new Sound('single_dog.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else { // loaded successfully
                console.log('duration in seconds: ' + this.whoosh.duration +
                 'number of channels: ' + this.whoosh.numberOfChannels);
            }
        });
    }

    onPlay(e) {
        console.log("开始");
        if(!this.isPlaying){
            this.whoosh.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        }else{
            this.whoosh.pause();
        }
        this.isPlaying = !this.isPlaying;
    }

    onPre(e) {
        console.log("前一首");
    }

    onNext(e) {
        console.log("后一首");
    }

    onStop(e) {
        console.log("停止");
        this.whoosh.stop();
        this.isPlaying = false;
    }

    onRepeat(e) {
        console.log("重复");
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.playBox}>
                    <Image source={require('./images/logo.png') } style={styles.playBoxLogo}/>
                    <View style={styles.playBoxBar}>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={e=>this.onPlay(e)}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/play.png') } style={styles.playBoxBtnIcon}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={e=>this.onPre(e)}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/pre.png') } style={styles.playBoxBtnIcon}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={e=>this.onNext(e)}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/next.png') } style={styles.playBoxBtnIcon}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={e=>this.onStop(e)}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/stop.png') } style={styles.playBoxBtnIcon}/>
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={e=>this.onRepeat(e)}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/repeat.png') } style={styles.playBoxBtnIcon}/>
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

AppRegistry.registerComponent('iMusicApp', () => iMusicApp);
