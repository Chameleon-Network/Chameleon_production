import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import {Component} from "react";


const React = require('react');
const ReactNative = require('react-native');

const PropTypes = require('prop-types');
const {
    Dimensions,
    View,
    Animated,
    StyleSheet,
} = ReactNative;
const createReactClass = require('../create-react-class')

const SceneComponent = require('./SceneComponent');
const DefaultTabBar = require('./DefaultTabBar');
const ScrollableTabBar = require('./ScrollableTabBar');

const ScrollableTabView = createReactClass({
    statics: {
        DefaultTabBar,
        ScrollableTabBar,
    },
    scrollOnMountCalled: false,

    propTypes: {
        tabBarPosition: PropTypes.oneOf(['top', 'bottom', 'overlayTop', 'overlayBottom',]),
        initialPage: PropTypes.number,
        page: PropTypes.number,
        onChangeTab: PropTypes.func,
        onScroll: PropTypes.func,
        renderTabBar: PropTypes.any,
        tabBarUnderlineStyle: ViewPropTypes.style,
        tabBarBackgroundColor: PropTypes.string,
        tabBarActiveTextColor: PropTypes.string,
        tabBarInactiveTextColor: PropTypes.string,
        tabBarTextStyle: PropTypes.object,
        style: ViewPropTypes.style,
        contentProps: PropTypes.object,
        scrollWithoutAnimation: PropTypes.bool,
        locked: PropTypes.bool,
        prerenderingSiblingsNumber: PropTypes.number,
    },

    getDefaultProps() {
        return {
            tabBarPosition: 'top',
            initialPage: 0,
            page: -1,
            onChangeTab: () => {
            },
            onScroll: () => {
            },
            contentProps: {},
            scrollWithoutAnimation: false,
            locked: false,
            prerenderingSiblingsNumber: 0,
        };
    },

    getInitialState() {
        const containerWidth = Dimensions.get('window').width;
        let scrollValue;
        let scrollXIOS;
        let positionAndroid;
        let offsetAndroid;

        scrollXIOS = new Animated.Value(this.props.initialPage * containerWidth);
        const containerWidthAnimatedValue = new Animated.Value(containerWidth);
        // Need to call __makeNative manually to avoid a native animated bug. See
        // https://github.com/facebook/react-native/pull/14435
        containerWidthAnimatedValue.__makeNative();
        scrollValue = Animated.divide(scrollXIOS, containerWidthAnimatedValue);

        const callListeners = this._polyfillAnimatedValue(scrollValue);
        scrollXIOS.addListener(
            ({value,}) => callListeners(value / this.state.containerWidth)
        );

        return {
            currentPage: this.props.initialPage,
            scrollValue,
            scrollXIOS,
            positionAndroid,
            offsetAndroid,
            containerWidth,
            sceneKeys: this.newSceneKeys({currentPage: this.props.initialPage,}),
        };
    },

    componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            this.updateSceneKeys({page: this.state.currentPage, children: this.props.children,});
        }

        if (this.props.page >= 0 && this.props.page !== this.state.currentPage) {
            this.goToPage(this.props.page);
        }
    },

    componentWillUnmount() {
        this.state.scrollXIOS.removeAllListeners();
    },

    goToPage(pageNumber) {
        const offset = pageNumber * this.state.containerWidth;
        if (this.scrollView && this.scrollView.scrollTo) {
            this.scrollView.scrollTo({x: offset, y: 0, animated: !this.props.scrollWithoutAnimation,});
        }

        const currentPage = this.state.currentPage;
        this.updateSceneKeys({
            page: pageNumber,
            callback: this._onChangeTab.bind(this, currentPage, pageNumber),
        });
    },

    renderTabBar(props) {
        if (this.props.renderTabBar === false) {
            return null;
        } else if (this.props.renderTabBar) {
            return React.cloneElement(this.props.renderTabBar(props), props);
        } else {
            return <DefaultTabBar {...props} />;
        }
    },

    updateSceneKeys({page, children = this.props.children, callback = () => {}}) {
        let newKeys = this.newSceneKeys({previousKeys: this.state.sceneKeys, currentPage: page, children,});
        this.setState({currentPage: page, sceneKeys: newKeys,}, callback);
    },

    newSceneKeys({previousKeys = [], currentPage = 0, children = this.props.children,}) {
        let newKeys = [];
        this._children(children).forEach((child, idx) => {
            let key = this._makeSceneKey(child, idx);
            if (this._keyExists(previousKeys, key) ||
                this._shouldRenderSceneKey(idx, currentPage)) {
                newKeys.push(key);
            }
        });
        return newKeys;
    },

    // Animated.add and Animated.divide do not currently support listeners so
    // we have to polyfill it here since a lot of code depends on being able
    // to add a listener to `scrollValue`. See https://github.com/facebook/react-native/pull/12620.
    _polyfillAnimatedValue(animatedValue) {

        const listeners = new Set();
        const addListener = (listener) => {
            listeners.add(listener);
        };

        const removeListener = (listener) => {
            listeners.delete(listener);
        };

        const removeAllListeners = () => {
            listeners.clear();
        };

        animatedValue.addListener = addListener;
        animatedValue.removeListener = removeListener;
        animatedValue.removeAllListeners = removeAllListeners;

        return (value) => listeners.forEach(listener => listener({value,}));
    },

    _shouldRenderSceneKey(idx, currentPageKey) {
        let numOfSibling = this.props.prerenderingSiblingsNumber;
        return (idx < (currentPageKey + numOfSibling + 1) &&
            idx > (currentPageKey - numOfSibling - 1));
    },

    _keyExists(sceneKeys, key) {
        return sceneKeys.find((sceneKey) => key === sceneKey);
    },

    _makeSceneKey(child, idx) {
        return child.props.tabLabel + '_' + idx;
    },

    renderScrollableContent() {
        const scenes = this._composeScenes();
        return <Animated.ScrollView
            horizontal
            pagingEnabled
            automaticallyAdjustContentInsets={false}
            contentOffset={{x: this.props.initialPage * this.state.containerWidth,}}
            ref={(scrollView) => {
                this.scrollView = scrollView;
            }}
            onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: this.state.scrollXIOS,},},},],
                {useNativeDriver: true, listener: this._onScroll,}
            )}
            onMomentumScrollBegin={this._onMomentumScrollBeginAndEnd}
            onMomentumScrollEnd={this._onMomentumScrollBeginAndEnd}
            scrollEventThrottle={16}
            scrollsToTop={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={!this.props.locked}
            directionalLockEnabled
            alwaysBounceVertical={false}
            keyboardDismissMode="on-drag"
            {...this.props.contentProps}
        >
            {scenes}
        </Animated.ScrollView>;
    },

    _composeScenes() {
        return this._children().map((child, idx) => {
            let key = this._makeSceneKey(child, idx);
            return <SceneComponent
                key={child.key}
                shouldUpdated={this._shouldRenderSceneKey(idx, this.state.currentPage)}
                style={{width: this.state.containerWidth,}}
            >
                {this._keyExists(this.state.sceneKeys, key) ? child : <View tabLabel={child.props.tabLabel} key={key}/>}
            </SceneComponent>;
        });
    },

    _onMomentumScrollBeginAndEnd(e) {
        const offsetX = e.nativeEvent.contentOffset.x;
        const page = Math.round(offsetX / this.state.containerWidth);
        if (this.state.currentPage !== page) {
            this._updateSelectedPage(page);
        }
    },

    _updateSelectedPage(nextPage) {
        let localNextPage = nextPage;
        if (typeof localNextPage === 'object') {
            localNextPage = nextPage.nativeEvent.position;
        }

        const currentPage = this.state.currentPage;
        this.updateSceneKeys({
            page: localNextPage,
            callback: this._onChangeTab.bind(this, currentPage, localNextPage),
        });
    },

    _onChangeTab(prevPage, currentPage) {
        this.props.onChangeTab({
            i: currentPage,
            ref: this._children()[currentPage],
            from: prevPage,
        });
    },

    _onScroll(e) {
        const offsetX = e.nativeEvent.contentOffset.x;
        if (offsetX === 0 && !this.scrollOnMountCalled) {
            this.scrollOnMountCalled = true;
        } else {
            this.props.onScroll(offsetX / this.state.containerWidth);
        }
    },

    _handleLayout(e) {
        const {width,} = e.nativeEvent.layout;

        if (!width || width <= 0 || Math.round(width) === Math.round(this.state.containerWidth)) {
            return;
        }

        const containerWidthAnimatedValue = new Animated.Value(width);
        containerWidthAnimatedValue.__makeNative();
        scrollValue = Animated.divide(this.state.scrollXIOS, containerWidthAnimatedValue);
        this.setState({containerWidth: width, scrollValue,});

        requestAnimationFrame(() => {
            this.goToPage(this.state.currentPage);
        });
    },

    _children(children = this.props.children) {
        return React.Children.map(children, (child) => child);
    },

    render() {
        let overlayTabs = (this.props.tabBarPosition === 'overlayTop' || this.props.tabBarPosition === 'overlayBottom');
        let tabBarProps = {
            goToPage: this.goToPage,
            tabs: this._children().map((child) => child.props.tabLabel),
            activeTab: this.state.currentPage,
            scrollValue: this.state.scrollValue,
            containerWidth: this.state.containerWidth,
        };

        if (this.props.tabBarBackgroundColor) {
            tabBarProps.backgroundColor = this.props.tabBarBackgroundColor;
        }
        if (this.props.tabBarActiveTextColor) {
            tabBarProps.activeTextColor = this.props.tabBarActiveTextColor;
        }
        if (this.props.tabBarInactiveTextColor) {
            tabBarProps.inactiveTextColor = this.props.tabBarInactiveTextColor;
        }
        if (this.props.tabBarTextStyle) {
            tabBarProps.textStyle = this.props.tabBarTextStyle;
        }
        if (this.props.tabBarUnderlineStyle) {
            tabBarProps.underlineStyle = this.props.tabBarUnderlineStyle;
        }
        if (overlayTabs) {
            tabBarProps.style = {
                position: 'absolute',
                left: 0,
                right: 0,
                [this.props.tabBarPosition === 'overlayTop' ? 'top' : 'bottom']: 0,
            };
        }

        return <View style={[styles.container, this.props.style,]} onLayout={this._handleLayout}>
            {this.props.tabBarPosition === 'top' && this.renderTabBar(tabBarProps)}
            {this.renderScrollableContent()}
            {(this.props.tabBarPosition === 'bottom' || overlayTabs) && this.renderTabBar(tabBarProps)}
        </View>;
    },
});

module.exports = ScrollableTabView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollableContentAndroid: {
        flex: 1,
    },
});
