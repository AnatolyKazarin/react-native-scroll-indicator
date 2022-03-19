import React, { useState, useEffect, useRef } from 'react'
import { View, Animated, ViewStyle, FlatListProps, useWindowDimensions } from 'react-native'
import { _style } from './style'

type FlatListIndicatorProps = {
  indicatorHeight?: number
  shouldIndicatorHide?: boolean
  hideTimeout?: number
  style?: ViewStyle
  scrollViewStyle?: ViewStyle
  scrollIndicatorContainerStyle?: ViewStyle
  scrollIndicatorStyle?: ViewStyle
} & FlatListProps<any>

/**
 * FlatList с кастомным scrollIndicator
 */
export const FlatListIndicator: React.FC<FlatListIndicatorProps> = ({
  indicatorHeight = 200,
  shouldIndicatorHide = true,
  hideTimeout = 700,
  style = {},
  scrollViewStyle = {},
  scrollIndicatorContainerStyle = {},
  scrollIndicatorStyle = {},
  ...props
}) => {
  const { height: HEIGHT } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scrollIndicator = useRef(new Animated.Value(0)).current

  const [indicatorFlexibleHeight, setIndicatorFlexibleHeight] = useState<number>(indicatorHeight)
  const [fullSizeContentHeight, setFullSizeContentHeight] = useState<number>(1)
  const [isIndicatorHidden, setIsIndicatorHidden] = useState<boolean>(shouldIndicatorHide)

  const difference =
    HEIGHT > indicatorFlexibleHeight ? HEIGHT - indicatorFlexibleHeight : 1

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    HEIGHT / fullSizeContentHeight,
  ).interpolate({
    inputRange: [0, difference],
    outputRange: [difference, 0],
    extrapolate: 'clamp',
  })

  useEffect(() => {
    isIndicatorHidden
      ? Animated.timing(fadeAnim, {
          toValue: 0,
          duration: hideTimeout,
          useNativeDriver: true,
        }).start()
      : Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }).start()
  }, [fadeAnim, hideTimeout, isIndicatorHidden])

  useEffect(() => {
    setIndicatorFlexibleHeight((HEIGHT * HEIGHT) / fullSizeContentHeight)
  }, [fullSizeContentHeight])

  const runHideTimer = () => {
    shouldIndicatorHide && setIsIndicatorHidden(true)
  }

  const showIndicator = () => {
    shouldIndicatorHide && setIsIndicatorHidden(false)
  }

  const isContentSmallerThanScrollView = fullSizeContentHeight - HEIGHT <= 0

  return (
    <View style={[_style.container, style]}>
      <Animated.FlatList
        style={[_style.scrollViewContainer, scrollViewStyle]}
        onContentSizeChange={(width, height) => {
          setFullSizeContentHeight(height)
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollIndicator,
                },
              },
            },
          ],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={runHideTimer}
        onScrollBeginDrag={showIndicator}
        showsVerticalScrollIndicator={false}
        {...props}
      />
      {!isContentSmallerThanScrollView && (
        <Animated.View
          style={[
            _style.scrollIndicatorContainer,
            { opacity: fadeAnim },
            scrollIndicatorContainerStyle,
          ]}>
          <Animated.View
            style={[
              _style.scrollIndicator,
              { height: indicatorFlexibleHeight },
              scrollIndicatorStyle,
              { transform: [{ translateY: scrollIndicatorPosition }] },
            ]}
          />
        </Animated.View>
      )}
    </View>
  )
}
