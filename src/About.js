import React from 'react';
import {SafeAreaView,TouchableOpacity,FlatList,ActivityIndicator,View,BackHandler,StyleSheet,Text} from 'react-native';
import {WebView} from 'react-native-webview';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

class About extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('data', 'Default Title'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      country: [],
      isLoading: true,
      networkStatus: true,
    };
  }

  componentWillUnmount() {
    
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleConnectivityChange = (state) => {
    if (
      (state.isConnected && true === state.isConnected) ||
      state.type !== 'none'
    ) {
      this.setState({networkStatus: false});
    } else {
      this.setState({networkStatus: true});
    }
  };

  componentDidMount() {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const user_name = this.props.navigation.getParam('data', 'NO-User');

    //get data from offline database
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user where region = ?',
        [user_name],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));

          this.setState({
            country: temp,
            isLoading: false,
          });
        },
      );
    });
  }

  handleBackPress = () => {

    this.props.navigation.navigate('HomePage');

    return true; 

  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{flex: 1}}>
            {this.state.isLoading ? (
              <ActivityIndicator
                style={{marginTop: 100}}
                size={'large'}
                color={'blue'}
              />
            ) : (
              <FlatList
                enableEmptySections={true}
                data={this.state.country}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('Language', {
                          data: item.name,
                        });
                      }}>
                      <View style={styles.box}>
                        {this.state.networkStatus ? (
                          <Text style={styles.name}></Text>
                        ) : (
                          <WebView
                            source={{uri: item.flag}}
                            style={{width: 150, height: 100}}
                          />
                        )}

                        <View style={styles.info}>
                          <Text style={styles.name}>{item.name}</Text>

                          <Text style={styles.iconFonts}>{item.capital}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D19C',
    paddingBottom: 120,
    paddingStart: 10,
    paddingEnd: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  image: {
    width: 100,
    height: 100,
  },
  box: {
    marginBottom:10,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    marginTop: 10,
    backgroundColor: '#99D19C',
    flexDirection: 'row',
    shadowColor: 'black',
    borderRadius: 6,
    shadowOpacity: 0.5,
    elevation: 2,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    
  },
  name: {
    color: '#333',
    fontSize: 20,
    marginTop: 10,
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 40,
    marginTop: 10,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconFonts: {
    color: 'gray',
  },
});

export default About;
