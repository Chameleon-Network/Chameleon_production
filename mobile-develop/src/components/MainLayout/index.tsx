import React from 'react';
import styles from './style';
import { FlexView2 } from '../core/FlexView';
import Header from '../Header/Header';
import { LoadingContainer, View } from '../core';
import { ScrollViewBorder } from '../core/ScrollView';
import KeyboardAwareScrollView from '../core/KeyboardAwareScrollView';


interface MainLayoutProps {
  header: string;
  children?: React.ReactNode;
  scrollable?: boolean;
  loading?: boolean;
  hideBackButton?: boolean;
  noPadding?: boolean;
  rightHeader?: React.ReactNode;
  customHeaderTitle?: React.ReactNode;
  onGoBack?: () => void;
  contentStyle?: React.CSSProperties;
  noHeader?: boolean;
  canSearch?: boolean;
  keyboardAware?: boolean;
  noPaddingBottom?: boolean;
}

const MainLayout = ({
  header,
  children,
  scrollable,
  loading,
  hideBackButton,
  noPadding,
  rightHeader,
  customHeaderTitle,
  onGoBack,
  contentStyle,
  noHeader,
  canSearch,
  keyboardAware,
  noPaddingBottom,
}: MainLayoutProps) => {
  return (
    <FlexView2 style={[noPadding && styles.noPaddingStyle]}>
      {!noHeader && (
        <Header
          canSearch={canSearch}
          title={header}
          hideBackButton={hideBackButton}
          style={noPadding && styles.paddingHeader}
          rightHeader={rightHeader}
          customHeaderTitle={customHeaderTitle}
          onGoBack={onGoBack}
        />
      )}
      {loading ? <LoadingContainer /> :
        scrollable ? !keyboardAware ? (
          <ScrollViewBorder
            paddingBottom={!noPaddingBottom}
            contentContainerStyle={[
              styles.content,
              contentStyle,
            ]}
          >
            {children && children}
          </ScrollViewBorder>
        ) : (
          <KeyboardAwareScrollView
            contentContainerStyle={[
              styles.content,
              contentStyle,
            ]}
            fullFlex
          >
            {children && children}
          </KeyboardAwareScrollView>
        ) : (
          <View
            borderTop
            paddingHorizontal
            style={[
              styles.content,
              contentStyle,
            ]}
          >
            {children && children}
          </View>
        )
      }
    </FlexView2>
  );
};

export default MainLayout
