import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity,FlatList,Image} from 'react-native';
import {WebView} from 'react-native-webview'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });

export default class Home extends Component {

  state = {
    country: [],
    loading: true,
    countrydb:[]
  }
  async componentDidMount() {
  try {
    const response = await fetch('https://restcountries.eu/rest/v2/all');
    const data = await response.json();
    this.setState({country: data, loading: false});
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(id VARCHAR(20) PRIMARY KEY, region VARCHAR(20), name VARCHAR(10), capital VARCHAR(255),flag VARCHAR(255),language VARCHAR(255),borders VARCHAR(255),alpha3Code VARCHAR(255))',
              []
            );
          }
        }
      );
    });

    db.transaction((tx) => {
      for (let i = 0; i < this.state.country.length; i++) {
        var lanValue = [];
        var lanAll = '';

        let region = this.state.country[i].region;

        let name = this.state.country[i].name;
        let capital = this.state.country[i].capital;
        let flag = this.state.country[i].flag;

        let languages = this.state.country[i].languages;
        let borders = this.state.country[i].borders;
        var x = borders.toString();

        let languagesName;

        let alpha3Code = this.state.country[i].alpha3Code;

        for (let index = 0; index < languages.length; index++) {
          languagesName = languages[index].name;

          lanValue.push(languages[index].name);

          lanAll = lanValue.toString();
        }

        tx.executeSql(
          'INSERT INTO table_user (id,region,name, capital,flag,language,borders,alpha3Code) VALUES (?,?,?,?,?,?,?,?)',
          [name, region, name, capital, flag, lanAll, x, alpha3Code],
          (tx, results) => {
            console.log('Results', results);
          },
        );
      }
    });

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * from table_user',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));

          this.setState({
            countrydb: temp,
          });
        },
      );
    });
  }

     catch(err) {
        console.log("Error fetching data-----------", err);
    }
  }

  

  static navigationOptions = {
    title : "Continents in the world!"
  }
  
  render() {
    const { countrydb, loading } = this.state;
    
    return (
      <View>
        <FlatList
          data={[
            {key: 'Asia'},
            {key: 'Europe'},
            {key: 'Africa'},
            {key: 'Oceania'},
            {key: 'Americas'},
            {key: 'Polar'}
          ]}
          renderItem={({item}) => {
              return(
                <TouchableOpacity style={styles.container} onPress={()=> this.props.navigation.navigate('About',{P1:item.key})}>
                  <View style={{marginLeft:35,marginTop:35,marginBottom:35}}>
                  <Text>{item.key}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          }
        />
      </View>
    );
      
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:10,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
    borderWidth:1,
    borderRadius: 6,
    backgroundColor: "#99D19C",
    borderColor: "#20232a",

  },
  
});
