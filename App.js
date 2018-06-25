import React, {Component} from 'react'

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Dimensions
} from 'react-native'

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import {RTCPeerConnnection} from 'react-native-webrtc'

import mapStyle from './map-style'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
})

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center'
  },
  textInput: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  map: {
    top: 0,
    left: 0,
    width: width,
    height: 400
  }
})

export default class App extends Component {
  constructor (props) {
    super(props)

    this.onLogin = this.onLogin.bind(this)
    this.onConnectToPeer = this.onConnectToPeer.bind(this)
    this.onSendMessage = this.onSendMessage.bind(this)

    this.state = {
      username: '',
      peername: '',
      message: '',
      peerMessage: ''
    }

    this.socket = new WebSocket('ws://localhost:9090')

    this.socket.onmessage = this.onMessage.bind(this)
    this.rtcPeer = null

    navigator.geolocation.setRNConfiguration({
      skipPermissionRequests: true
    })

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

    this.dataChannel.onerror = (err) => {

    }

    this.dataChannel.onmessage = () => {

    }
  }

  onPositionChange (data) {
    console.log(data)
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
    const {username, peername, message} = this.state

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE} />

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
