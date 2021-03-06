import React, { Component } from 'react';
import './App.css';
import breweries from './data/breweries.json';
import Map from './components/Map.js';
import Sidebar from './components/Sidebar.js';

class App extends Component {
  state = {
    lat:  42.327099,
    lon: -83.053262,
    zoom: 12,
    all: breweries,
    mapScriptAvailable: true,
    open: false,
    selectedIndex: null
  }

  styles = {
      menuButton: {
        position: "absolute",
        left: 10,
        top: 20,
        background: "#F0F8FF",
        padding: 10
      },
      hide: {
        display: 'none'
      },
      header: {
        marginTop: "0px"
      }
    };

    componentDidMount = () => {
      this.setState({
        ...this.state,
        filtered: this.filterLocations(this.state.all, "")
      });
    }

    toggleDrawer = () => {
      // Toggle value controlling whether the drawer is displayed
      this.setState({
        open: !this.state.open
      });
    }

    updateQuery = (query) => {
      // Update the query value and filter location lists
      this.setState({
        ...this.state,
        selectedIndex: null,
        filtered: this.filterLocations(this.state.all, query)
      });
    }

    filterLocations = (locations, query) => {
      // Filter locations to match query string
      return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
    }

    clickListItem = (index) => {
      // Set state to reflect selected location array index
      this.setState({ selectedIndex: index, open: !this.state.open })
    }

    render = () => {
      return (
        <div className="App">
          <nav className="header">
            <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
              <i className="fa fa-bars"></i>
            </button>
            <h1>The Best Breweries in the Detroit Area</h1>
          </nav>
          <Map
            className="mapContainer"
            lat={this.state.lat}
            lon={this.state.lon}
            zoom={this.state.zoom}
            locations={this.state.filtered}
            selectedIndex={this.state.selectedIndex}
            clickListItem={this.clickListItem} />
          <Sidebar
            className="sidebarMenu"
            locations={this.state.filtered}
            open={this.state.open}
            toggleDrawer={this.toggleDrawer}
            filterLocations={this.updateQuery}
            clickListItem={this.clickListItem} />
        </div>
      );
    }
  }

export default App;
