import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CloseIcon from '../icon/Close'

export default class Toast extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }

    this.transitionDuration = 180
  }

  componentDidMount() {
    if (this.props.visible) {
      setTimeout(() => {
        this.open()
      }, 10)
      this.startAutoClose()
    }
  }

  // Duration increases along with the length of the message
  getDefaultDuration = () => 3000 + this.props.message.length * 30

  startAutoClose = () => {
    this.stopAutoClose()
    const { duration } = this.props

    if (duration === 0 || duration < 0 || duration === Infinity) {
      return
    }

    this.autoCloseTimeout = setTimeout(
      this.close,
      this.props.duration || this.getDefaultDuration()
    )
  }

  stopAutoClose = () => {
    if (this.autoCloseTimeout == null) return

    clearTimeout(this.autoCloseTimeout)
    this.autoCloseTimeout = null
  }

  handleMouseOver = () => {
    this.stopAutoClose()
  }

  handleMouseOut = () => {
    this.startAutoClose()
  }

  handleCloseClick = () => {
    this.close()
  }

  open = () => {
    this.setState({
      isOpen: true,
    })
  }

  close = () => {
    if (!this.state.isOpen) {
      return
    }

    setTimeout(() => {
      this.props.onClose()
    }, this.transitionDuration)

    this.setState({
      isOpen: false,
    })
  }

  handleActionClick = () => {
    const { isOpen } = this.state
    if (!isOpen) return

    const { action } = this.props
    const handler = action && action.onClick

    if (handler) {
      handler()
    }

    this.close()
  }

  componentDidUpdate(prevProps) {
    if (!this.props.visible && prevProps.visible) {
      this.close()
      this.stopAutoClose()
    } else if (this.props.visible && !prevProps.visible) {
      this.open()
      this.startAutoClose()
    }
  }

  render() {
    const { isOpen } = this.state
    const { onClose, message, action } = this.props
    const hasAction = !!(action && action.onClick && action.label)

    return (
      <div
        className="absolute bottom-0 left-0 z-5 ma7-ns mb0-s w-100 w-auto-ns mw6-m mw-40-l"
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        style={{
          pointerEvents: 'all',
          transition: `transform ${this.transitionDuration}ms ${isOpen ? 'ease-out' : 'ease-in'}`,
          transform: `translate3d(0, ${isOpen ? 0 : '170%'}, 0)`,
          minWidth: '18rem',
        }}
      >
        <div
          className="vtex-toast flex justify-between items-start items-center-ns f5 bg-base--inverted c-on-base--inverted pa5 br2-ns shadow-5"
        >
          <div className="flex-ns flex-grow-1">
            <div className="flex items-center flex-grow-1">
              <div className="pr5 mw6-ns lh-copy">
                {message}
              </div>
            </div>

            {hasAction && (
              <div className="flex flex-grow-1 justify-end items-center">
                <div className="nt4-ns nb4">
                  <button className="ttu bg-transparent b--transparent c-on-base--inverted bw1 ba fw5 ttu br2 fw4 v-mid relative pv4 pl5 pr4 pointer" onClick={this.handleActionClick}>
                    {action.label}
                  </button>
                </div>
              </div>
            )}
          </div>
          {onClose && (
            <div className="pt2 pt0-ns">
              <div
                className="vtex-alert__close-icon pointer flex items-center pa3 white nr3 nv3"
                onClick={this.handleCloseClick}
              >
                <CloseIcon color="currentColor" size={16} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

Toast.propTypes = {
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  }),
  visible: PropTypes.bool,
  duration: PropTypes.number,
}

