var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);
var router = express.Router();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/target-carpool');
//import schemas
var Note = require('./app/models/note');
var User = require('./app/models/user');
var Carpool = require('./app/models/carpool');
var Destination = require('./app/models/destination');
var Address = require('./app/models/address');


//ROUTES FOR API

//---------------------------
// USERS
//---------------------------

//Occurs on every request
//use for basic server logging
router.use(function(req,res,next){
  console.log('api request');
  next();
});

router.get('/', function(req, res){
  res.json({message: 'Target API landing'});
});


//Routes for users 
//anything with '/user'
router.route('/user')
.post(function(req,res){
  var newUser = new User();
  newUser.name = req.body.name;
  newUser.DestID = req.body.DestID;
  newUser.AddrID = req.body.AddrID;
  newUser.email = req.body.email;
  newUser.mobilePhone = req.body.mobilePhone;
  newUser.workPhone = req.body.workPhone;
  newUser.CarPoolID = req.body.CarPoolID;

  newUser.save(function(err){
    if(err)
      res.send(err);
    console.log('New User Created');
    res.json({message: 'User created'});
  });


})
.get(function(req,res){
  User.find(function(err, users){
    if(err)
      res.send(err);
    console.log('All Users Retrieved');
    res.json(users);
  });
});

// /GET user by Email
router.route('/user/email/:email')
.get(function(req,res){
  User.findOne({email: req.params.email}, function(err, user){
    if(err)
      res.send(err);
    console.log('User retrieved via email.');
    res.json(user);
  });
});

// /GET user by ID
router.route('/user/id/:user_id')
.get(function(req,res){
  User.findOne({_id: req.params.user_id}, function(err, user){
    if(err)
      res.send(err);
    console.log('User retrieved via id.');
    res.json(user);
  });
})
.put(function(req, res){
  User.findOne({_id: req.params.user_id}, function(err, user){
    if(err)
      res.send(err);
    console.log(req.body.name);
    if(!req.body.name)
      user.name = user.name;
    else
      user.name = req.body.name;
    if(!req.body.email)
      user.email = user.email;
    else
      user.email = req.body.email;
    if(!req.body.mobilePhone)
      user.mobilePhone = user.mobilePhone;
    else
      user.mobilePhone = req.body.mobilePhone;
    if(!req.body.workPhone)
      user.workPhone = user.workPhone;
    else
      user.workPhone = req.body.workPhone;

    user.save(function(err){
      if(err)
        res.send(err);
      console.log('User was updated.');
      res.json({message: 'User was updated'});
    });
    Address.findOne({_id: user.AddrID}, function(err, addr){
      if(!req.body.street)
        addr.street = addr.street;
      else
        addr.street = req.body.street;
      if(!req.body.city)
        addr.city = addr.city;
      else
        addr.city = req.body.city;
      if(!req.body.state)
        addr.state = addr.state;
      else
        addr.state = req.body.state;
      if(!req.body.zip)
        addr.zip = addr.zip;
      else
        addr.zip = req.body.zip;

      addr.save(function(err){
        if(err)
          res.send(err);
        console.log("User address was updated");
        res.json({message: 'User Address Updated'});
      });
    });
  });
});



//---------------------------
// DESTINATION
//---------------------------
router.route('/destination')
.post(function(req,res){
  var newDestination = new Destination();
  newDestination.AddrID = req.body.AddrID;
  newDestination.description = req.body.description;

  newDestination.save(function(err){
    if(err)
      res.send(err);
    console.log('New Destination Created');
    res.json({message: 'Destination created'});
  });
})
.get(function(req,res){
  Destination.find(function(err, destinations){
    if(err)
      res.send(err);
    console.log('All Destinations Retrieved');
    res.json(destinations);
  });
});

// /GET destination by ID
router.route('/destination/id/:destination_id')
.get(function(req,res){
  Destination.findOne({_id: req.params.destination_id}, function(err, destination){
    if(err)
      res.send(err);
    console.log('Destination retrieved via id.');
    res.json(destination);
  });
});

//---------------------------
// ADDRESS
//---------------------------
router.route('/address')
.post(function(req,res){
  var newAddr = new Address();
  newAddr.street = req.body.street;
  newAddr.city = req.body.city;
  newAddr.state = req.body.state;
  newAddr.zip = req.body.zip;
  newAddr.adjAddr = req.body.adjAddr;
  var sender = res;
  geocoder.geocode(req.body.street + " " + req.body.city +" "+ req.body.state)
  .then(function(res){
    console.log(res[0].latitude);
    newAddr.loc[0] = res[0].longitude;
    newAddr.loc[1] = res[0].latitude;
    newAddr.save(function(err){
      if(err)
        sender.send(err);
      console.log('New Address Created');
      sender.json({message: 'Address created'});
    });
  })
  .catch(function(err){
    console.log(err);
  });

})
.get(function(req,res){
  Address.find(function(err, addresses){
    if(err)
      res.send(err);
    console.log('All Addresses Retrieved');
    res.json(addresses);
  });
});

