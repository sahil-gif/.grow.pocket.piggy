import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyAppliedJobs extends Component {
   constructor(){
     super()
     this.state = {
       studentId : firebase.auth().currentUser.email,
       studentName : "",
       allJobs : []
     }
     this.requestRef= null
   }

   static navigationOptions = { header: null };

   getStudentDetails=(studentId)=>{
     db.collection("users").where("email_id","==", studentId).get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         this.setState({
           "studentName" : doc.data().first_name + " " + doc.data().last_name
         })
       });
     })
   }

   getAllJobs =()=>{
     this.requestRef = db.collection("all_jobs").where("student_id" ,'==', this.state.studentId)
     .onSnapshot((snapshot)=>{
       var allJobs = []
       snapshot.docs.map((doc) =>{
         var job = doc.data()
         job["doc_id"] = doc.id
         allJobs.push(job)
       });
       this.setState({
         allJobs : allJobs
       });
     })
   }

   applyJob=(jobDetails)=>{
     if(jobDetails.request_status === "Job Done"){
       var requestStatus = "Student Interested"
       db.collection("all_jobs").doc(jobDetails.doc_id).update({
         "request_status" : "Student Interested"
       })
       this.sendNotification(jobDetails,requestStatus)
     }
     else{
       var requestStatus = "Job Done"
       db.collection("all_jobs").doc(jobDetails.doc_id).update({
         "request_status" : "Job Done"
       })
       this.sendNotification(jobDetails,requestStatus)
     }
   }

   sendNotification=(jobDetails,requestStatus)=>{
     var requestId = jobDetails.request_id
     var studentId = jobDetails.student_id
     db.collection("all_notifications")
     .where("request_id","==", requestId)
     .where("student_id","==",studentId)
     .get()
     .then((snapshot)=>{
       snapshot.forEach((doc) => {
         var message = ""
         if(requestStatus === "Job Done"){
           message = this.state.studentName + " did the Job"
         }else{
            message =  this.state.studentName  + " has shown interest in doing the Job"
         }
         db.collection("all_notifications").doc(doc.id).update({
           "message": message,
           "notification_status" : "unread",
           "date"                : firebase.firestore.FieldValue.serverTimestamp()
         })
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem
       key={i}
       title={item.job_name}
       subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
       leftElement={<Icon name="job" type="font-awesome" color ='#696969'/>}
       titleStyle={{ color: 'black', fontWeight: 'bold' }}
       rightElement={
           <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Job Done" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.applyJob(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Job Done" ? "Job Done" : "Apply Job"
             }</Text>
           </TouchableOpacity>
         }
       bottomDivider
     />
   )


   componentDidMount(){
     this.getstudentDetails(this.state.studentId)
     this.getAllJobs()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Jobs"/>
         <View style={{flex:1}}>
           {
             this.state.allJobs.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Jobs</Text>
               </View>
             )
             :(
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allJobs}
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
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})
