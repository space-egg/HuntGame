import {StyleSheet, Dimensions} from 'react-native'

const {width} = Dimensions.get('window')

export default StyleSheet.create({
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
    width: width,
    height: 400
  },
  text: {
    height: 100,
    width: width,
    backgroundColor: '#fff'
  }
})
