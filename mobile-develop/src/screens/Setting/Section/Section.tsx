import {ArrowRightGreyIcon} from '@components/Icons';
import {Text, TouchableOpacity, View} from '@src/components/core';
import {Text5} from '@src/components/core/Text';
import {Row} from '@src/components/Row';
import React from 'react';
import {useSelector} from 'react-redux';
import {sectionStyle} from './Section.styled';
import {useTheme} from 'styled-components/native';

export const SectionItem = (
  {
    data: {
      title,
      desc,
      handlePress,
      styleItem = null,
      icon: CMPIcon,
      nonPaddingTop = null,
    },
  },
  lastItem,
) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        sectionStyle.container,
        lastItem && sectionStyle.lastItem,
        styleItem,
        nonPaddingTop && sectionStyle.nonPaddingTop,
        {borderBottomColor: theme.border4},
      ]}
      onPress={handlePress}>
      <Row centerVertical spaceBetween>
        <Row centerVertical>
          {!!CMPIcon && <View style={[sectionStyle.wrapIcon]}>{CMPIcon}</View>}
          {!!title && <Text style={[sectionStyle.label]}>{title}</Text>}
        </Row>
        <ArrowRightGreyIcon style={{width: 6, height: 10}} />
      </Row>
      {desc && <Text5 style={[sectionStyle.desc]}>{desc}</Text5>}
    </TouchableOpacity>
  );
};

const Section = props => {
  const {
    label = '',
    items,
    customItems,
    headerRight,
    labelStyle,
    headerIcon: HeaderIcon,
  } = props;
  const colors = useTheme();
  return (
    <View style={[sectionStyle.container, {borderBottomColor: colors.border4}]}>
      <Row style={sectionStyle.header}>
        <Row centerVertical>
          {!!HeaderIcon && (
            <View style={sectionStyle.wrapIcon}>{HeaderIcon}</View>
          )}
          <Text style={[sectionStyle.label, labelStyle]}>{label}</Text>
        </Row>
        {headerRight}
      </Row>
      {customItems ? (
        customItems
      ) : (
        <View>
          {items &&
            items.map((item, index) => (
              <SectionItem
                key={`${item.title || item.desc}`}
                data={item}
                lastItem={index === items.length - 1}
              />
            ))}
        </View>
      )}
    </View>
  );
};
export default Section;
