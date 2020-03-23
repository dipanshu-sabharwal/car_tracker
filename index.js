//cars database
cars = [];

class Car {
  constructor(car_make, model, top_speed) {
    this.carMake = car_make;
    this.model = model;
    this.topSpeed = top_speed;
    this.avgSpeed = 0;
    this.dist = 0;
    this.trips = [];
  }

  //method to update trip of a car
  trip(time, speed) {
    //setting default values
    if (time == 0) {
      time = 1;
    }
    if (speed == 0) {
      speed = this.topSpeed / 2;
    }

    //updating total distance travelled
    let distance = time * speed;
    this.dist += distance;

    //trip object that contains info for a single trip of a single car
    let trip = {};
    trip.time = time;
    trip.distance = distance;
    trip.avgSpeed = speed;

    //pushing values to trip array
    this.trips.push(trip);

    //updating avgSpeed after every new trip is added
    var totalDistance = 0;
    var totalTime = 0;
    this.trips.forEach(function(trip) {
      totalDistance += trip.distance;
      totalTime += trip.time;
    });
    let totalAverage = Math.round(totalDistance / totalTime);
    this.avgSpeed = totalAverage;
  }

  //method to return information of the current status of a car
  presentStatus() {
    return `${this.carMake} ${this.model} has top speed of ${this.topSpeed}km/hr.\n\nIt has travelled a total of ${this.dist} kilometeres with an average speed of ${this.avgSpeed}km/hr`;
  }
}

//method to create a car
function createCar() {
  let carMake = $("#carMake").val();
  let model = $("#model").val();
  let topSpeed = Number($("#topSpeed").val());

  //validating inputs
  if (carMake == "" || model == "" || topSpeed == "") {
    if (carMake == "") {
      alert("Make cannot be empty");
      return;
    } else if (model == "") {
      alert("Model cannot be empty");
      return;
    } else {
      alert("Top speed cannot be empty");
      return;
    }
  }

  //creating a new car only if it not already present
  let result = cars.filter(function(car) {
    return car.carMake == carMake && car.model == model;
  });

  //check to see if the car is already present in database
  if (result.length == 1) {
    alert(
      "This car is already present. Try to add the trip info in the next form."
    );
    $("#carMake").val("");
    $("#model").val("");
    $("#topSpeed").val("");
    return;
  }

  //creating a new car
  const car = new Car(carMake, model, topSpeed);
  cars.push(car);

  //populating the slector tag for all cars present in db
  populateSelector();

  //resetting values
  $("#carMake").val("");
  $("#model").val("");
  $("#topSpeed").val("");

  alert("Car entry created successfully.");
}

//method to populate car selector
function populateSelector() {
  $("#carSelector").empty();
  cars.forEach(function(e) {
    let option = document.createElement("option");
    option.textContent = e.carMake + " " + e.model;
    $("#carSelector").append(option);
  });
}

//method to update trip information of the selected car
function calculateTrip() {
  //checking for valid input
  if ($("#carSelector").val() == null) {
    return;
  }

  //getting trip values to update
  let car = $("#carSelector")
    .val()
    .split(" ");
  let carMake = car[0];
  let model = car[1];
  let time = Number($("#time").val());
  let speed = Number($("#speed").val());

  //searching for the particular car and updating its trip info
  cars.forEach(function(car) {
    if (car.carMake == carMake && car.model == model) {
      car.trip(time, speed);
    }
  });

  //resetting inputs
  alert("Trip saved successfully");
  $("#speed").val("");
  $("#time").val("");
  $("#currentStatusDetails").css("visibility", "hidden");
}

//method to show status of a particular car at any given moment
function showStatus() {
  //validating input
  if ($("#carSelector").val() == null) {
    return;
  }

  let car = $("#carSelector")
    .val()
    .split(" ");
  let carMake = car[0];
  let model = car[1];

  //fetching status of car and updating the div with information received
  cars.forEach(function(car) {
    if (car.carMake == carMake && car.model == model) {
      let html = `<p class="text-center font-weight-bold">${car.presentStatus()}</p>`;
      $("#currentStatusDetails").html(html);
      $("#currentStatusDetails").css("visibility", "visible");
    }
  });
}

//method to show all trips infos of all cars serialwise
function showAllTrips() {
  //validating input
  if (cars.length == 0) {
    return;
  }

  //creating a table with the first row as header
  var table = `<table class="table table-bordered table-striped table-hover text-center shadow shadow-lg">
                <tr class="bg-dark text-light">
                  <th>Car Make</th>
                  <th>Model</th>
                  <th>Trip Number</th>
                  <th>Distance Travelled</th>
                  <th>Time Travelled</th>
                  <th>Average Speed</th>
                </tr>`;

  //updating the table rows for the all trip info fetched for all cars
  cars.forEach(function(car) {
    if (car.trips.length != 0) {
      car.trips.forEach(function(trip, index) {
        table += `<tr>
                    <td>${car.carMake}</td>
                    <td>${car.model}</td>
                    <td>${index + 1}</td>
                    <td>${trip.distance}</td>
                    <td>${trip.time}</td>
                    <td>${trip.avgSpeed}</td>
                  </tr>`;
      });
    }
  });

  table += "</table>";
  $("#tripDetails").html(table);
}
