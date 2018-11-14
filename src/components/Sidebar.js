import React, { Component } from "react";
import Drawer from '@material-ui/core/Drawer';

class Sidebar extends Component {
  state = {
    open:false,
    query: "",
  }

/*  styles = {
    list: {
        width: "250px",
        padding: "0px 15px 0px"
    },
    noBullets: {
        listStyleType: "none",
        padding: 0
    },
    fullList: {
        width: 'auto'
    },
    listItem: {
        marginBottom: "15px"
    },
    listLink: {
        background: "transparent",
        border: "none",
        color: "black"
    },
    filterEntry: {
        border: "1px solid gray",
        padding: "3px",
        margin: "30px 0px 10px",
        width: "100%"
    }
};*/

updateQuery = (newQuery) => {
    this.setState({ query: newQuery });
    this.props.filterLocations(newQuery);
}

render = () => {
    return (
        <div>
            <Drawer open={this.props.open} onClose={this.props.toggleMenu}>
                <div className="sidebarMenu">
                    <input
                        className='filter'
                        type="text"
                        aria-label="Search"
                        placeholder="Search Location"
                        onChange={e => this.updateQuery(e.target.value)}
                        value={this.state.query} />

                    <ul className='list'>
                        {this.props.locations && this.props.locations.map((location, index) => {
                                return (
                                    <li className='listing' key={index}>
                                        <button key={index} onClick={e => this.props.clickListItem(index)}>{location.name}</button>
                                    </li>
                                )
                            })}
                    </ul>
                </div>
            </Drawer>
        </div>
    )
  }
}

export default Sidebar;
