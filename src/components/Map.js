import React, { Component } from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import ErrorMaps from './ErrorMaps';

const FS_ID = 'WPNKFPMZT4XHB1GTZJPCP2PTOG1FELFJ55MNPYXBM35V0W00'
const FS_SECRET = 'M341RNPI2TZ24NHRI1PLWZU2AZBQ5UTXRXP1XQYCHI4WDB1J'
const FS_VERSION = '20181109'
const G_KEY = 'AIzaSyAN_W_5MzZ1mWS_u4JppTtR49XhNwN7ohE';

class Map extends Component {
   state = {
     map: null,
     markers: [],
     markerProps: [],
     activeMarker: null,
     activeMarkerProps: null,
     showingInfoWindow: false,
     firstDrop: null,
   }

   componentDidMount = () => { }

   componentWillReceiveProps = (props) => {
     this.setState({ firstDrop: false });

     // update markers when filtered
     if (this.state.markers.length !== props.locations.length) {
         this.closeInfoWindow();
         this.updateMarkers(props.locations);
         this.setState({activeMarker: null});

         return;
       }

    // close window if selected item is not open window
    if (!props.selectedIndex || (this.state.activeMarker && (this.state.markets[props.selectedIndex] !== this.state.activeMarker))) {
      this.closeInfoWindow();
     }

     // check for selectedIndex
     if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
       return;
     };

     // when list item is clicked treat marker as clicked
     this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
    }

     // available markers are displayed on map
     mapReady = (props, map) => {
        this.setState({ map });
        this.updateMarkers(this.props.locations);
      }

    // closes active marker window and animations
    closeInfoWindow = () => {
      this.state.activeMarker &&
        this.state.activeMarker.setAnimation(null);

      this.setState({ showingInfoWindow: false, activeMarker: null, activeMarkerProps: null});
    }

    // Search for Yelp matching data when compared to breweries.json
    getBusinessInfo = (props, data) => {
        return data
          .response
          .venues
          .filter(item => item.name.includes(props.name) || props.name.includes(item.name))
    }

    // closes any open InfoWindows
    onMarkerClick = (props, marker, e) => {
      this.closeInfoWindow();

    // FourSquare info fetched for selected marker
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_ID}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
       let headers = new Headers();
       let request = new Request(url, {
           method: 'GET',
           headers
       });

    // Create props for active markers
    let activeMarkerProps;
    fetch(request).then(response => response.json())
      .then(result => {
        let restaurant = this.getBusinessInfo(props, result);
        activeMarkerProps = {
          ...props,
          foursquare: restaurant[0]
        }

        // Get restaurant images and set state
        if (activeMarkerProps.foursquare) {
          let url = 'https://api.foursquare.com/v2/venues/${restaurant[0].id}/photos?client_id=${FS_ID}&client_secret=${FS_SECRET}&v=${FS_VERSION}'
          fetch(url)
            .then(response => response.json())
            .then(result => {
              activeMarkerProps = {
                ...activeMarkerProps,
                images: result.response.photos
              };
              if (this.state.activeMarker)
                  // remove current animation
                this.state.activeMarker.setAnimation(null);
              // set active marker animation
              marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
              this.setState({ showingInfoWindow: true, activeMarker: marker, activeMarkerProps })
            })
          } else {
            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
            this.setState({ showingInfoWindow: true, activeMarker: marker, activeMarkerProps })
          }
       })
    };

    updateMarkers = (locations) => {
   // Prevent error for empty location array
   if (!locations)
     return;
   // Clear remaining markers if any
   this.state.markers.forEach(marker => marker.setMap(null));

   let markerProps = [];
   let markers = locations.map((location, index) => {
     let mProps = {
       key: index,
       index,
       name: location.name,
       position: location.pos,
       url: location.url
     };
     markerProps.push(mProps);

     let animation = this.props.google.maps.Animation.DROP;
     let marker = new this.props.google.maps.Marker({
       position: location.pos,
       map: this.state.map,
       animation
     });
     marker.addListener('click', () => {
       this.onMarkerClick(mProps, marker, null);
     });
     return marker;
   })

   this.setState({ markers, markerProps });
 }

 render = () => {
   const center = {
     lat: this.props.lat,
     lng: this.props.lng
   }
   let amProps = this.state.activeMarkerProps;

   return (
     <Map
       role="application"
       aria-label="map"
       onReady={this.mapReady}
       zoom={this.props.zoom}
       initialCenter={center}
       onClick={this.closeInfoWindow}>
       <InfoWindow
         marker={this.state.activeMarker}
         visible={this.state.showingInfoWindow}
         onClose={this.closeInfoWindow}>
         <div>
           <h3>{amProps && amProps.name}</h3>
           {amProps && amProps.url ? (
             <a href={amProps.url} target="_blank">See Website</a>
           ) : ""}
           {amProps && amProps.images ? (
             <div><img
               alt={amProps.name + " picture"}
               src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix} />
               <p>Image provided by FourSquare</p>
             </div>
           ) : ""}
         </div>
       </InfoWindow>
     </Map>
   )
 }

};
export default Map;
