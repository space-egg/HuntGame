import React, {Component} from 'react'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import styles from '../styles'
import mapStyle from './style'

export default class GameMap extends Component {
  render () {
    const {latitude, longitude} = this.props

    console.warn(latitude, longitude)
    return <MapView
      style={styles.map}
      region={{
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }}
      customMapStyle={mapStyle}
      provider={PROVIDER_GOOGLE} />
  }
}
