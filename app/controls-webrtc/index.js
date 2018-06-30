import React, {Component} from 'react'
import {View, TextInput, Button} from 'react-native'
import {RTCPeerConnnection} from 'react-native-webrtc'
import styles from '../styles'

export default class ControlsWebRTC extends Component {
  constructor (props) {
    super(props)

    this.state = {
      userName: '',
      peerName: '',
      message: ''
    }

    this.rtcPeer = null
    this.dataChannel = null
    this.socket = new WebSocket('ws://localhost:9090')
    this.socket.onmessage = this.onSocketMessage.bind(this)
    this.socket.onopen = this.onSocketOpen.bind(this)
    this.socket.onerror = this.onSocketError.bind(this)
  }

  onSocketMessage (message) {
    const data = JSON.parse(message.data)

    switch (data.type) {
      case 'login':
        return this.onLogin(data.success)
      case 'offer':
        return this.onOffer(data.offer, data.name)
      case 'answer':
        return onAnswer(data.answer)
      case 'candidate':
        return onCandidate(data.candidate)
    }
  }

  onSocketOpen () {
    console.warn('Socket connected')
  }

  onSocketError (err) {
    console.warn('Socket error:', err)
  }

  onLogin (success) {
    if (success === false) {
      alert('oops.. login failed.')
    } else {
      this.rtcPeer = new RTCPeerConnnection({
        iceServers: [{url: 'stun:stun.1.google.com:19302'}]
      })

      this.rtcPeer.onicecandidate = ({candidate}) => {
        if (candidate) this.send({type: 'candidate', candidate})
      }
    }

    openDataChannel()
  }

  send (message) {
    this.socket.send(JSON.stringify(message))
  }

  onLoginPress () {
    const {userName} = this.state
    if (userName !== '') {
      this.send({type: 'login', userName})
    }
  }

  onConnectToPeerPress () {
    const {peerName} = this.state
    if (peerName !== '') {
      this.rtcPeer.createOffer(offer => {
        this.send({type: 'offer', offer})

        this.rtcPeer.setLocalDescription(offer)
      }, err => {
        alert('Error making offer: ', err)
      })
    }
  }

  onOffer (offer, name) {
    
  }

  render () {
    const {username, peername, message} = this.state

    return (
      <View>
        <TextInput
          style={styles.textInput}
          value={username}
          onChangeText={userName => this.setState({userName})} />
        <Button
          title='Login'
          onPress={this.onLoginPress} />

        <TextInput
          style={styles.textInput}
          value={peername}
          onChangeText={peerName => this.setState({peerName})} />
        <Button
          title='Establish connection'
          onPress={this.onConnectToPeerPress} />

        <TextInput
          style={styles.textInput}
          message={message}
          onChangeText={message => this.setState({message})} />
        <Button
          title='Send text message'
          onPress={this.onSendMessage} />
      </View>
    )
  }
}
