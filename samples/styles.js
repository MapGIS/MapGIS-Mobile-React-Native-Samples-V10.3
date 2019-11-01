import { Dimensions, StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
    alignSelf: 'stretch',
  },
  controls: {
    height: 72,
    flexDirection: 'row',
    elevation: 4,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#292c36',
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    marginTop: 4,
  },

  columnControls: {
    flexDirection: 'column',
    position: 'absolute',
    elevation: 4,
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: 'rgba(50, 50, 50, 0.5)',
  },
  columnControl: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  columnLabel: {
    color: '#000',
    marginTop: 4,
  },

  buttons: {
    width: Dimensions.get('window').width,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  button: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    margin: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(245,83,61,0.8)',
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
});
