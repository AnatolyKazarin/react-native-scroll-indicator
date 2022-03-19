import { StyleSheet } from 'react-native'

export const _style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollViewContainer: {
    flex: 1,
  },
  scrollIndicatorContainer: {
    position: 'absolute',
    top: 0,
    right: 2,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 10,
    width: 2,
    marginVertical: 3,
  },
  scrollIndicator: {
    position: 'absolute',
    right: 0,
    width: 2,
    borderRadius: 3,
    opacity: 0.8,
    backgroundColor: 'black',
  },
})
