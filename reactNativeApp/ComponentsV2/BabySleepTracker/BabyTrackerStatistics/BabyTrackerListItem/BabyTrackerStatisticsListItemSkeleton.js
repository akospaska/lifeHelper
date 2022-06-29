import { Text, View, Center, Pressable, Flex, Skeleton, VStack } from 'native-base'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const BabyTrackerStatisticsListItemSkeleton = () => {
  return (
    <View
      style={{
        borderColor: '#98A5A9',
        borderWidth: 1,
        marginBottom: hp('3%'),
        padding: 5,
        borderRadius: 10,

        width: wp('90%'),
      }}
    >
      <Center>
        <Skeleton size="4" rounded="full" width={wp('80%')} marginBottom={hp('1%')} />
        <Skeleton size="4" rounded="full" width={wp('80%')} marginBottom={hp('1%')} />
        <Skeleton size="4" rounded="full" width={wp('80%')} marginBottom={hp('1%')} />
      </Center>
    </View>
  )
}

export default BabyTrackerStatisticsListItemSkeleton
