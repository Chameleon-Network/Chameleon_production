import { useNavigation } from '@react-navigation/native';
import BtnDelete from '@src/components/Button/BtnDelete';
import { TouchableOpacity } from '@src/components/core';
import { navigateToCommunity } from '@src/router/NavigationServices';
import { actionReadNews, actionRemoveNews } from '@src/store/news/functions';
import { userIdSelector } from '@src/store/profile/selectors';
import { COLORS } from '@src/styles';
import moment from 'moment';
import React from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { TYPE } from './News.constant';
import { listNewsStyled as styled } from './News.styled';

interface ListNewsProps {
  listNews: any[];
  type: number;
  lastNewsID?: number;
}

const ListNews = ({listNews, type, lastNewsID}: ListNewsProps) => {
  const navigation = useNavigation();
  const userId = useSelector(userIdSelector);

  const handleRemoveNews = (id: string) => actionRemoveNews(id);

  const onPressItem = ({item, canTap}: {item: any; canTap: boolean}) => {
    actionReadNews(item?.id);

    if (canTap) {
      // reset all highlight:
      navigation.setParams({lastNewsID: 0});
      navigateToCommunity({
        uri: item?.more,
      });
    }
  };

  const TapItem = props => {
    const {animated = true} = props;
    if (!animated) {
      return (
        <TouchableWithoutFeedback onPress={() => onPressItem({item, canTap})}>
          {props?.children}
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableOpacity onPress={() => onPressItem({item, canTap})}>
        {props?.children}
      </TouchableOpacity>
    );
  };

  const Item = React.memo(props => {
    const {item} = props;
    const {id, title, description, createdAt} = item;
    const canTap = !!item?.more;

    // check show highlight or no:
    const isHighlight = lastNewsID > 1 && lastNewsID < id;

    let Component;
    switch (type) {
      case TYPE.news: {
        Component = () => (
          <View style={styled.extra}>
            <Text style={isHighlight ? styled.title : styled.titleHighLight}>
              {title?.trim()}
            </Text>
            <Text style={styled.date}>
              {moment(createdAt).format('YYYY-DD-MM HH:mm')}
            </Text>
            {canTap && (
              <View style={styled.descContainer}>
                <Text style={styled.desc}>{description?.trim()}</Text>
                <Icons name="chevron-right" size={16} color={COLORS.blue5} />
              </View>
            )}
          </View>
        );
        break;
      }
      default: {
        return null;
      }
    }
    return (
      <TapItem animated={!!canTap}>
        <Component />
      </TapItem>
    );
  });
  const renderListNews = () => {
    return listNews.map((item, index, arr) => {
      const user = item?.listUserNews.find(item => item?.userId === userId);
      const isRemoved = user?.isRead === -1;
      if (type === 1) {
        if (isRemoved) {
          return null;
        }
        const isRead = user?.isRead === 1;

        return <></>
        //TODO: fix swipeout
        // return (
        //   <Swipeout
        //     autoClose
        //     style={[
        //       {
        //         backgroundColor: 'transparent',
        //       },
        //       arr.length - 1 === index && {marginBottom: 0},
        //     ]}
        //     right={[
        //       {
        //         component: (
        //           <BtnDelete
        //             showIcon={false}
        //             onPress={() => handleRemoveNews(item?.id)}
        //           />
        //         ),
        //       },
        //     ]}>
        //     <Item
        //       item={item}
        //       firstChild={index === 0}
        //       isRead={isRead}
        //       key={item?.id}
        //     />
        //   </Swipeout>
        // );
      }
      return <Item {...{item, firstChild: index === 0}} key={item?.id} />;
    });
  };
  return <View style={styled.listNews}>{renderListNews()}</View>;
};

export default ListNews;
