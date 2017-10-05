import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase,FirebaseListObservable } from 'angularfire2/database';
declare var Peer: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {
  title = 'app';
  mypeerid: any;
  peer;
  anotherid;
  key;
  @ViewChild('myvideo') myVideo: any;
  users: FirebaseListObservable<any[]>
  viewUserName:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFireDatabase) {
    this.users = af.list('users');
    this.viewUserName=navParams.data;
  }

  ngOnInit() {
     let video = this.myVideo.nativeElement;
    console.log(video);
    this.peer = new Peer({ host: 'peerjs-server.herokuapp.com', secure: true, port: 443 })
    this.mypeerid = this.peer.id;
    setTimeout(() => {
      this.mypeerid = this.peer.id;
      this.users.push({userName: this.viewUserName, peerID: this.peer.id });
    }, 1000);
      
    this.peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        console.log(data);
      });
    });

    var n = <any>navigator;
    n.getUserMedia = (n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia || n.msGetUserMedia);
    this.peer.on('call', function (call) {
      console.log("call 44");
      console.log(call);
      n.getUserMedia({ video: true, audio: false }, function (stream) {
        call.answer(stream);
        call.on('stream', function (remotestream) {
          console.log(remotestream);
          video.src = URL.createObjectURL(remotestream);
          video.play();
        })
      }, function (err) {
        console.log('Failed to get stream', err);
      })
    })
  }


  startCall(userName,anotherID) {
    this.anotherid = anotherID;
    var conn = this.peer.connect(anotherID);
    conn.on('open', function () {
      conn.send('Message from that id');
    });
  }

  videoconnect(){
    console.log("videoconnect");
    let video = this.myVideo.nativeElement;
    var localvar = this.peer;
    var fname = this.anotherid;
    var n = <any>navigator;
    console.log("another peerID:"+this.anotherid);
    n.getUserMedia = ( n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia  || n.msGetUserMedia );
    
    n.getUserMedia({
      video: true, audio:false
    }, function(stream) {
      var call = localvar.call(fname, stream);
      call.on('stream', function(remotestream) {
          alert("get remotestream"+remotestream);
        console.log(remotestream);
        video.src = URL.createObjectURL(remotestream);
        video.play();
      })
    }, function(err){
      alert(err.name);
      console.log('Failed to get stream', err);
    })
  }

  stopCall(userName) {
    
    
let removeItem = this.af.list('users', {
  query:{
    orderByChild: "userName",
    equalTo: userName
  }
});

// Query the list for the purposes of this example:
removeItem.subscribe((items) => {
  // Remove the matching item:
  if (items.length) {
    removeItem.remove(items[0].$key)
      .then(() => console.log('removed ' + items[0].$key))
      .catch((error) => console.log(error));
  }
});
  //   this.users.subscribe((items) => {
  //      this.users.remove(items[0].$key);
  // });
    // var key: any;
    // var query = this.users.$ref.orderByChild("userName")
    //   .equalTo(userName);
    
    // query.once('value').then(function (snapshot) {
    //    let key = Object.keys(snapshot.val());
    // })
    
   // console.log(this.users);user$
   //  this.af.list("users").remove(this.users[0].$key);

    // query.once('value', function (snapshot) {
    //   let key = Object.keys(snapshot.val());
    //   this.users.remove.remove(key);
    // })
    //  this.users.ref(key).remove();
  }
}
