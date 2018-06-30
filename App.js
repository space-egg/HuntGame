import React, {Component} from 'react'
import {Platform, Text, View} from 'react-native'
import styles from './app/styles'
import GameMap from './app/game-map'
import ControlsWebRTC from './app/controls-webrtc'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
})

export default class App extends Component {
  constructor (props) {
    super(props)

    this.onPositionChange = this.onPositionChange.bind(this)
    this.onPositionChangeErr = this.onPositionChangeErr.bind(this)

    this.state = {
      username: '',
      peername: '',
      message: '',
      peerMessage: '',
      altitudeAccuracy: -1,
      accuracy: 5,
      heading: -1,
      longitude: 0,
      latitude: 0,
      altitude: 0,
      speed: -1,
      timestamp: 0
    }

    // navigator.geolocation.setRNConfiguration({
    //   skipPermissionRequests: true
    // })

    navigator.geolocation.requestAuthorization()
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      this.onPositionChange,
      this.onPositionChangeErr,
      {enableHighAccuracy: true})

    navigator.geolocation.watchPosition(
      this.onPositionChange,
      this.onPositionChangeErr,
      {enableHighAccuracy: true})
  }

  onPositionChange ({coords}) {
    this.setState({
      altitudeAccuracy: coords.altitudeAccuracy,
      accuracy: coords.accuracy,
      heading: coords.heading,
      longitude: coords.longitude,
      latitude: coords.latitude,
      altitude: coords.altitude,
      speed: coords.speed,
      timestamp: coords.timestamp
    })
  }

  onPositionChangeErr (data) {
    console.error(data)
  }

  render () {
    const {latitude, longitude} = this.state

    return (
      <View style={styles.container}>
        {latitude !== 0 && <GameMap
          latitude={latitude}
          longitude={longitude} />}

        <ControlsWebRTC />

        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    )
  }
}
