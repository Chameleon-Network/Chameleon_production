import React from 'react';
// import { useSelector } from 'react-redux';
// import { nftTokenDataSelector } from '@src/redux/selectors/account';
// import routeNames from '@src/router/routeNames';
// import { useNavigation } from 'react-navigation-hooks';
// import { BottomBar } from '@src/components/core';

// const NFTTokenBottomBar = () => {
//   const navigation = useNavigation();
//   const { titleStr } = useSelector(nftTokenDataSelector);
//   const onNavMintNFTToken = () => navigation.navigate(routeNames.NFTToken);
//   if (titleStr) {
//     return <BottomBar text={titleStr} onPress={onNavMintNFTToken} />;
//   }
//   return null;
// };

const NFTTokenBottomBar = () => null;

NFTTokenBottomBar.propTypes = {};

export default React.memo(NFTTokenBottomBar);
