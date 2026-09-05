import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';

interface A4PreviewProps {
    htmlContent: string;
}

const {width} = Dimensions.get('window');
const A4_ASPECT_RATIO = 1.414; // A4 aspect ratio height/width

export function A4Preview({htmlContent} : A4PreviewProps) {
    const containerWidth = width - 32;
    const containerHeight = containerWidth * A4_ASPECT_RATIO;

    return (<View style={
        [
            styles.card, {
                width: containerWidth,
                height: containerHeight
            }
        ]
    }>
        <WebView originWhitelist={
                ['*']
            }
            source={
                {html: htmlContent}
            }
            style={
                {
                    flex: 1,
                    backgroundColor: '#ffffff'
                }
            }
            scalesPageToFit/>
    </View>);
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        alignSelf: 'center',
        marginBottom: 20
    }
});
