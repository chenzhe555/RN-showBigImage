/**
 * Created by chj on 2018/7/27.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    Platform,
    CameraRoll
} from 'react-native';
import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Immutable from 'immutable';
const {width, height} = Dimensions.get('window');
import RNFS from 'react-native-fs';
import Toast from '@remobile/react-native-toast'

export default class showBigImage extends Component<{}> {
    constructor(props){
        super(props);

        this.state={
            width: new Animated.Value(this.props.imageWidth),
            height: new Animated.Value(this.props.imageHeight),
            x: new Animated.Value(this.props.imageX),
            y: new Animated.Value(this.props.imageY),
            bgAlpha: new Animated.Value(0),
        };

        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.dismissFunc = this.dismissFunc.bind(this);
        this.downLoadImage = this.downLoadImage.bind(this)
    }

    componentDidMount() {

        Animated.parallel([
            Animated.timing(
                this.state.height,
                {
                    toValue: height,
                    duration: 500
                }
            ),
            Animated.timing(
                this.state.width,
                {
                    toValue: width,
                    duration: 500
                }
            ),
            Animated.timing(
                this.state.y,
                {
                    toValue: 0,
                    duration: 500
                }
            ),
            Animated.timing(
                this.state.x,
                {
                    toValue: 0,
                    duration: 500
                }
            ),
            Animated.timing(
                this.state.bgAlpha,
                {
                    toValue: 1,
                    duration: 500
                }
            )
        ]).start()
    }

    dismissFunc(){
        this.props.dismissFunc();
    }
    downLoadImage(){
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.MainBundlePath : RNFS.DocumentDirectoryPath;
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const formUrl = this.props.imageUrl;
            const options = {
                fromUrl: formUrl,
                toFile: downloadDest,
                background: true,
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    CameraRoll.saveToCameraRoll(downloadDest)
                        .then(()=>{
                            Toast.showShortCenter('图片已保存到相册');
                            RNFS.unlink(downloadDest)
                                .then(() => {
                                })
                                .catch((err) => {
                                });
                        }).catch(()=>{
                            Toast.showShortCenter('图片保存失败')
                        });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }
        })
    }

    render() {
        return (
            <Animated.View style={[styles.container,{opacity: this.state.bgAlpha,position:'absolute'}]}>
                <Animated.View style={[styles.animatedView,{top: this.state.y,height: this.state.height,left: this.state.x,width: this.state.width}]}>
                    <TouchableOpacity onPress={this.dismissFunc}>
                        <Animated.Image style={{height: this.state.height,width: this.state.width}} source={{uri: this.props.imageUrl}} resizeMode='contain'/>
                    </TouchableOpacity>
                </Animated.View>
               <TouchableOpacity style={{marginTop: 30,marginRight: 10}} onPress={this.downLoadImage}>
                    <Text style={{fontFamily: 'iconfont',color: 'white',fontSize: 30}}>&#xe88e;</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }
}
showBigImage.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    dismissFunc: PropTypes.func.isRequired,
    imageY: PropTypes.number.isRequired,
    imageX: PropTypes.number,
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
};
showBigImage.defaultProps = {
    imageX: 0,
    imageWidth: width,
    imageHeight: 200
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        width,
        height,
        alignItems: 'flex-end'
    },
    animatedView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    }
});