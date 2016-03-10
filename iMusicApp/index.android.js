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

class iMusicApp extends Component {

    onPlay(){

    }

    onPre(){

    }

    onNext(){

    }

    onStop(){

    }

    onRepeat(){

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.playBox}>
                    <Image source={require('./images/logo.png') } style={styles.playBoxLogo} />
                    <View style={styles.playBoxBar}>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={this.onPlay()}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/play.png') } style={styles.playBoxBtnIcon}/> 
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={this.onPre()}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/pre.png') } style={styles.playBoxBtnIcon}/> 
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={this.onNext()}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/next.png') } style={styles.playBoxBtnIcon}/> 
                            </View>
                        </TouchableNativeFeedback> 
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={this.onStop()}
                            background={TouchableNativeFeedback.SelectableBackground() }>
                            <View>
                                <Image source={require('./images/stop.png') } style={styles.playBoxBtnIcon}/> 
                            </View>
                        </TouchableNativeFeedback>
                        <TouchableNativeFeedback
                            style={styles.playBoxBarBtn}
                            onPress={this.onRepeat()}
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
    playBoxBtnIcon:{
        width: 45, 
        height: 45,
        marginLeft: 5,
        marginRight: 5,  
    },
});

AppRegistry.registerComponent('iMusicApp', () => iMusicApp);
