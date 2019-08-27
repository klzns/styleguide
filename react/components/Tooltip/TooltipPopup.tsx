import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { FC, useEffect, useRef, useState } from 'react'

import Portal from './Portal'
import { useRect } from './hooks'

export type Position = 'top' | 'right' | 'bottom' | 'left'

const OFFSET = 8
const hasComputedDimensions = rect => rect && rect.width && rect.height

const propTypes = {
  /** Tooltip content */
  label: PropTypes.node.isRequired,
  /** Tooltip position */
  position: PropTypes.oneOf<Position>(['top', 'bottom', 'left', 'right']),
  /** Fallback position (when the tooltip cannot appear in the original position) */
  fallbackPosition: PropTypes.oneOf<Position>([
    'top',
    'bottom',
    'left',
    'right',
  ]),
  /** Boolean to see if the popup should appear */
  visible: PropTypes.bool,
  /** Delay to show the tooltip */
  delay: PropTypes.number,
  /** Tooltip animation duration */
  duration: PropTypes.number,
  /** Tooltip timming function used to animate the tooltip */
  timmingFn: PropTypes.string,
  /** Child ref. Used to correctly position the tooltip */
  childRef: PropTypes.shape({
    current: PropTypes.instanceOf(HTMLElement),
  }),
}

const defaultProps = {
  visible: false,
}

const TooltipPopup: FC<PropTypes.InferProps<typeof propTypes>> = ({
  position,
  fallbackPosition,
  label,
  visible,
  delay,
  duration,
  timmingFn,
  childRef,
}) => {
  const [showPopup, setShowPopup] = useState(visible)
  const popupRef = useRef<HTMLDivElement>()
  const childRect = useRect(childRef, visible)
  const popupRect = useRect(popupRef, visible)

  useEffect(() => {
    if (visible) {
      setShowPopup(true)
    }
  }, [visible])

  const popupClasses = classNames(
    'absolute pa3 bg-near-black white br2 shadow-1 f6',
    {
      dn: (!visible && !showPopup) || !childRect || !popupRect,
      'o-0': !visible || !hasComputedDimensions(popupRect),
      'o-100': visible && hasComputedDimensions(popupRect),
    }
  )

  const positionStyle = getStyles(
    childRect,
    popupRect,
    position,
    fallbackPosition
  )

  return positionStyle ? (
    <Portal>
      <div
        role="tooltip"
        className={popupClasses}
        style={{
          ...positionStyle,
          transition: `opacity ${duration}ms ${timmingFn} ${delay}ms`,
        }}
        ref={popupRef}
        onTransitionEnd={() => setShowPopup(visible)}>
        {label}
      </div>
    </Portal>
  ) : null
}

const getStyles = (childRect, popupRect, position, fallbackPosition) => {
  return childRect && popupRect && window
    ? getPopupPosition(childRect, popupRect, position, fallbackPosition)
    : {}
}

const FALLBACK_POSITION = {
  top: 'right',
  right: 'bottom',
  bottom: 'left',
  left: 'top',
}

const getFallbackPosition = (position, fallback) =>
  fallback || FALLBACK_POSITION[position]

const getPopupPosition = (childRect, popupRect, position, fallbackPosition) =>
  getPopupPositionRecursively(
    childRect,
    popupRect,
    position,
    fallbackPosition,
    position
  )
const getPopupPositionRecursively = (
  childRect,
  popupRect,
  position,
  fallbackPosition,
  originalPosition
) => {
  const horizontalMax = window.innerWidth + window.pageXOffset
  const verticalMax = window.innerHeight + window.pageYOffset
  const styles = {
    left: hasComputedDimensions(popupRect)
      ? childRect.left +
        window.pageXOffset +
        (childRect.width - popupRect.width) / 2 +
        (position === 'right'
          ? (childRect.width + popupRect.width) / 2 + OFFSET
          : 0) -
        (position === 'left'
          ? (childRect.width + popupRect.width) / 2 + OFFSET
          : 0)
      : 0,
    top: hasComputedDimensions(popupRect)
      ? childRect.top +
        window.pageYOffset -
        (position === 'top' ? popupRect.height + OFFSET : 0) +
        (position === 'bottom' ? childRect.height + OFFSET : 0) +
        (position === 'right' || position === 'left'
          ? (childRect.height - popupRect.height) / 2
          : 0)
      : 0,
  }

  const collisions = {
    top: styles.top < window.pageYOffset,
    right: styles.left + popupRect.width > horizontalMax,
    bottom: styles.top + popupRect.height > verticalMax,
    left: styles.left < window.pageXOffset,
  }

  if (collisions[position]) {
    fallbackPosition = getFallbackPosition(position, fallbackPosition)
    // If there is no place without collisions, it will not be shown
    return fallbackPosition === originalPosition
      ? null
      : getPopupPositionRecursively(
          childRect,
          popupRect,
          fallbackPosition,
          null,
          originalPosition
        )
  }
  return {
    ...styles,
    top: Math.min(styles.top, verticalMax - popupRect.height - 1),
    left: Math.min(styles.left, horizontalMax - popupRect.width - 1),
  }
}

TooltipPopup.propTypes = propTypes
TooltipPopup.defaultProps = defaultProps

export default TooltipPopup
