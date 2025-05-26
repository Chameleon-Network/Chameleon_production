import {View, View2} from '@components/core/View';
import {useFocusEffect} from '@react-navigation/native';
import Header from '@src/components/Header/Header';
import withLazy from '@src/components/LazyHoc/withLazy';
import {camelCaseKeys} from '@src/utils';
import React, { useCallback } from 'react';
import {RefreshControl, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {LAYOUT_TYPE} from './News.constant';
import ListNews from './News.listNews';
import {styled} from './News.styled';
import {handleShouldRenderCategory} from './News.utils';
import {userIdSelector} from '@src/store/profile/selectors';
import { useNavigationParam } from '@src/hooks';
import { actionFetchNews } from '@src/store/news/functions';
import { newsSelector } from '@src/store/news/selectors';

const ListCats = ({listCats}: {listCats: any[]}) => {
  return (
    <View>
      {listCats.map(category => (
        <Category category={category} key={category?.ID} />
      ))}
    </View>
  );
};

const Category = (props: {category: any, lastNewsID?: number}) => {
  const {category, lastNewsID} = props;
  const userId = useSelector(userIdSelector);
  const _category = camelCaseKeys(category);
  const {listNews, listCats, type, layoutType} = _category;
  const shouldRenderCategory = handleShouldRenderCategory(_category, userId);
  const renderChild = () => {
    switch (layoutType) {
      case LAYOUT_TYPE.root: {
        return (
          <ListNews listNews={listNews} type={type} lastNewsID={lastNewsID} />
        );
      }
      case LAYOUT_TYPE.child: {
        return <ListCats listCats={listCats} />;
      }
      default:
        return null;
    }
  };
  if (!shouldRenderCategory) {
    return null;
  }
  return <View>{renderChild()}</View>;
};

const NewsScreen = () => {
  const handleFetchNews = async () => {
    try {
      actionFetchNews();
    } catch (error) {
      console.log(error);
    }
  };

  const {data, isFetching} = useSelector(newsSelector);
  const lastNewsID = useNavigationParam('lastNewsID', 0);

  useFocusEffect(
    useCallback(() => {
      handleFetchNews();
    }, []),
  );
  return (
    <View2 style={styled.container}>
      <Header title="Bulletin" style={styled.header} />
      <View fullFlex borderTop style={{overflow: 'hidden'}}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={handleFetchNews}
            />
          }
          style={styled.scrollViewContainer}
          contentContainerStyle={styled.scrollViewContentContainer}>
          {data.length > 0 &&
            data
              .sort((a, b) => a?.Type - b?.Type)
              .map((category, index, arr) => (
                <Category
                  category={category}
                  firstChild={index === 0}
                  lastChild={index === arr.length - 1}
                  key={category?.ID}
                  lastNewsID={lastNewsID}
                />
              ))}
        </ScrollView>
      </View>
    </View2>
  );
};

export default withLazy(NewsScreen);
