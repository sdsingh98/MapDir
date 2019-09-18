import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';

export default class RnDirectionsApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coords: []
    }
  }

  componentDidMount() {
    // find your origin and destination point coordinates and pass it to our method.
    this.getDirections("19.2114,72.8757", "19.209779,72.864515");
    this.getDistanceOneToOne("19.2114","72.8757","19.209779","72.864515");
  }


  async getDistanceOneToOne(lat1, lng1, lat2, lng2)
  {
   const Location1Str = lat1 + "," + lng1;
   const Location2Str = lat2 + "," + lng2;

   let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

   let params = `origins=${Location1Str}&destinations=${Location2Str}&key=AIzaSyCzh8L3Al3i_mKWpcDZOoPbMKHeVFmdNPQ`; 
   let finalApiURL = `${ApiURL}${encodeURI(params)}`;

   let fetchResult =  await fetch(finalApiURL); // call API
   let Result =  await fetchResult.json(); // extract json
   console.log(Result.rows[0].elements[0].distance.value);
   return Result.rows[0].elements[0].distance;
  }


  async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=19.2114,72.8757&destination=19.209779,72.864515&waypoints=optimize:true|19.214563,72.870539|19.205698,72.873811&key=AIzaSyCzh8L3Al3i_mKWpcDZOoPbMKHeVFmdNPQ`)
            let respJson = await resp.json();
            //console.log(respJson);
            let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
            let coords = points.map((point, index) => {
                return  {
                    latitude : point[0],
                    longitude : point[1]
                }
            })
            this.setState({coords: coords})
            return coords
        } catch(error) {
            alert(error)
            return error
        }
    }

  render() {
    console.log(this.dis1);
    console.log(this.dis2);
    return (
      <View>
        <MapView style={styles.map} initialRegion={{
          latitude:19.2114,
          longitude:72.8757,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}>

        <MapView.Polyline
            coordinates={this.state.coords}
            strokeWidth={2}
            strokeColor="red"/>

        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
});
