import { FONTS } from '@src/styles';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components/native';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  flex: {
    flex: 1,
  },
  name: {
    ...FONTS.TEXT.desc,
    minHeight: 35,
    justifyContent: 'center',
    textAlignVertical: 'center',
    lineHeight: 35,
  },
  number: {
    marginRight: 15,
  },
  swipeOutButton: {
    paddingHorizontal: 25,
    borderRadius: 4,
    marginBottom: 16
  },
  active: {
    ...FONTS.STYLE.bold,
  }
});

const MasterKey = ({ name, number, onPress, onDelete, isActive }: {
  name: string, number: any, onPress: () => void, onDelete?: (name: any) => void, isActive?: boolean
}) => {
  const theme = useTheme();

  //TODO: Implement swipeout
  // return (
  //   <Swipeout
  //     style={[styles.swipeOutButton, { backgroundColor: colors.background5 }]}
  //     right={
  //       onDelete
  //         ? [{
  //           text: 'Delete',
  //           backgroundColor: COLORS.red,
  //           onPress: () => onDelete(name),
  //         }]
  //         : []
  //     }
  //   >
  //     <TouchableOpacity onPress={onPress}>
  //       <Row style={[styles.container, { backgroundColor: colors.background5 }]} spaceBetween center>
  //         <Text
  //           style={[styles.name, isActive && styles.active, styles.flex]}
  //           numberOfLines={1}
  //         >
  //           {name}
  //         </Text>
  //         <Row center style={{backgroundColor: colors.background5}}>
  //           <Text style={[styles.name, styles.number]}>{number}</Text>
  //           <ExportIcon />
  //         </Row>
  //       </Row>
  //     </TouchableOpacity>
  //   </Swipeout>
  // );

  return <View style={[styles.container, { backgroundColor: theme.background5 }]}></View>
};

export default MasterKey;