// /GET address by ID
router.route('/address/:address_id')
.get(function(req,res){
  Address.findOne({_id:req.params.address_id}, function(err, address){
    if(err)
      res.send(err);
    console.log('Address retrieved via id.');
    res.json(address);
  });
});

router.route('/address/test/:startAddress')
.get(function(req,res){
  var sender = res;
  geocoder.geocode(req.params.startAddress)
  .then(function(res){
    var coords = [parseFloat(res[0].longitude), parseFloat(res[0].latitude)];
    Address.find({'loc': {'$near': coords, '$maxDistance': 10/111.12}},
      function(err, addrs){
        if(err)
          sender.send(err);
        console.log(addrs);
        sender.json(addrs);
      });
  })
  .catch(function(err){
    console.log(err);
  });
});


//---------------------------
// CARPOOL
//---------------------------
router.route('/carpool')
.post(function(req,res){
  var newCarpool = new Carpool();
  newCarpool.DestID = req.body.DestID;
  newCarpool.OwnerID = req.body.OwnerID;
  newCarpool.seats = req.body.seats;
  newCarpool.color = req.body.color;
  newCarpool.mileage = req.body.mileage;
  newCarpool.arrivalTime = req.body.arrivalTime;
  newCarpool.oneTime = req.body.oneTime;

  newCarpool.save(function(err){
    if(err)
      res.send(err);
    console.log('New Carpool Created');
    res.json({message: 'Carpool created'});
  });
})
.get(function(req,res){
  Carpool.find(function(err, carpools){
    if(err)
      res.send(err);
    console.log('All Carpools Retrieved');
    res.json(carpools);
  });
});

// /GET carpool by ID
router.route('/carpool/:carpool_id')
.get(function(req,res){
  Carpool.findOne({_id:req.params.carpool_id}, function(err, carpool){
    if(err)
      res.send(err);
    console.log('Carpool retrieved via id.');
    res.json(carpool);
  });
});

router.route('/carpool/search/:time/:destStreet/:destZip/:startAddress')
.get(function(req,res){
  req.params.time = new Date(req.params.time);
  var maxDate = new Date(req.params.time.getTime() + 900000);
  var minDate = new Date(req.params.time.getTime() - 900000);
  var sender = res;
  geocoder.geocode(req.params.startAddress)
  .then(function(res){
    var coords = [parseFloat(res[0].longitude), parseFloat(res[0].latitude)];

    Address.find({'street':req.params.destStreet,
      'zip': req.params.destZip}, function(err, addrs){
        if(err)
          sender.send(err);
        console.log("addr query finished");
        var addrIds = addrs.map(function(addr){return addr._id;});

        Destination.find({AddrID:{'$in': addrIds}}, function(err, dests){
          if(err)
            sender.send(err);
          console.log("dest query finished");
          var destIds = dests.map(function(dest){return dest._id;});

          Address.find({'loc': {'$near': coords, '$maxDistance': 10/111.12}},
            function(err, altAddrs){
              if(err)
                sender.send(err);
              var startAddrs = altAddrs.map(function(altAddr){return altAddr._id;});
              console.log('User Address query finished');
              User.find({'AddrID':{'$in':startAddrs}}, function(err, users){
                if(err)
                  send.send(err)
                console.log('user query finished');
                var userIds = users.map(function(user){return user._id;});
                Carpool.find({'DestID':{'$in':destIds}, 
                  'arrivalTime': {'$gte': minDate, '$lt': maxDate},
                  'OwnerID':{'$in':userIds}},
                  function(err, carpools){
                    if(err)
                      sender.send(err);
                    else if(!carpools.length)
                      sender.send({'Error':"No matching carpools"});
                    else{
                      console.log("carpool query finished");
                      sender.json(carpools);
                    }
                  });
              });
            });

});
});
})
.catch(function(err){

});
});


//---------------------------
// NOTES
//---------------------------
router.route('/notes')
.post(function(req,res){s
  var newNote = new Note();
  newNote.body = req.body.body;

  newNote.save(function(err){
    if(err)
      res.send(err);
    console.log('New Note Created');
    res.json({message: 'Notes created'});
  });
})
.get(function(req,res){
  Note.find(function(err, notes){
    if(err)
      res.send(err);
    console.log('All Notes Retrieved');
    res.json(notes);
  });
});

// /GET note by ID
router.route('/note/:note_id')
.get(function(req,res){
  Note.findOne({_id:req.params.note_id}, function(err, note){
    if(err)
      res.send(err);
    console.log('Note retrieved via id.');
    res.json(note);
  });
});



module.exports = router;







