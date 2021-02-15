import React from 'react';
import {SafeAreaView,FlatList,View,StyleSheet,TouchableOpacity,ActivityIndicator,BackHandler,Text} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'UserDatabase.db'});

class About1 extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('data', 'Default Title'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      checkdata: false,
      country: [],
      isLoading: true,
      bordersName: [],
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    const name = this.props.navigation.getParam('data', 'NO-User');

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_user where name = ?',
        [name],
        (tx, results) => {
          // console.log('results', results);

          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));

          this.setState({
            country: temp,
            isLoading: false,
          });

          this.getBorderFullName();
        },
      );
    });
  }

  getBorderFullName() {
    var temp = [];
    for (let index = 0; index < this.state.country.length; index++) {
      var borders = this.state.country[index].borders;

      var myarray = borders.split(',');

      for (var i = 0; i < myarray.length; i++) {
        let bor = myarray[i];

        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM table_user where alpha3Code = ?',
            [bor],
            (tx, results) => {
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));

              this.setState({
                bordersName: temp,
              });

              if (temp.length == 0) {
                this.setState({
                  checkdata: true,
                });
              }
            },
          );
        });
      }
    }
  }

  handleBackPress = () => {
    this.props.navigation.navigate('Country');

    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

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
                style={styles.container}
                enableEmptySections={true}
                data={this.state.country}
                keyExtractor={(item) => {
                  return item.id;
                }}
                renderItem={({item}) => {
                  return (
                    
                      <View style={styles.box}>
                        <View style={styles.info}>
                          
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black',
                              }}
                            />

                            <View
                              style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black',
                              }}
                            />
                          </View>
                          <Text style={styles.name}> Languages: </Text>
                          <Text style={styles.name}> {item.language} </Text>

                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black',
                              }}
                            />

                            <View
                              style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: 'black',
                              }}
                            />
                          </View>

                          <Text style={styles.name}>Neigbours:</Text>
                          
                          {this.state.checkdata ? (
                            <Text style={styles.name}>None</Text>
                            
                          ) : (
                            <Text style={styles.name}></Text>
                          )}

                          <View>
                            {this.state.bordersName.map((item, index) => (
                              <TouchableOpacity
                                key={index}
                                >
                                <Text style={styles.text}>{item.name}</Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                      </View>
                   
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
  border: {
    marginBottom: 10,
    backgroundColor: '#EEEEEE',
    paddingStart: 10,
    paddingEnd: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    paddingBottom: 120,
    paddingStart: 10,
    paddingEnd: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },

  box: {
    marginTop: 10,
    backgroundColor: '#99D19C',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginBottom: 20,
    fontSize: 20,
    marginTop: 10,
    color: '#333',
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
    marginTop: 5,
    marginBottom: 5,
    color: 'gray',
  },
  iconFonts: {
    marginTop: 10,
    marginBottom: 5,
    color: 'gray',
  },
  red: {
    color: '#FF4500',
  },
});

export default About1;
