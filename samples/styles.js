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
    flexWrap: 'wrap',
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
  description: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
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
  logs: {
    flex: 1,
    elevation: 8,
    backgroundColor: '#292c36',
  },
  logItem: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  logItemHeader: {
    flexDirection: 'row',
  },
  logTime: {
    color: '#757575',
    fontSize: 12,
  },
  logLabel: {
    marginLeft: 8,
    color: '#f5533d',
    fontSize: 12,
  },
  logData: {
    color: '#eee',
    fontSize: 12,
  },
  form: {
    padding: 15,
    backgroundColor: '#292c36',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    margin: 8,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  textView: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  itemSingleView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#292c36',
  },
  itemKey: {
    fontSize: 16,
    color: '#rgba(245,83,61,0.8)',
    flexDirection: 'column',
    textAlign: 'left',
    flexWrap: 'wrap',
    paddingTop: 5,
  },
  // item的可见字体样式
  itemValue: {
    fontSize: 16,
    color: '#fff',
    flexDirection: 'column',
    textAlign: 'left',
    flexWrap: 'wrap',
    paddingLeft: 5,
    paddingTop: 5,
  },
  splitLine: {
    height: 1,
    backgroundColor: '#cccccc',
  },
});
