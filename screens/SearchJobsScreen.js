import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class SearchJobsScreen extends Component{
  constructor(){
    super()
    this.state = {
      requestedJobsList : []
    }
  this.requestRef= null
  }

  getRequestedJobsList =()=>{
    this.requestRef = db.collection("requested_jobs")
    .onSnapshot((snapshot)=>{
      var requestedJobsList = snapshot.docs.map(document => document.data());
      this.setState({
        requestedJobsList : requestedJobsList
      });
    })
  }

  componentDidMount(){
    this.getRequestedJobsList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.job_name}
        subtitle={item.reason_to_request}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={styles.button}
            onPress={()=>{
              this.props.navigation.navigate('ReceiverDetails',{"details":item})
            }}
            >
              <Text style={{color:'#ffff'}}>View</Text>
            </TouchableOpacity>
          }
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Post a Job"/>
        <View style={{flex:1}}>
          {
            this.state.requestedJobsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Requested Jobs</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.requestedJobsList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#027df7",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  }
})