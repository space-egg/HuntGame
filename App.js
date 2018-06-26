import React, {Component} from 'react'

import {
  Platform,
  Text,
  View,
  Button,
  TextInput
} from 'react-native'

import {RTCPeerConnnection} from 'react-native-webrtc'
import styles from './app/styles'
import GameMap from './app/game-map'

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

    this.onLogin = this.onLogin.bind(this)
    this.onConnectToPeer = this.onConnectToPeer.bind(this)
    this.onSendMessage = this.onSendMessage.bind(this)

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

    this.socket = new WebSocket('ws://localhost:9090')

    this.socket.onmessage = this.onMessage.bind(this)
    this.rtcPeer = null

    navigator.geolocation.setRNConfiguration({
      skipPermissionRequests: true
    })

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

  send (message) {
    this.socket.send(JSON.stringify(message))
  }

  openDataChannel () {
    this.dataChannel = this.rtcPeer.createDataChannel('channel', {reliable: true})
    this.dataChannel.onerror = (err) => { console.warn(err) }
    this.dataChannel.onmessage = () => {}
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

  onMessage (message) {
    const data = JSON.parse(message.data)

    switch (data.type) {
      case 'login':
        return this.onLoginMessage(data.success)
    }
  }

  onLoginMessage (success) {
    if (!success) {
      window.alert('oops... login failed.')
    } else {
      // TODO add lib
      this.rtcPeer = new RTCPeerConnnection({
        iceServers: [{url: 'stun:stun.1.google.com:19302'}]
      }, {
        optional: [{RtpDataChannnels: true}]
      })

      this.rtcPeer.onicecandidate = ({candidate}) => {
        if (candidate) {
          this.send({type: 'candidate', candidate})
        }
      }

      this.openDataChannel()
    }
  }

  onLogin () {
    const {username} = this.state

    if (username !== '') {
      this.send({type: 'login', username})
    }
  }

  onConnectToPeer () {

  }

  onSendMessage () {

  }

  render () {
    const {
      username, peername, message,
      latitude, longitude
    } = this.state

    return (
      <View style={styles.container}>
        {latitude !== 0 && <GameMap
          latitude={latitude}
          longitude={longitude} />}

        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={(username) => this.setState({username})} />
        <Button
          title='Login'
          onPress={this.onLogin} />

        <TextInput
          style={styles.textInput}
          value={peername}
          onChangeText={(peername) => this.setState({peername})} />
        <Button
          title='Establish connection'
          onPress={this.onConnectToPeer} />

        <TextInput
          style={styles.textInput}
          message={message}
          onChangeText={(message) => this.setState({message})} />
        <Button
          title='Send text message'
          onPress={this.onSendMessage} />

        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    )
  }
}
