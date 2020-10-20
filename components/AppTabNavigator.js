import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { AppStackNavigator } from './AppStackNavigator'
import SearchJobsScreen from '../screens/SearchJobsScreen';
import PostJobsScreen from '../screens/PostJobsScreen';



export const AppTabNavigator = createBottomTabNavigator({
  Intrestead : {
    //screen: SearchJobsScreen,
    screen: AppStackNavigator,
    navigationOptions :{
     // tabBarIcon : <Image source={require("../assets/request-list.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Search Jobs",
    }
  },
  PostAJobs: {
    screen: PostJobsScreen,
    navigationOptions :{
     // tabBarIcon : <Image source={require("../assets/request-book.png")} style={{width:20, height:20}}/>,
      tabBarLabel : "Post Jobs",
    }
  }
});