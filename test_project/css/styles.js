import { StyleSheet, Dimensions } from 'react-native';

const main = StyleSheet.create({
  container: {
    flex: 3,
    padding: 24,
  },
  appDeleteContainer: {
    backgroundColor: 'red',
    width: 50,
    marginTop: 10,
    elevation: 3,
    borderRadius: 10,
    padding: 5,
    margin: 10,
    alignSelf: 'center'
  },
  appButtonContainer: {
    marginTop: 8,
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase'
  },

  body: {
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },

  headerText: {
    fontSize: 20, 
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white', 
  },
  
  close: {
    margin: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
  },
});

const editReview = StyleSheet.create({
  
  close: {
    margin: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
  },

});

const login = StyleSheet.create({
  appButtonContainer: {
    marginTop: 20,
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    padding: 5,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  container: {
    flex: 1,
},
backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
},
});

const logout = StyleSheet.create({

  rowContainer: {
    flexDirection: 'row'
  },
  appGreenButtonContainer: {
    margin: 20,
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
    
  },
  appRedButtonContainer: {
    margin: 20,
    elevation: 8,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
});

const review = StyleSheet.create({
  review: {
    alignItems: 'stretch'
  },
  separatorLine: {
    height: 1,
    backgroundColor: 'black',
    paddingTop: 2,
  },

  textratingIcon: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  textrating: {
    fontSize: 12,
    fontWeight: 'bold'
  },
});

const search = StyleSheet.create({

  appButtonContainer: {
    margin: 10,
    alignSelf: 'center',
    elevation: 8,
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 6
  },

  appButtonCloseContainer: {
    margin: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25,
    backgroundColor: 'red'
  },

  rowContainer: {
    flexDirection: 'row'
  },
});
const update = StyleSheet.create({
container: {
  flex: 10,
  backgroundColor: '#FFF',
},

});

export { login, editReview, main, logout, review, search, update };
