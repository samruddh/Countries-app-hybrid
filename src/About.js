import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, FlatList, Alert} from 'react-native';
import {WebView} from 'react-native-webview'
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });

export default class About extends Component {
  state = {
    list:[]
  }

  static navigationOptions = {
    title : "Countries"
  }

  componentDidMount()
  {
      db.transaction((tx) => {
          tx.executeSql(
            `SELECT * from table_user where region='${this.props.navigation.state.params.P1}'`,
            [],
            (tx, results) => {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i)
                temp.push(results.rows.item(i));
    
              this.setState({
                list: temp,
              });
            },
          );
      });

  }

  renderItem(list) {
      return <TouchableOpacity style={styles.container}>
          <View>
            <WebView
              source={{uri: list.item.flag}}
              automaticallyAdjustContentInsets={false}
              style={{ width: 150, height: 100, margin:10}}
            />
          </View>
          
          <View style={{marginRight:30,marginTop:10}}>
            <Text>Name: {list.item.name}</Text>
            <Text>Capital: {list.item.capital}</Text>
          </View>
          
      </TouchableOpacity>
  }



  render() {
      const { list, loading } = this.state;
      
      return <FlatList 
          data={list}
          renderItem={this.renderItem}
          keyExtractor={(item,index) =>{index.toString} } 
      />
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